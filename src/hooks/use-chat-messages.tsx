import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface ChatMessage {
  id: string
  content: string
  is_user: boolean
  audio_url?: string
  created_at: string
}

export function useChatMessages(threadId: string | undefined) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: messages, isLoading } = useQuery({
    queryKey: ["chat-messages", threadId],
    queryFn: async () => {
      if (!threadId) return []
      
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true })

      if (error) throw error
      return data as ChatMessage[]
    },
    enabled: !!threadId,
  })

  const addMessage = useMutation({
    mutationFn: async ({
      content,
      isUser,
      audioUrl,
    }: {
      content: string
      isUser: boolean
      audioUrl?: string
    }) => {
      if (!threadId) throw new Error("No thread selected")

      const { data, error } = await supabase
        .from("chat_messages")
        .insert([
          {
            thread_id: threadId,
            content,
            is_user: isUser,
            audio_url: audioUrl,
          },
        ])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages", threadId] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
    },
  })

  return {
    messages,
    isLoading,
    addMessage,
  }
}