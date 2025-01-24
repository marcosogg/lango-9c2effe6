import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendHorizontal } from "lucide-react"
import { useState } from "react"
import { VoiceRecorder } from "./VoiceRecorder"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isProcessingVoice, setIsProcessingVoice] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSend(message)
      setMessage("")
    }
  }

  const handleVoiceTranscription = (text: string) => {
    setIsProcessingVoice(true)
    setMessage(text)
    setIsProcessingVoice(false)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isProcessingVoice ? "Processing voice..." : "Type your message..."}
        className={cn(
          "min-h-[60px] pr-24 resize-none",
          isProcessingVoice && "opacity-50"
        )}
        disabled={disabled || isProcessingVoice}
      />
      <div className="absolute right-2 bottom-2 flex gap-2">
        <VoiceRecorder
          onTranscription={handleVoiceTranscription}
          disabled={disabled}
          isProcessing={isProcessingVoice}
        />
        <Button
          type="submit"
          size="icon"
          disabled={disabled || !message.trim() || isProcessingVoice}
        >
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </form>
  )
}