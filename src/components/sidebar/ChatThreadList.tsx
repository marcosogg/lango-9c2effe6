import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChatThreads } from "@/hooks/use-chat-threads";
import { ChatThreadItem } from "./ChatThreadItem";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ChatThreadListProps {
  currentThreadId: string;
  className?: string;
}

export function ChatThreadList({ currentThreadId, className }: ChatThreadListProps) {
  const navigate = useNavigate();
  const { threads, createThread, updateThread, deleteThread } = useChatThreads();

  const handleCreateThread = async () => {
    const newThread = await createThread.mutateAsync();
    navigate(`/chat?thread=${newThread.id}`);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-semibold text-sidebar-foreground/70">Chat History</h2>
          <Button
            onClick={handleCreateThread}
            disabled={createThread.isPending}
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-sidebar-foreground/70 hover:text-sidebar-foreground"
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">New Chat</span>
          </Button>
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