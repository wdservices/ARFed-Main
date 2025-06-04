"use client";

import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "./chat-message";
import { ChatInputForm } from "./chat-input-form";
import type { ChatMessageData } from "@/types/chat";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  const addMessage = (message: ChatMessageData) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };
  
  const handleMessageSent = (messageText: string) => {
    const newUserMessage: ChatMessageData = {
      id: `user-${Date.now()}`,
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };
    addMessage(newUserMessage);

    // Add a temporary loading message for AI
    const loadingAIMessage: ChatMessageData = {
      id: `ai-loading-${Date.now()}`,
      text: "Thinking...",
      sender: "ai",
      timestamp: new Date(),
      isLoading: true,
    };
    addMessage(loadingAIMessage);
  };

  const handleAIResponse = (aiResponseText: string) => {
    setMessages((prevMessages) => 
      prevMessages.map(msg => 
        msg.isLoading ? { ...msg, text: aiResponseText, isLoading: false, timestamp: new Date() } : msg
      )
    );
  };

  const handleAIError = (errorText: string) => {
     setMessages((prevMessages) => {
      // Remove loading message
      const filteredMessages = prevMessages.filter(msg => !msg.isLoading);
      // Add system error message
      const systemErrorMessage: ChatMessageData = {
        id: `system-error-${Date.now()}`,
        text: errorText,
        sender: "system",
        timestamp: new Date(),
      };
      return [...filteredMessages, systemErrorMessage];
    });
  };


  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-background"> {/* 4rem is approx header height */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="container mx-auto max-w-3xl space-y-4 ">
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
