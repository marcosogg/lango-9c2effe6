import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { ChatInput } from "@/components/chat/ChatInput"
import { ChatMessage } from "@/components/chat/ChatMessage"
import { ChatSettings } from "@/components/chat/ChatSettings"
import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"

interface Message {
  content: string
  isUser: boolean
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true)
      // Add user message
      setMessages((prev) => [...prev, { content, isUser: true }])

      // Get AI response
      const { data, error } = await supabase.functions.invoke("chat-completion", {
        body: { message: content },
      })

      if (error) throw error

      // Add AI response
      setMessages((prev) => [
        ...prev,
        { content: data.response, isUser: false },
      ])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      })
      console.error("Chat error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex h-screen flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.content}
            isUser={message.isUser}
          />
        ))}
        {isLoading && (
          <div className="flex w-full gap-2 p-4">
            <Skeleton className="h-[60px] w-[80%] rounded-lg" />
          </div>
        )}
      </div>
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      <ChatSettings />
    </div>
  )
}

export default Chat