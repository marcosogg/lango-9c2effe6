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
import { useSearchParams } from "react-router-dom"

const Chat = () => {
  const [searchParams] = useSearchParams();
  const threadId = searchParams.get("thread");
  const [currentThreadId, setCurrentThreadId] = useState<string>(threadId || "");
  const { threads, isLoading: isLoadingThreads, createThread } = useChatThreads();
  const { messages, isLoading: isLoadingMessages, addMessage } = useChatMessages(currentThreadId);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (threadId) {
      setCurrentThreadId(threadId);
    } else if (threads && threads.length > 0 && !currentThreadId) {
      setCurrentThreadId(threads[0].id);
    }
  }, [threads, currentThreadId, threadId]);

  const handleSendMessage = async (content: string) => {
    try {
      if (!currentThreadId) {
        const newThread = await createThread.mutateAsync();
        setCurrentThreadId(newThread.id);
      }

      await addMessage.mutateAsync({ content, isUser: true });

      const { data, error } = await supabase.functions.invoke("chat-completion", {
        body: { message: content },
      });

      if (error) throw error;

      await addMessage.mutateAsync({
        content: data.response,
        isUser: false,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
      console.error("Chat error:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-2rem)] bg-background">
      <header className="border-b p-4 bg-card">
        <div className="flex items-center justify-between max-w-3xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              AI
            </div>
            <div>
              <h2 className="font-semibold">AI Assistant</h2>
              <p className="text-sm text-muted-foreground">Online</p>
            </div>
          </div>
          <ChatSettings
            currentThreadId={currentThreadId}
            onThreadSelect={setCurrentThreadId}
          />
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {isLoadingMessages || isLoadingThreads ? (
            <div className="p-4 space-y-4">
              <Skeleton className="h-[60px] w-[80%] rounded-lg" />
              <Skeleton className="h-[40px] w-[60%] rounded-lg ml-auto" />
            </div>
          ) : messages?.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Start a conversation by sending a message
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
      <div className="border-t bg-card p-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            onSend={handleSendMessage}
            disabled={addMessage.isPending}
            messages={messages}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;