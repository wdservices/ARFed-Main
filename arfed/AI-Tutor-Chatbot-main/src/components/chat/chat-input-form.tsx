
"use client";

import { useEffect, useRef, useActionState, startTransition } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal, Loader2 } from "lucide-react";
import { sendMessageToAI, type ChatResponse } from "@/lib/actions";

interface ChatInputFormProps {
  onMessageSent: (messageText: string) => void;
  onAIResponse: (aiResponse: string, userMessageId: string) => void;
  onAIError: (error: string, userMessageId: string) => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0" disabled={pending} aria-label="Send message">
      {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizontal className="h-5 w-5" />}
    </Button>
  );
}

export function ChatInputForm({ onMessageSent, onAIResponse, onAIError }: ChatInputFormProps) {
  const [state, formAction] = useActionState<ChatResponse | null, FormData>(sendMessageToAI, null);
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const userMessageIdRef = useRef<string | null>(null);


  useEffect(() => {
    if (state && userMessageIdRef.current) {
      if (state.success && state.aiResponse) {
        onAIResponse(state.aiResponse, userMessageIdRef.current);
      } else if (!state.success && state.error) {
        onAIError(state.error, userMessageIdRef.current);
      }
      userMessageIdRef.current = null; // Reset after processing
    }
  }, [state, onAIResponse, onAIError]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const messageText = formData.get("message") as string;

    if (messageText && messageText.trim() !== "") {
      const tempUserMessageId = `user-${Date.now()}`;
      userMessageIdRef.current = tempUserMessageId;
      onMessageSent(messageText);
      startTransition(() => {
        formAction(formData);
      });
      formRef.current?.reset();
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="sticky bottom-0 flex w-full items-start gap-2 border-t bg-background p-4"
    >
      <Textarea
        ref={textareaRef}
        name="message"
        placeholder="Type your message..."
        className="flex-1 resize-none rounded-lg border-input p-3 shadow-sm focus-visible:ring-1 focus-visible:ring-ring"
        rows={1}
        onKeyDown={handleKeyDown}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = 'auto';
          target.style.height = `${target.scrollHeight}px`;
        }}
      />
      <SubmitButton />
    </form>
  );
}

