import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChatThreads } from "@/hooks/use-chat-threads";
import { ChatThreadItem } from "./ChatThreadItem";

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
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Thread
      </Button>
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-2">
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
  );
}