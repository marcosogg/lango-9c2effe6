import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface QuizStartScreenProps {
  questionCount: number;
  onStart: () => void;
}

export const QuizStartScreen = ({ questionCount, onStart }: QuizStartScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
      <h2 className="text-2xl font-semibold">Ready to start the quiz?</h2>
      <p className="text-muted-foreground">
        There are {questionCount} questions to answer.
      </p>
      <Button
        size="lg"
        className="bg-purple-600 hover:bg-purple-700"
        onClick={onStart}
      >
        <Play className="mr-2 h-4 w-4" />
        Start Quiz
      </Button>
    </div>
  );
};