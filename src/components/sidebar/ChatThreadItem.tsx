import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
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
        "group p-3 rounded-lg border",
        isActive && "bg-gray-50"
      )}
    >
      <div className="flex items-center justify-between">
        {isEditing ? (
          <Input
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleRename}
            autoFocus
          />
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start p-2 h-auto"
            asChild
          >
            <Link to={`/chat?thread=${id}`}>
              <div>
                <div className="font-medium text-left">{name}</div>
                <div className="text-xs text-gray-500">
                  {format(new Date(createdAt), "PPp")}
                </div>
              </div>
            </Link>
          </Button>
        )}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
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
            onClick={() => onDelete(id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}