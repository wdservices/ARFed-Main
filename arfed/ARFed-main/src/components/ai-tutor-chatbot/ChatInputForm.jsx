import React, { useRef } from "react";
// import { Button } from "../ui/Button";
// import { Textarea } from "../ui/Textarea";
// import { SendHorizontal, Loader2 } from "lucide-react";

export function ChatInputForm({ onMessageSent, onAIResponse, onAIError }) {
  const formRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const messageText = formData.get("message");
    if (messageText && messageText.trim() !== "") {
      onMessageSent(messageText);
      // Simulate AI response for now
      setTimeout(() => {
        onAIResponse("This is a simulated AI response.");
      }, 1000);
      formRef.current?.reset();
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (event) => {
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
      {/* <Textarea ... /> */}
      <textarea
        ref={textareaRef}
        name="message"
        placeholder="Type your message..."
        className="flex-1 resize-none rounded-lg border p-3 shadow-sm"
        rows={1}
        onKeyDown={handleKeyDown}
      />
      {/* <Button ... /> */}
      <button type="submit">Send</button>
    </form>
  );
} 