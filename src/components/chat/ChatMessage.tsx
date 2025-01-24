import { cn } from "@/lib/utils"

interface ChatMessageProps {
  message: string
  isUser: boolean
}

export function ChatMessage({ message, isUser }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex w-full gap-3 p-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "relative max-w-[85%] rounded-2xl px-6 py-4 text-sm shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground ml-12"
            : "bg-white text-foreground mr-12",
          "animate-fade-in"
        )}
      >
        {message}
      </div>
    </div>
  )
}