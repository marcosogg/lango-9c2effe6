import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth"

interface ChatThread {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export function useChatThreads() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user } = useAuth()

  const { data: threads, isLoading } = useQuery({
    queryKey: ["chat-threads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_threads")
        .select("*")
        .order("updated_at", { ascending: false })

      if (error) throw error
      return data as ChatThread[]
    },
  })

  const createThread = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated")
      
      const { data, error } = await supabase
        .from("chat_threads")
        .insert([{ user_id: user.id }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-threads"] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create new chat thread",
        variant: "destructive",
      })
    },
  })

  const updateThread = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase
        .from("chat_threads")
        .update({ name, updated_at: new Date().toISOString() })
        .eq("id", id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-threads"] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update chat thread",
        variant: "destructive",
      })
    },
  })

  const deleteThread = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("chat_threads")
        .delete()
        .eq("id", id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-threads"] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete chat thread",
        variant: "destructive",
      })
    },
  })

  return {
    threads,
    isLoading,
    createThread,
    updateThread,
    deleteThread,
  }
}