import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChatThreads } from "@/hooks/use-chat-threads";
import { ChatThreadItem } from "./ChatThreadItem";
import { Separator } from "@/components/ui/separator";

interface ChatThreadListProps {
  currentThreadId: string;
}

export function ChatThreadList({ currentThreadId }: ChatThreadListProps) {
  const navigate = useNavigate();
  const { threads, createThread, updateThread, deleteThread } = useChatThreads();

  const handleCreateThread = async () => {
    const newThread = await createThread.mutateAsync();
    navigate(`/chat?thread=${newThread.id}`);
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleCreateThread}
        disabled={createThread.isPending}
        className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
      >
        <Plus className="mr-2 h-4 w-4" />
        New Chat
      </Button>
      <div className="space-y-4">
        <div className="px-2">
          <h2 className="text-sm font-semibold text-sidebar-foreground/70">Chat History</h2>
        </div>
        <Separator className="bg-sidebar-border" />
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-1">
            {threads?.map((thread) => (
              <ChatThreadItem
                key={thread.id}
                id={thread.id}
                name={thread.name}
                createdAt={thread.created_at}
                isActive={currentThreadId === thread.id}
                onRename={(id, name) => updateThread.mutate({ id, name })}
                onDelete={(id) => deleteThread.mutate(id)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}