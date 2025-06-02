import React, { useState, useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInputForm } from "./ChatInputForm";
import { ScrollArea } from "./ScrollArea";
import { FaTimes } from "react-icons/fa";

export function ChatInterface({ onClose }) {
  const [messages, setMessages] = useState([]);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleMessageSent = (messageText) => {
    const newUserMessage = {
      id: `user-${Date.now()}`,
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };
    addMessage(newUserMessage);
    const loadingAIMessage = {
      id: `ai-loading-${Date.now()}`,
      text: "Thinking...",
      sender: "ai",
      timestamp: new Date(),
      isLoading: true,
    };
    addMessage(loadingAIMessage);
  };

  const handleAIResponse = (aiResponseText) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.isLoading ? { ...msg, text: aiResponseText, isLoading: false, timestamp: new Date() } : msg
      )
    );
  };

  const handleAIError = (errorText) => {
    setMessages((prevMessages) => {
      const filteredMessages = prevMessages.filter((msg) => !msg.isLoading);
      const systemErrorMessage = {
        id: `system-error-${Date.now()}`,
        text: errorText,
        sender: "system",
        timestamp: new Date(),
      };
      return [...filteredMessages, systemErrorMessage];
    });
  };

  return (
    <div className="flex flex-col bg-background h-96 max-h-[80vh] w-full max-w-md fixed bottom-4 right-4 z-50 rounded-xl shadow-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-bold">
          {/* Assuming you have an icon for the AI Tutor */}
          AI Tutor
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-red-500">
          <FaTimes size={20} />
        </button>
      </div>
      <ScrollArea className="flex-1 p-4 overflow-y-auto" ref={scrollAreaRef} style={{height: '300px'}}>
        <div className="space-y-2">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </div>
      </ScrollArea>
      <ChatInputForm 
        onMessageSent={handleMessageSent}
        onAIResponse={handleAIResponse}
        onAIError={handleAIError}
      />
    </div>
  );
} 