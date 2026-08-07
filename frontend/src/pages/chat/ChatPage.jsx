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
    const messagesEndRef = useRef(null);

    useEffect(() => {
        localStorage.setItem(
            "vaaniseva_chat_history",
            JSON.stringify(messages)
        );

        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    function addBotMessage(text, action, quickActionOptions) {
        setMessages((currentMessages) => [
            ...currentMessages,
            {
                id: Date.now(),
                sender: "bot",
                text,
                action,
                quickActions: quickActionOptions,
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
                botReply.action === "help" ? quickActions : undefined
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
