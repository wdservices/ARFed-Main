import React, { useState, useRef } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";

const API_KEY = "AIzaSyC6y21Jpu4_LPm5DGIfBbGTQ3lzPKumgsM";

const AiTutorChatbot = ({ subject }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm your AI Tutor. Ask me anything about this subject!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);
    try {
      // Gemini API call
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=" + API_KEY,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { parts: [{ text: `Subject: ${subject || "General"}\n${input}` }] },
            ],
          }),
        }
      );
      const data = await res.json();
      console.log('Gemini API response:', data); // Debug log
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        setMessages((msgs) => [...msgs, { role: "ai", text: data.candidates[0].content.parts[0].text }]);
      } else if (data?.error) {
        setMessages((msgs) => [
          ...msgs,
          { role: "ai", text: `Error: ${data.error.message || 'Unknown error from Gemini API.'}` },
        ]);
      } else {
        setMessages((msgs) => [
          ...msgs,
          { role: "ai", text: "Sorry, I couldn't get an answer right now. Please try again later." },
        ]);
      }
    } catch (e) {
      setMessages((msgs) => [
        ...msgs,
        { role: "ai", text: "Sorry, something went wrong. Please try again." },
      ]);
      console.error('Gemini API error:', e);
    }
    setLoading(false);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center focus:outline-none"
        onClick={() => setOpen(true)}
        aria-label="Open AI Tutor Chatbot"
      >
        <FaRobot size={28} />
      </button>
      {/* Chat Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="w-full max-w-md bg-white dark:bg-[#181f2a] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col h-[70vh] sm:h-[32rem]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-bold">
                <FaRobot /> AI Tutor
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-red-500">
                <FaTimes size={20} />
              </button>
            </div>
            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-[#232946]">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={
                    msg.role === "user"
                      ? "text-right"
                      : "text-left"
                  }
                >
                  <span
                    className={
                      msg.role === "user"
                        ? "inline-block bg-indigo-600 text-white px-4 py-2 rounded-2xl mb-1 max-w-[80%]"
                        : "inline-block bg-gray-200 dark:bg-[#10172a] text-gray-900 dark:text-white px-4 py-2 rounded-2xl mb-1 max-w-[80%]"
                    }
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            {/* Input */}
            <form
              className="flex items-center gap-2 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181f2a]"
              onSubmit={e => { e.preventDefault(); sendMessage(); }}
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#232946] text-gray-900 dark:text-white focus:outline-none"
                placeholder="Ask me anything..."
                disabled={loading}
                autoFocus
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 focus:outline-none disabled:opacity-50"
                disabled={loading || !input.trim()}
                aria-label="Send"
              >
                <FaPaperPlane size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AiTutorChatbot; 