import { useEffect, useRef, useState } from "react";
import { sendChatMessage } from "../../services/chatService";

const quickActions = [
    "My Applications",
    "Apply for Certificate",
    "Documents",
    "Help",
];

const defaultMessages = [
    {
        id: 1,
        sender: "bot",
        text: "Namaste Ravi Kumar \u{1F44B}\nHow can I help you?",
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
    const [voiceError, setVoiceError] = useState("");
    const messagesEndRef = useRef(null);
    const speechRecognitionRef = useRef(null);

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

    async function handleSend() {
        const text = input.trim();

        if (!text) {
            return;
        }

        setInput("");

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
        }
    }

    return (
        <div className="h-dvh overflow-hidden bg-slate-100 px-0 py-0 sm:p-6">
            <div className="mx-auto flex h-full w-full max-w-md flex-col bg-white shadow-lg sm:rounded-2xl">
                <header className="flex shrink-0 items-center gap-3 bg-blue-600 px-5 py-4 text-white sm:rounded-t-2xl">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl font-bold text-blue-600">
                        V
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">VaaniSeva</h1>
                        <p className="text-sm text-blue-100">Your service assistant</p>
                    </div>
                </header>

                <main className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-lg leading-relaxed ${
                                    message.sender === "user"
                                        ? "rounded-br-sm bg-blue-600 text-white"
                                        : "rounded-bl-sm bg-white text-slate-800 shadow-sm"
                                }`}
                            >
                                {message.text}

                                {message.applications?.map((application, index) => (
                                    <div
                                        key={`${application.service_name}-${application.submitted_date}-${index}`}
                                        className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-base text-slate-800"
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
                                    <div className="mt-4 grid gap-2">
                                        {message.quickActions.map((action) => (
                                            <button
                                                key={action}
                                                onClick={() => handleQuickAction(action)}
                                                className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-left text-base font-semibold text-blue-700"
                                            >
                                                {action}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {message.action && (
                                    <button
                                        onClick={() => openPage(message.action.path)}
                                        className="mt-4 rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white"
                                    >
                                        {message.action.label}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </main>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleSend();
                    }}
                    className="flex shrink-0 gap-2 border-t bg-white p-3 sm:rounded-b-2xl"
                >
                    <div className="min-w-0 flex-1">
                        <input
                            type="text"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            placeholder="Type your message"
                            className="w-full rounded-full border border-slate-300 px-4 py-3 text-lg outline-none focus:border-blue-600"
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
                        className={`rounded-full px-4 py-3 text-lg font-semibold text-white ${
                            isListening
                                ? "animate-pulse bg-red-500"
                                : "bg-blue-600"
                        }`}
                    >
                        🎤
                    </button>
                    <button
                        type="submit"
                        className="rounded-full bg-blue-600 px-5 py-3 text-lg font-semibold text-white"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
