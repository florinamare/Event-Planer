//chatwidget.jsx
import { useState } from "react";
import ChatBox from "./ChatBox";
import { MessageCircle } from "lucide-react";

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async (message) => {
  setMessages((prev) => [...prev, { sender: "user", text: message }]);

  try {
    const res = await fetch("http://localhost:8000/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message }),
    });

    const data = await res.json();

    if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
      setMessages((prev) => [...prev, { sender: "bot", suggestions: data.suggestions }]);
    } else if (data.message) {
      // mesajul de la backend când nu găsește nimic
      setMessages((prev) => [...prev, { sender: "bot", message: data.message }]);
    } else {
      setMessages((prev) => [...prev, { sender: "bot", text: "Nu s-au găsit sugestii." }]);
    }
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "A apărut o eroare la trimiterea mesajului." },
    ]);
  }
};


  return (
    <>
      <button
        className="fixed bottom-4 right-4 w-14 h-14 bg-[#1D5C5F] text-white rounded-full shadow-lg z-40 flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {isOpen && (
        <ChatBox
        onSend={handleSendMessage}
        messages={messages}
        setMessages={setMessages}
        onClose={() => setIsOpen(false)}
      />
      
      )}
    </>
  );
}

export default ChatWidget;
