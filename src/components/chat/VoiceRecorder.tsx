import { useState, useRef } from "react"
import { Mic, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { supabase } from "@/integrations/supabase/client"

interface VoiceRecorderProps {
  onTranscription: (text: string) => void
  disabled?: boolean
  isProcessing: boolean
}

export function VoiceRecorder({ onTranscription, disabled, isProcessing }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)
      chunks.current = []

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data)
        }
      }

      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' })
        const reader = new FileReader()
        
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1]
          
          try {
            const { data, error } = await supabase.functions.invoke('voice-to-text', {
              body: { audio: base64Audio }
            })

            if (error) throw error
            if (data.text) {
              onTranscription(data.text)
            }
          } catch (error) {
            console.error('Error transcribing audio:', error)
          }
        }

        reader.readAsDataURL(blob)
      }

      mediaRecorder.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop()
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "relative",
        isRecording && "text-destructive hover:text-destructive",
        isProcessing && "opacity-50 cursor-not-allowed"
      )}
      onClick={isRecording ? stopRecording : startRecording}
      disabled={disabled || isProcessing}
    >
      {isRecording ? (
        <Square className="h-5 w-5" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
      {isRecording && (
        <span className="absolute -top-1 -right-1 h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
        </span>
      )}
    </Button>
  )
}