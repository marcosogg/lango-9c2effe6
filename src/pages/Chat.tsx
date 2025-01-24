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
      setMessages((prev) => [...prev, { content, isUser: true }])

      const { data, error } = await supabase.functions.invoke("chat-completion", {
        body: { message: content },
      })

      if (error) throw error

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
    <div className="flex-1 flex flex-col h-screen bg-gray-50">
      <header className="border-b p-4 bg-white">
        <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              AI
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">AI Assistant</h2>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
          <ChatSettings />
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.content}
              isUser={message.isUser}
            />
          ))}
          {isLoading && (
            <div className="p-4">
              <Skeleton className="h-[60px] w-[80%] rounded-lg" />
            </div>
          )}
        </div>
      </div>
      <div className="border-t bg-white p-4">
        <div className="max-w-5xl mx-auto">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  )
}

export default Chat