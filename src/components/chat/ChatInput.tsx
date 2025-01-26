import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";


interface ChatInputProps {
  onSubmit: (message: string) => void;
  loading?: boolean;
}


export function ChatInput({ onSubmit, loading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim() === "") return;
    onSubmit(message);
    setMessage("");
    // focus back to textarea
    if(textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault(); // Prevent new line
      handleSubmit(e);
    }
  };


  return (
    <div className="flex items-end gap-3">
      <form onSubmit={handleSubmit} className="w-full">
        <Textarea
          ref={textareaRef}
          onKeyDown={handleKeyDown}
          value={message}
          placeholder="Write your message here..."
          onChange={(e) => setMessage(e.target.value)}
          className="resize-none border-0 ring-0 focus-visible:ring-0 bg-transparent max-h-[150px] overflow-y-auto scrollbar-thin"
        />
      </form>
      <Button
        onClick={handleSubmit}
        disabled={loading}
        variant="ghost"
        size="icon"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
