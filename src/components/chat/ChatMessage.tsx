import { useState, useRef } from "react"
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface ChatMessageProps {
  message: string
  isUser: boolean
}

export function ChatMessage({ message, isUser }: ChatMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  const handleGenerateAudio = async () => {
    try {
      setIsLoading(true)
      
      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: { text: message },
      })

      if (error) throw error

      const base64Audio = data.audioContent
      const audioBlob = new Blob(
        [Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0))],
        { type: 'audio/mp3' }
      )
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)

      if (audioRef.current) {
        audioRef.current.src = url
        audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error("Error generating audio:", error)
      toast({
        title: "Error",
        description: "Failed to generate audio. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

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
        {!isUser && (
          <div className="mt-2 flex items-center gap-2">
            {!audioUrl ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleGenerateAudio}
                disabled={isLoading}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleRestart}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </>
            )}
            <audio
              ref={audioRef}
              onEnded={handleAudioEnded}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  )
}