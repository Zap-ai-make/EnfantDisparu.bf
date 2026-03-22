"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Loader2, Bot, User, Minimize2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Bonjour ! Je suis l'assistant EnfantDisparu.bf. Comment puis-je vous aider aujourd'hui ?\n\nJe peux vous aider avec :\n- Signaler un enfant disparu\n- Suivre une annonce existante\n- Devenir ambassadeur\n- Questions générales",
  timestamp: new Date(),
};

// API OpenClaw VPS
const CHATBOT_API_URL = "https://openclaw.srv1066171.hstgr.cloud/chat";

// Générer ou récupérer un sessionId unique par utilisateur
function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem("chatbot_session_id");
  if (!sessionId) {
    sessionId = "sess-" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem("chatbot_session_id", sessionId);
  }
  return sessionId;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [displayedText, setDisplayedText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Effet de frappe mot par mot pour les messages assistant
  useEffect(() => {
    if (!typingMessageId) return;

    const message = messages.find((m) => m.id === typingMessageId);
    if (!message) return;

    const fullText = message.content;

    // Si on a affiché tout le texte, arrêter
    if (displayedText === fullText) {
      setTypingMessageId(null);
      return;
    }

    // Trouver le prochain mot à ajouter
    const remainingText = fullText.substring(displayedText.length);

    // Trouver la fin du prochain "chunk" (mot + espace ou ponctuation)
    let nextChunkEnd = 0;

    // Ajouter caractère par caractère pour ponctuation/newlines, mot par mot sinon
    if (remainingText[0] === '\n' || remainingText[0] === ' ') {
      nextChunkEnd = 1;
    } else {
      // Trouver la fin du mot (espace, newline, ou fin de texte)
      const spaceIndex = remainingText.search(/[\s\n]/);
      nextChunkEnd = spaceIndex === -1 ? remainingText.length : spaceIndex + 1;
    }

    const timeout = setTimeout(() => {
      setDisplayedText(fullText.substring(0, displayedText.length + nextChunkEnd));
    }, 50); // 50ms par mot pour un effet visible

    return () => clearTimeout(timeout);
  }, [typingMessageId, displayedText, messages]);

  // Scroll to bottom when new message
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, scrollToBottom, displayedText]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Clear unread when opened
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const sessionId = getSessionId();
      const response = await fetch(CHATBOT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          message: userMessage.content,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur de communication");
      }

      const data = await response.json();

      const messageId = `assistant-${Date.now()}`;
      const assistantMessage: Message = {
        id: messageId,
        role: "assistant",
        content: data.reply || "Désolé, je n'ai pas pu traiter votre demande.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Déclencher l'effet de frappe
      setDisplayedText("");
      setTypingMessageId(messageId);

      // Mark as unread if chat is closed
      if (!isOpen) {
        setHasUnread(true);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorId = `error-${Date.now()}`;
      const errorMessage: Message = {
        id: errorId,
        role: "assistant",
        content: "Désolé, une erreur est survenue. Veuillez réessayer ou contacter notre équipe directement.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setDisplayedText("");
      setTypingMessageId(errorId);
    } finally {
      setIsLoading(false);
    }
  };

  // Réinitialiser la conversation
  const resetConversation = async () => {
    const sessionId = getSessionId();
    try {
      await fetch(`${CHATBOT_API_URL}/${sessionId}`, { method: "DELETE" });
    } catch {
      // Ignorer les erreurs de suppression
    }
    // Générer un nouveau sessionId
    localStorage.removeItem("chatbot_session_id");
    setMessages([INITIAL_MESSAGE]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col transition-all duration-300",
            isMinimized
              ? "bottom-24 right-4 w-72 h-14"
              : "bottom-24 right-4 w-[360px] h-[500px] sm:w-[400px] sm:h-[550px]"
          )}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 rounded-t-2xl flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Assistant EnfantDisparu</h3>
                <p className="text-xs text-red-100">
                  {isLoading || typingMessageId ? "En train d'écrire..." : "En ligne"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={resetConversation}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Nouvelle conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title={isMinimized ? "Agrandir" : "Réduire"}
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-red-600" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                        message.role === "user"
                          ? "bg-red-600 text-white rounded-br-md"
                          : "bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm"
                      )}
                    >
                      <p className="whitespace-pre-wrap">
                        {message.id === typingMessageId ? displayedText : message.content}
                        {message.id === typingMessageId && (
                          <span className="inline-block w-0.5 h-4 bg-gray-400 ml-0.5 animate-pulse" />
                        )}
                      </p>
                      {message.id !== typingMessageId && (
                        <p
                          className={cn(
                            "text-[10px] mt-1",
                            message.role === "user" ? "text-red-200" : "text-gray-400"
                          )}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      )}
                    </div>
                    {message.role === "user" && (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-gray-200 bg-white rounded-b-2xl flex-shrink-0">
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Écrivez votre message..."
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent max-h-24"
                    rows={1}
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white p-2.5 rounded-xl transition-colors flex-shrink-0"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 text-center mt-2">
                  Propulsé par EnfantDisparu.bf
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setIsMinimized(false);
        }}
        className={cn(
          "fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110",
          isOpen
            ? "bg-gray-600 hover:bg-gray-700"
            : "bg-red-600 hover:bg-red-700"
        )}
        title={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white" />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                !
              </span>
            )}
          </>
        )}
      </button>

      {/* Quick Actions (when closed) */}
      {!isOpen && (
        <div className="fixed bottom-20 right-4 z-40 opacity-0 hover:opacity-100 transition-opacity">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 text-sm text-gray-600 max-w-[200px]">
            <p className="font-medium text-gray-800 mb-1">Besoin d&apos;aide ?</p>
            <p className="text-xs">Cliquez pour discuter avec notre assistant.</p>
          </div>
        </div>
      )}
    </>
  );
}
