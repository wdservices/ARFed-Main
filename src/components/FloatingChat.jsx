import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [userId, setUserId] = useState(null);

  // Initialize user ID on component mount
  useEffect(() => {
    // Generate a random user ID with fallback for mobile browsers
    const generateUserId = () => {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      } else {
        // Fallback for browsers that don't support crypto.randomUUID
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
    };
    setUserId(generateUserId());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to send message to the Gemini API
  const sendMessage = async () => {
    if (inputMessage.trim() === '' || isLoading) return;

    const userMessage = { sender: 'user', text: inputMessage };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare chat history for the API call
      let chatHistory = [
        {
          role: "user",
          parts: [{ text: "From now on, please provide precise, direct answers. Do not use jargon or special formatting like asterisks. Get straight to the point." }]
        },
        {
          role: "model",
          parts: [{ text: "Understood. I will provide precise, direct answers without jargon or special formatting." }]
        },
        ...messages.map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        })),
        { role: "user", parts: [{ text: inputMessage }] }
      ];

      const payload = { contents: chatHistory };
      const apiKey = "AIzaSyDrc7mUiHv8mgybzRVOG7_NGmfNdKJ2qsw";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorData.error.message}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const aiResponseText = result.candidates[0].content.parts[0].text;
        setMessages((prevMessages) => [...prevMessages, { sender: 'ai', text: aiResponseText }]);
      } else {
        console.warn("Unexpected API response structure:", result);
        setMessages((prevMessages) => [...prevMessages, { sender: 'ai', text: "Sorry, I couldn't generate a response." }]);
      }
    } catch (error) {
      console.error("Error communicating with Gemini API:", error);
      setMessages((prevMessages) => [...prevMessages, { sender: 'ai', text: "Error: Could not connect to the AI. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="floating-chat-button fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 z-50 animate-breath"
      >
        <FaRobot size={24} />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col">
            {/* Header */}
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FaRobot className="text-purple-600" size={20} />
                <h3 className="font-semibold text-gray-800 dark:text-white">ARFed AI Tutor</h3>
                {userId && (
                  <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {userId.slice(0, 8)}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                  <p>Start a conversation with your AI tutor!</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-lg ${
                        message.sender === "user"
                          ? "bg-purple-600 text-white rounded-br-none"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-none px-4 py-3 text-gray-800 dark:text-gray-200">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-3 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || inputMessage.trim() === ''}
                  className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FaPaperPlane />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChat; 