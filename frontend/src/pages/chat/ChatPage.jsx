import { useEffect, useRef, useState } from "react";

const quickActions = [
    "My Applications",
    "Apply for Certificate",
    "Documents",
    "Help",
];

const certificateDocuments = {
    "Income Certificate": ["Aadhaar Card", "Address Proof", "Income Proof"],
    "Residence Certificate": ["Aadhaar Card", "Address Proof", "Residence Proof"],
    "Birth Certificate": ["Aadhaar Card", "Birth Proof", "Address Proof"],
    "Community Certificate": ["Aadhaar Card", "Address Proof", "Community Proof"],
};

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
    const messagesEndRef = useRef(null);

    useEffect(() => {
        localStorage.setItem(
            "vaaniseva_chat_history",
            JSON.stringify(messages)
        );

        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    function addBotMessage(text, action, certificateOptions) {
        setMessages((currentMessages) => [
            ...currentMessages,
            {
                id: Date.now(),
                sender: "bot",
                text,
                action,
                certificateOptions,
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

    function getCertificateReply(certificateName) {
        const documents = certificateDocuments[certificateName];
        const article = certificateName === "Income Certificate" ? "an" : "a";

        return {
            text: `Sure, I can help you apply for ${article} ${certificateName}.\n\nRequired documents:\n${documents.map((document) => `• ${document}`).join("\n")}\n\nWould you like to apply now?`,
            action: {
                label: `Apply for ${certificateName}`,
                path: `/apply?service=${encodeURIComponent(certificateName)}`,
            },
        };
    }

    function handleCertificateSelection(certificateName) {
        const botReply = getCertificateReply(certificateName);

        addBotMessage(botReply.text, botReply.action);
    }

    function getBotReply(message) {
        const normalizedMessage = message.toLowerCase();

        if (["application", "applications", "status", "certificate status", "my certificate"].some(
            (keyword) => normalizedMessage.includes(keyword)
        )) {
            return {
                text: "You can check your applications here.",
                action: {
                    label: "Open My Applications",
                    path: "/applications",
                },
            };
        }

        const certificateName = Object.keys(certificateDocuments).find(
            (certificate) => normalizedMessage.includes(certificate.toLowerCase())
        );

        if (certificateName) {
            return getCertificateReply(certificateName);
        }

        if (normalizedMessage.includes("certificate")) {
            return {
                text: "Which certificate do you need?",
                certificateOptions: Object.keys(certificateDocuments),
            };
        }

        if (normalizedMessage.includes("apply")) {
            return {
                text: "You can apply for a certificate here.",
                action: {
                    label: "Open Apply Page",
                    path: "/apply",
                },
            };
        }

        if (["document", "documents", "uploaded file", "files"].some(
            (keyword) => normalizedMessage.includes(keyword)
        )) {
            return {
                text: "You can view your documents here.",
                action: {
                    label: "Open Documents",
                    path: "/documents",
                },
            };
        }

        if (["help", "what can you do"].some(
            (keyword) => normalizedMessage.includes(keyword)
        )) {
            return {
                text: "I can help you check applications, apply for certificates, and view uploaded documents.",
            };
        }

        return {
            text: "I am here to help you with certificates and applications. Please ask me about applications, certificates, or documents.",
        };
    }

    function handleSend() {
        const text = input.trim();

        if (!text) {
            return;
        }

        const botReply = getBotReply(text);

        setMessages((currentMessages) => [
            ...currentMessages,
            {
                id: Date.now(),
                sender: "user",
                text,
            },
            {
                id: Date.now() + 1,
                sender: "bot",
                text: botReply.text,
                action: botReply.action,
                certificateOptions: botReply.certificateOptions,
            },
        ]);
        setInput("");
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

                                {message.certificateOptions && (
                                    <div className="mt-4 grid gap-2">
                                        {message.certificateOptions.map((certificateName) => (
                                            <button
                                                key={certificateName}
                                                onClick={() => handleCertificateSelection(certificateName)}
                                                className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-left text-base font-semibold text-blue-700"
                                            >
                                                {certificateName}
                                            </button>
                                        ))}
                                    </div>
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
                    <input
                        type="text"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder="Type your message"
                        className="min-w-0 flex-1 rounded-full border border-slate-300 px-4 py-3 text-lg outline-none focus:border-blue-600"
                    />
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
