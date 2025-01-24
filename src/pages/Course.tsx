import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Award, ArrowLeft, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import confetti from "canvas-confetti";

const Course = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const { data: course } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: questions } = useQuery({
    queryKey: ["questions", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("course_id", id);
      
      if (error) throw error;
      return data;
    },
  });

  const currentQuestion = questions?.[currentQuestionIndex];

  const shuffleAnswers = (question: any) => {
    if (!question) return [];
    const answers = [
      { text: question.correct_answer, isCorrect: true },
      { text: question.wrong_answer_1, isCorrect: false },
      { text: question.wrong_answer_2, isCorrect: false },
      { text: question.wrong_answer_3, isCorrect: false },
    ];
    return answers.sort(() => Math.random() - 0.5);
  };

  const [shuffledAnswers, setShuffledAnswers] = useState<any[]>([]);

  useEffect(() => {
    if (currentQuestion) {
      setShuffledAnswers(shuffleAnswers(currentQuestion));
    }
  }, [currentQuestion]);

  const handleAnswerSelect = (answer: string, isCorrect: boolean) => {
    setSelectedAnswer(answer);
    
    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "Correct! 🎉",
        description: "Great job! Keep going!",
      });
    } else {
      toast({
        title: "Not quite right",
        description: `The correct answer was: ${currentQuestion.correct_answer}`,
        variant: "destructive",
      });
    }

    setTimeout(() => {
      if (currentQuestionIndex < (questions?.length || 0) - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
        if (score >= 7) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
    }, 1500);
  };

  if (!course || !questions) {
    return <div>Loading...</div>;
  }

  if (showResult) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6" />
              Course Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xl">
              You scored {score} out of {questions.length}!
            </p>
            <p className="text-muted-foreground">
              {score >= 7
                ? "Excellent work! You've mastered this topic! 🎉"
                : "Keep practicing to improve your score!"}
            </p>
            <Button onClick={() => navigate("/courses")} className="w-full">
              Back to Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Button
        variant="ghost"
        onClick={() => navigate("/courses")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Courses
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            {course.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg font-medium">{currentQuestion.question}</p>
          <div className="space-y-3">
            {shuffledAnswers.map((answer, index) => (
              <Button
                key={index}
                variant={
                  selectedAnswer === answer.text
                    ? answer.isCorrect
                      ? "default"
                      : "destructive"
                    : "outline"
                }
                className="w-full justify-start text-left"
                disabled={selectedAnswer !== null}
                onClick={() => handleAnswerSelect(answer.text, answer.isCorrect)}
              >
                {answer.text}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Course;