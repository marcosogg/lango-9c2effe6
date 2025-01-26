import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface QuizHeaderProps {
  title: string;
  onDeleteClick: () => void;
}

export const QuizHeader = ({ title, onDeleteClick }: QuizHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      <Button
        variant="destructive"
        size="icon"
        onClick={onDeleteClick}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};