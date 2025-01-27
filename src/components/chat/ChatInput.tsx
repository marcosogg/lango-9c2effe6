import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendHorizontal, Sparkles } from "lucide-react"
import { useState } from "react"
import { VoiceRecorder } from "./VoiceRecorder"
import { cn } from "@/lib/utils"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  messages?: any[]
}

export function ChatInput({ onSend, disabled, messages = [] }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isProcessingVoice, setIsProcessingVoice] = useState(false)
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false)
  const { toast } = useToast()

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

  const generateSuggestion = async () => {
    try {
      setIsGeneratingSuggestion(true)
      
      // Extract topic from the last few messages
      const lastMessages = messages.slice(-3).map(msg => msg.content).join(" ")
      const topic = lastMessages || "general conversation"
      
      const { data, error } = await supabase.functions.invoke("generate-suggestion", {
        body: { 
          topic,
          messages 
        },
      })

      if (error) throw error

      setMessage(data.suggestion)
    } catch (error) {
      console.error("Error generating suggestion:", error)
      toast({
        title: "Error",
        description: "Failed to generate suggestion. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingSuggestion(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={
          isProcessingVoice 
            ? "Processing voice..." 
            : isGeneratingSuggestion 
              ? "Generating suggestion..." 
              : "Type your message..."
        }
        className={cn(
          "min-h-[60px] pr-32 resize-none",
          (isProcessingVoice || isGeneratingSuggestion) && "opacity-50"
        )}
        disabled={disabled || isProcessingVoice || isGeneratingSuggestion}
      />
      <div className="absolute right-2 bottom-2 flex gap-2">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={generateSuggestion}
          disabled={disabled || isProcessingVoice || isGeneratingSuggestion || messages.length === 0}
        >
          <Sparkles className={cn(
            "h-5 w-5",
            isGeneratingSuggestion && "animate-pulse"
          )} />
        </Button>
        <VoiceRecorder
          onTranscription={handleVoiceTranscription}
          disabled={disabled}
          isProcessing={isProcessingVoice}
        />
        <Button
          type="submit"
          size="icon"
          disabled={disabled || !message.trim() || isProcessingVoice || isGeneratingSuggestion}
        >
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </form>
  )
}