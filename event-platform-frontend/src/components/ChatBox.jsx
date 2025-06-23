import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

const ChatBox = ({ onSend, messages, setMessages, onClose }) => {
  const [input, setInput] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Salut! Pot să-ți recomand evenimente pe baza întrebărilor tale."
          }
        ]);
      }, 500);
    }
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="fixed bottom-20 right-4 w-[360px] max-h-[520px] bg-white shadow-xl rounded-2xl flex flex-col overflow-hidden border border-emerald-500 z-50 animate-fade-in">
      <div className="bg-[#1D5C5F] text-white flex justify-between items-center px-4 py-2 font-semibold">
        <span>Chat AI - Recomandări evenimente</span>
        <button onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-3 flex flex-col gap-2"
      >
        {messages.map((msg, idx) =>
          Array.isArray(msg.suggestions) && msg.suggestions.length > 0 ? (
            <div
              key={idx}
              className="self-start border border-emerald-400 text-[#1D5C5F] text-sm px-3 py-2 rounded-lg flex flex-col gap-2"
            >
              {msg.suggestions.map((sug, i) =>
                sug._id ? (
                  <div key={i} className="p-2 border-b border-gray-200">
                    <a
                      href={`/events/${sug._id}`}
                      className="text-blue-600 font-semibold hover:underline block"
                    >
                      🎯 {sug.title}
                    </a>
                    <p className="text-xs text-gray-700">
                      📍 Locație: {sug.location || "necunoscută"}
                    </p>
                    <p className="text-xs text-gray-700">
                      📅 Dată: {sug.date?.split("T")[0] || "Nespecificată"}
                    </p>
                    <p className="text-xs text-gray-700">
                      🏷️ Tip: {sug.type || "-"}
                    </p>
                  </div>
                ) : (
                  <span key={i}>{sug.title}</span>
                )
              )}
            </div>
          ) : msg.message ? (
            <div
              key={idx}
              className="self-start border border-red-400 text-red-700 bg-red-50 text-sm px-3 py-2 rounded-lg"
            >
              {msg.message}
            </div>
          ) : (
            <div
              key={idx}
              className={`text-sm px-3 py-2 rounded-lg whitespace-pre-wrap ${
                msg.sender === "user"
                  ? "self-end bg-gray-100 text-right"
                  : "self-start border border-emerald-400 text-[#1D5C5F]"
              }`}
            >
              {msg.text}
            </div>
          )
        )}
      </div>

      <div className="p-3 border-t border-gray-200 flex gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
          placeholder="Scrie o întrebare..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="bg-[#1D5C5F] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#15494b]"
          onClick={handleSend}
        >
          Trimite
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
