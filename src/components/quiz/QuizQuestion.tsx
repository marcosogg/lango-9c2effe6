import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuizQuestionProps {
  currentQuestion: {
    question: string;
    correct_answer: string;
  };
  currentQuestionIndex: number;
  totalQuestions: number;
  answers: string[];
  selectedAnswer: string | null;
  isAnswered: boolean;
  onAnswerSelect: (answer: string) => void;
  onNextQuestion: () => void;
}

export const QuizQuestion = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  answers,
  selectedAnswer,
  isAnswered,
  onAnswerSelect,
  onNextQuestion,
}: QuizQuestionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Question {currentQuestionIndex + 1} of {totalQuestions}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{currentQuestion.question}</p>
        <div className="grid grid-cols-1 gap-4">
          {answers.map((answer, index) => (
            <Button
              key={index}
              variant={
                isAnswered
                  ? answer === currentQuestion.correct_answer
                    ? "default"
                    : answer === selectedAnswer
                    ? "destructive"
                    : "outline"
                  : selectedAnswer === answer
                  ? "default"
                  : "outline"
              }
              className="w-full justify-start px-4 py-6 text-left"
              onClick={() => onAnswerSelect(answer)}
              disabled={isAnswered}
            >
              {answer}
            </Button>
          ))}
        </div>
        {isAnswered && (
          <Button
            className="w-full mt-4"
            onClick={onNextQuestion}
            disabled={currentQuestionIndex === totalQuestions - 1}
          >
            {currentQuestionIndex === totalQuestions - 1
              ? "Quiz Complete!"
              : "Next Question"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};