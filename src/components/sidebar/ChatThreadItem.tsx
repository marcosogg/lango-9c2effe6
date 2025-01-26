import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Pencil, Trash2, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface ChatThreadItemProps {
  id: string;
  name: string;
  createdAt: string;
  isActive: boolean;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export function ChatThreadItem({
  id,
  name,
  createdAt,
  isActive,
  onRename,
  onDelete,
}: ChatThreadItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(name);

  const handleRename = () => {
    if (editingName.trim()) {
      onRename(id, editingName);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditingName(name);
    }
  };

  return (
    <div
      className={cn(
        "group relative rounded-lg transition-colors",
        isActive ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50"
      )}
    >
      <div className="flex items-center justify-between p-2">
        {isEditing ? (
          <Input
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleRename}
            autoFocus
            className="h-8"
          />
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start p-2 text-base font-normal"
            asChild
          >
            <Link to={`/chat?thread=${id}`}>
              <MessageSquare className="mr-3 h-4 w-4 shrink-0" />
              <div className="flex flex-col items-start">
                <span className="line-clamp-1 text-sm">{name}</span>
                <span className="text-xs text-sidebar-foreground/60">
                  {format(new Date(createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </Link>
          </Button>
        )}
        <div className="absolute right-2 hidden space-x-1 group-hover:flex">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setIsEditing(true);
              setEditingName(name);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onDelete(id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}