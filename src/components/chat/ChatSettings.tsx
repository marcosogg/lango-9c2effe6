import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Settings2, Plus, Trash2, Pencil } from "lucide-react"
import { useChatThreads } from "@/hooks/use-chat-threads"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"

interface ChatSettingsProps {
  currentThreadId: string
  onThreadSelect: (threadId: string) => void
}

export function ChatSettings({ currentThreadId, onThreadSelect }: ChatSettingsProps) {
  const { threads, isLoading, createThread, updateThread, deleteThread } = useChatThreads()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

  const handleCreateThread = () => {
    createThread.mutate()
  }

  const handleUpdateThread = (id: string) => {
    if (editingName.trim()) {
      updateThread.mutate({ id, name: editingName })
      setEditingId(null)
      setEditingName("")
    }
  }

  const startEditing = (id: string, name: string) => {
    setEditingId(id)
    setEditingName(name)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
        >
          <Settings2 className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Chat Threads</SheetTitle>
          <SheetDescription>
            Manage your conversation threads
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4">
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
                <div
                  key={thread.id}
                  className={`p-3 rounded-lg border ${
                    currentThreadId === thread.id ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {editingId === thread.id ? (
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUpdateThread(thread.id)
                          }
                        }}
                        onBlur={() => handleUpdateThread(thread.id)}
                        autoFocus
                      />
                    ) : (
                      <Button
                        variant="ghost"
                        className="w-full justify-start p-2 h-auto"
                        onClick={() => onThreadSelect(thread.id)}
                      >
                        <div>
                          <div className="font-medium text-left">{thread.name}</div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(thread.created_at), "PPp")}
                          </div>
                        </div>
                      </Button>
                    )}
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditing(thread.id, thread.name)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteThread.mutate(thread.id)}
                        disabled={deleteThread.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}