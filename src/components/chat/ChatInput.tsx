import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendHorizontal } from "lucide-react"
import { useState } from "react"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSend(message)
      setMessage("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="min-h-[60px] pr-12 resize-none"
        disabled={disabled}
      />
      <Button
        type="submit"
        size="icon"
        className="absolute right-2 bottom-2"
        disabled={disabled || !message.trim()}
      >
        <SendHorizontal className="h-5 w-5" />
      </Button>
    </form>
  )
}