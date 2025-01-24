import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { ChatInput } from "@/components/chat/ChatInput"
import { ChatMessage } from "@/components/chat/ChatMessage"
import { ChatSettings } from "@/components/chat/ChatSettings"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useEffect } from "react"
import { useChatThreads } from "@/hooks/use-chat-threads"
import { useChatMessages } from "@/hooks/use-chat-messages"
import { useAuth } from "@/lib/auth"

const Chat = () => {
  const [currentThreadId, setCurrentThreadId] = useState<string>("")
  const { threads, isLoading: isLoadingThreads, createThread } = useChatThreads()
  const { messages, isLoading: isLoadingMessages, addMessage } = useChatMessages(currentThreadId)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (threads && threads.length > 0 && !currentThreadId) {
      setCurrentThreadId(threads[0].id)
    }
  }, [threads, currentThreadId])

  const handleSendMessage = async (content: string) => {
    try {
      if (!currentThreadId) {
        const newThread = await createThread.mutateAsync()
        setCurrentThreadId(newThread.id)
      }

      await addMessage.mutateAsync({ content, isUser: true })

      const { data, error } = await supabase.functions.invoke("chat-completion", {
        body: { message: content },
      })

      if (error) throw error

      await addMessage.mutateAsync({
        content: data.response,
        isUser: false,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      })
      console.error("Chat error:", error)
    }
  }

  if (!user) return null

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
          <ChatSettings
            currentThreadId={currentThreadId}
            onThreadSelect={setCurrentThreadId}
          />
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {isLoadingMessages || isLoadingThreads ? (
            <div className="p-4">
              <Skeleton className="h-[60px] w-[80%] rounded-lg" />
            </div>
          ) : (
            messages?.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.content}
                isUser={message.is_user}
              />
            ))
          )}
        </div>
      </div>
      <div className="border-t bg-white p-4">
        <div className="max-w-5xl mx-auto">
          <ChatInput
            onSend={handleSendMessage}
            disabled={addMessage.isPending}
          />
        </div>
      </div>
    </div>
  )
}

export default Chat