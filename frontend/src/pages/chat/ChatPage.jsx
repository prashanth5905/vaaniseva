import { useEffect, useRef, useState } from "react";
import {
    ClipboardList,
    FileText,
    Landmark,
    MessageCircleQuestion,
    Mic,
    MoreVertical,
    Send,
    ShieldCheck,
} from "lucide-react";
import { sendChatMessage } from "../../services/chatService";
import { getCitizenProfile } from "../../services/citizenService";

const quickActions = [
    "My Applications",
    "Apply for Certificate",
    "Documents",
    "Help",
];

const quickActionDetails = {
    "My Applications": {
        icon: ClipboardList,
        description: "Check application status",
    },
    "Apply for Certificate": {
        icon: FileText,
        description: "Start a new application",
    },
    Documents: {
        icon: Landmark,
        description: "View uploaded documents",
    },
    Help: {
        icon: MessageCircleQuestion,
        description: "Ask a service question",
    },
};

const defaultMessages = [
    {
        id: 1,
        sender: "bot",
        text: "Namaste! \u{1F44B}\nHow can I help you?",
        quickActions,
    },
];

export default function ChatPage() {
    const [messages, setMessages] = useState(() => {
        try {
            const savedMessages = localStorage.getItem("vaaniseva_chat_history");

            if (savedMessages) {
                const parsedMessages = JSON.parse(savedMessages);

                if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
                    return parsedMessages;
                }
            }
        } catch (error) {
            console.error("Unable to restore chat history.", error);
        }

        return defaultMessages;
    });
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [voiceError, setVoiceError] = useState("");
    const messagesEndRef = useRef(null);
    const speechRecognitionRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        localStorage.setItem(
            "vaaniseva_chat_history",
            JSON.stringify(messages)
        );

        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => () => {
        speechRecognitionRef.current?.abort();
    }, []);

    useEffect(() => {
        async function loadCitizenGreeting() {
            try {
                const citizen = await getCitizenProfile();

                setMessages((currentMessages) => currentMessages.map((message) => (
                    message.id === 1 && message.sender === "bot"
                        ? {
                            ...message,
                            text: `Namaste ${citizen.name} 👋\nHow can I help you?`,
                        }
                        : message
                )));
            } catch (error) {
                console.error("Unable to load citizen profile for chat greeting.", error);
            }
        }

        loadCitizenGreeting();
    }, []);

    function addBotMessage(text, action, quickActionOptions, applications) {
        setMessages((currentMessages) => [
            ...currentMessages,
            {
                id: Date.now(),
                sender: "bot",
                text,
                action,
                quickActions: quickActionOptions,
                applications,
            },
        ]);
    }

    function openPage(path) {
        window.open(path, "_blank", "noopener,noreferrer");
    }

    function handleQuickAction(action) {
        if (action === "My Applications") {
            addBotMessage("You can view your applications here", {
                label: "Open My Applications",
                path: "/applications",
            });
            return;
        }

        if (action === "Apply for Certificate") {
            addBotMessage("You can apply for certificates here", {
                label: "Open Apply Page",
                path: "/apply",
            });
            return;
        }

        if (action === "Documents") {
            openPage("/documents");
            return;
        }

        addBotMessage("Please choose an option above to continue.");
    }

    function getActionButton(action, service) {
        if (action === "applications") {
            return {
                label: "Open My Applications",
                path: "/applications",
            };
        }

        if (action === "documents") {
            return {
                label: "Open Documents",
                path: "/documents",
            };
        }

        if (action === "apply") {
            return {
                label: service ? `Apply for ${service}` : "Open Apply Page",
                path: service
                    ? `/apply?service=${encodeURIComponent(service)}`
                    : "/apply",
            };
        }

        return undefined;
    }

    function formatSubmittedDate(submittedDate) {
        const date = new Date(submittedDate);

        if (Number.isNaN(date.getTime())) {
            return submittedDate;
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    function formatStatus(status) {
        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    function handleVoiceInput() {
        if (isListening) {
            speechRecognitionRef.current?.stop();
            return;
        }

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setVoiceError("Voice input is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();

        recognition.lang = "en-IN";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setVoiceError("");
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            setInput(event.results[event.resultIndex][0].transcript);
        };

        recognition.onerror = (event) => {
            if (event.error !== "aborted") {
                setVoiceError("Unable to recognize speech. Please try again.");
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        speechRecognitionRef.current = recognition;

        try {
            recognition.start();
        } catch (error) {
            setVoiceError("Unable to start voice input. Please try again.");
            setIsListening(false);
        }
    }

    function clearChat() {
        localStorage.removeItem("vaaniseva_chat_history");
        setMessages(defaultMessages);
        setIsMenuOpen(false);
    }

    function toggleMenu() {
        setIsMenuOpen((current) => !current);
    }

    function handleClickOutside(event) {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsMenuOpen(false);
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    async function handleSend() {
        const text = input.trim();

        if (!text || isSending) {
            return;
        }

        setInput("");
        setIsSending(true);

        setMessages((currentMessages) => [
            ...currentMessages,
            {
                id: Date.now(),
                sender: "user",
                text,
            },
        ]);

        try {
            const botReply = await sendChatMessage(text);

            addBotMessage(
                botReply.reply,
                getActionButton(botReply.action, botReply.service),
                botReply.action === "help" ? quickActions : undefined,
                botReply.applications
            );
        } catch (error) {
            addBotMessage(
                error.response?.data?.detail ||
                "Unable to send your message. Please try again."
            );
        } finally {
            setIsSending(false);
        }
    }

    return (
        <div className="h-dvh overflow-hidden bg-slate-100 p-0 sm:p-6 lg:p-8">
            <div className="mx-auto grid h-full w-full max-w-6xl overflow-hidden bg-white shadow-2xl shadow-slate-300/40 sm:rounded-3xl lg:grid-cols-[0.7fr_1.3fr]">
                <aside className="relative hidden overflow-hidden bg-blue-700 p-8 text-white lg:flex lg:flex-col">
                    <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-blue-500/60" />
                    <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full border-[24px] border-blue-500/40" />

                    <div className="relative">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
                                <Landmark size={23} aria-hidden="true" />
                            </div>
                            <span className="text-xl font-bold">VaaniSeva</span>
                        </div>

                        <p className="mt-16 text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
                            Your service assistant
                        </p>
                        <h2 className="mt-3 text-4xl font-bold leading-tight">
                            Government services, one conversation away.
                        </h2>
                        <p className="mt-5 max-w-sm text-base leading-7 text-blue-100">
                            Ask a question, begin an application, or find your documents without navigating a complicated portal.
                        </p>
                    </div>

                    <div className="relative mt-auto rounded-2xl border border-white/15 bg-white/10 p-5">
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="mt-0.5 shrink-0" size={21} aria-hidden="true" />
                            <div>
                                <p className="font-semibold">A simpler service journey</p>
                                <p className="mt-1 text-sm leading-6 text-blue-100">
                                    Get guidance for certificates, applications, and uploaded documents in one place.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="flex min-h-0 flex-col bg-white">
                <header className="relative flex shrink-0 items-center gap-3 border-b border-blue-500/30 bg-blue-700 px-5 py-4 text-white sm:rounded-tr-3xl lg:rounded-none">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl font-bold text-blue-600">
                        V
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">VaaniSeva</h1>
                        <p className="text-sm text-blue-100">Here to guide you</p>
                    </div>

                    <div className="ml-auto relative" ref={menuRef}>
                        <button
                            type="button"
                            aria-label="Chat options"
                            onClick={toggleMenu}
                            className="rounded-full p-2 text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            <MoreVertical size={21} aria-hidden="true" />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-44 rounded-xl bg-white shadow-lg ring-1 ring-slate-200">
                                <button
                                    type="button"
                                    onClick={clearChat}
                                    disabled={isSending}
                                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
                                >
                                    Clear Chat
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <main className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4 sm:p-6">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-base leading-relaxed sm:max-w-[76%] ${
                                    message.sender === "user"
                                        ? "rounded-br-sm bg-blue-600 text-white"
                                        : "rounded-bl-sm bg-white text-slate-800 shadow-sm"
                                }`}
                            >
                                {message.text}

                                {message.applications?.map((application, index) => (
                                    <div
                                        key={`${application.service_name}-${application.submitted_date}-${index}`}
                                        className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800"
                                    >
                                        <p className="font-semibold">
                                            {application.service_name}
                                        </p>
                                        <p className="mt-1">
                                            Status: {formatStatus(application.status)}
                                        </p>
                                        <p>
                                            Submitted: {formatSubmittedDate(application.submitted_date)}
                                        </p>
                                    </div>
                                ))}

                                {message.quickActions && (
                                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                        {message.quickActions.map((action) => (
                                            (() => {
                                                const details = quickActionDetails[action];
                                                const ActionIcon = details?.icon || MessageCircleQuestion;

                                                return (
                                                    <button
                                                        key={action}
                                                        onClick={() => handleQuickAction(action)}
                                                        className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-left transition hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                    >
                                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 transition group-hover:bg-blue-100">
                                                            <ActionIcon size={18} aria-hidden="true" />
                                                        </span>
                                                        <span>
                                                            <span className="block text-sm font-semibold text-slate-800">{action}</span>
                                                            {details?.description && (
                                                                <span className="mt-0.5 block text-xs text-slate-500">{details.description}</span>
                                                            )}
                                                        </span>
                                                    </button>
                                                );
                                            })()
                                        ))}
                                    </div>
                                )}

                                {message.action && (
                                    <button
                                        onClick={() => openPage(message.action.path)}
                                        className="mt-4 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                                    >
                                        {message.action.label}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {isSending && (
                        <div className="flex justify-start">
                            <div className="max-w-[60%] rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                                VaaniSeva is typing...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </main>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleSend();
                    }}
                    className="flex shrink-0 gap-2 border-t bg-white p-3 sm:rounded-br-3xl"
                >
                    <div className="min-w-0 flex-1">
                        <input
                            type="text"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            placeholder="Type your message"
                            className="w-full rounded-full border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />

                        {isListening && (
                            <p className="mt-1 text-sm text-blue-600">
                                Listening...
                            </p>
                        )}

                        {voiceError && (
                            <p className="mt-1 text-sm text-red-600">
                                {voiceError}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={handleVoiceInput}
                        aria-label={isListening ? "Stop voice input" : "Start voice input"}
                        className={`flex h-12 w-12 items-center justify-center rounded-full text-white transition focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                            isListening
                                ? "animate-pulse bg-red-500"
                                : "bg-blue-600"
                        }`}
                    >
                        <Mic size={20} aria-hidden="true" />
                    </button>
                    <button
                        type="submit"
                        disabled={isSending}
                        className="flex h-12 items-center gap-2 rounded-full bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                        {isSending ? "Sending..." : <><Send size={17} aria-hidden="true" /> Send</>}
                    </button>
                </form>
                </div>
            </div>
        </div>
    );
}
