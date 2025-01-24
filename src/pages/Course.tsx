import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const Course = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const { data: course, isLoading: courseLoading } = useQuery({
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

  const { data: questions, isLoading: questionsLoading } = useQuery({
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

  const generateBannerMutation = useMutation({
    mutationFn: async () => {
      if (!course) return;
      
      const { data, error } = await supabase.functions.invoke("generate-banner", {
        body: { topic: course.topic, title: course.title },
      });
      
      if (error) throw error;
      
      // Update the course with the new banner URL
      const { error: updateError } = await supabase
        .from("courses")
        .update({ banner_url: data.url })
        .eq("id", course.id);
      
      if (updateError) throw updateError;
      
      return data.url;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", id] });
    },
    onError: (error) => {
      toast({
        title: "Error generating banner",
        description: "Failed to generate course banner. Please try again.",
        variant: "destructive",
      });
      console.error("Error generating banner:", error);
    },
  });

  useEffect(() => {
    if (course && !course.banner_url && !generateBannerMutation.isPending) {
      generateBannerMutation.mutate();
    }
  }, [course]);

  if (courseLoading || questionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!course || !questions || questions.length === 0) {
    return <div className="p-6">Course or questions not found.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answers = [
    currentQuestion.correct_answer,
    currentQuestion.wrong_answer_1,
    currentQuestion.wrong_answer_2,
    currentQuestion.wrong_answer_3,
  ].sort(() => Math.random() - 0.5);

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    if (answer === currentQuestion.correct_answer) {
      toast({
        title: "Correct!",
        description: "Well done! Let's move on to the next question.",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was: ${currentQuestion.correct_answer}`,
        variant: "destructive",
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
        {course.banner_url ? (
          <img
            src={course.banner_url}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
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
                  onClick={() => handleAnswerSelect(answer)}
                  disabled={isAnswered}
                >
                  {answer}
                </Button>
              ))}
            </div>
            {isAnswered && (
              <Button
                className="w-full mt-4"
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                {currentQuestionIndex === questions.length - 1
                  ? "Course Complete!"
                  : "Next Question"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Course;