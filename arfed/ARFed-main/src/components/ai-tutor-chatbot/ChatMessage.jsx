import React from "react";
// import { cn } from "../../lib/utils";
// import { Avatar, AvatarFallback } from "../ui/Avatar";
// import { Button } from "../ui/Button";
// import { Copy, User, Bot, AlertTriangle } from "lucide-react";
// import { useToast } from "../../hooks/use-toast";
// import { Skeleton } from "../ui/Skeleton";

export function ChatMessage({ message }) {
  // Placeholder logic for user/AI/system
  const isUser = message.sender === "user";
  const isAI = message.sender === "ai";
  const isSystem = message.sender === "system";

  return (
    <div>
      <div>{isUser ? "User:" : isAI ? "AI:" : "System:"} {message.text}</div>
    </div>
  );
} 