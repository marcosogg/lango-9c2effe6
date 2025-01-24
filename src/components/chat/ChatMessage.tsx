import { useState, useRef } from "react"
import { Play, Pause, RotateCcw, Volume2, Globe, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
  const [isTranslating, setIsTranslating] = useState(false)
  const [translation, setTranslation] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  const handleTranslate = async (targetLanguage: string) => {
    try {
      setIsTranslating(true)
      setTranslation(null)

      const { data, error } = await supabase.functions.invoke("translate", {
        body: { text: message, targetLanguage },
      })

      if (error) throw error

      setTranslation(data.translation)
    } catch (error) {
      console.error("Translation error:", error)
      toast({
        title: "Error",
        description: "Failed to translate message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

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
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
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
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Globe className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Translate Message</h3>
                  <div className="space-y-2">
                    {["Spanish", "French", "German", "Italian", "Portuguese"].map((lang) => (
                      <Button
                        key={lang}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleTranslate(lang)}
                        disabled={isTranslating}
                      >
                        {isTranslating ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Globe className="mr-2 h-4 w-4" />
                        )}
                        {lang}
                      </Button>
                    ))}
                  </div>
                  {translation && (
                    <div className="mt-4 rounded-lg border p-4">
                      <p className="text-sm">{translation}</p>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
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