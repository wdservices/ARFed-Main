"use client";

import type { ChatMessageData } from "@/types/chat";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, User, Bot, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatMessageProps {
  message: ChatMessageData;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { toast } = useToast();
  const isUser = message.sender === "user";
  const isAI = message.sender === "ai";
  const isSystem = message.sender === "system";

  const handleCopy = () => {
    if (message.text) {
      navigator.clipboard.writeText(message.text)
        .then(() => {
          toast({ title: "Copied to clipboard!" });
        })
        .catch(err => {
          console.error("Failed to copy: ", err);
          toast({ title: "Failed to copy", variant: "destructive" });
        });
    }
  };

  const avatarContent = isUser ? (
    <User className="h-5 w-5" />
  ) : isAI ? (
    <Bot className="h-5 w-5" />
  ) : (
    <AlertTriangle className="h-5 w-5" />
  );
  
  const avatarBgColor = isUser ? "bg-primary/20 text-primary" : isAI ? "bg-accent/20 text-accent" : "bg-destructive/20 text-destructive";

  return (
    <div
      className={cn(
        "flex items-start gap-3 animate-message-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className={cn("h-8 w-8", avatarBgColor)}>
          {/* Placeholder for actual avatar image if available */}
          {/* <AvatarImage src="https://placehold.co/40x40.png" alt={message.sender} /> */}
          <AvatarFallback className={cn("text-sm", avatarBgColor)}>
            {avatarContent}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[70%] rounded-lg p-3 shadow-md",
          isUser
            ? "bg-primary text-primary-foreground"
            : isSystem ? "bg-destructive/10 border border-destructive/30 text-destructive-foreground" : "bg-card text-card-foreground"
        )}
      >
        {message.isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm">{message.text}</p>
        )}
        {isAI && !message.isLoading && (
          <Button
            variant="ghost"
            size="icon"
            className="mt-2 h-7 w-7 text-muted-foreground hover:text-accent"
            onClick={handleCopy}
            aria-label="Copy message"
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
      </div>
      {isUser && (
         <Avatar className={cn("h-8 w-8", avatarBgColor)}>
          <AvatarFallback className={cn("text-sm", avatarBgColor)}>
            {avatarContent}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
