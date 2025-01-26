import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { QuizBanner } from "@/components/quiz/QuizBanner";
import { QuizStartScreen } from "@/components/quiz/QuizStartScreen";
import { QuizQuestion } from "@/components/quiz/QuizQuestion";
import { DeleteQuizDialog } from "@/components/quiz/DeleteQuizDialog";

const Course = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const deleteCourse = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Quiz deleted",
        description: "The quiz has been successfully deleted.",
      });
      navigate("/courses");
    },
    onError: (error) => {
      toast({
        title: "Error deleting quiz",
        description: "Failed to delete the quiz. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting quiz:", error);
    },
  });

  const generateBannerMutation = useMutation({
    mutationFn: async () => {
      if (!course) return;
      
      const { data, error } = await supabase.functions.invoke("generate-banner", {
        body: { topic: course.topic, title: course.title },
      });
      
      if (error) throw error;
      
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
    return <div className="p-6">Quiz or questions not found.</div>;
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
      <QuizHeader 
        title={course.title}
        onDeleteClick={() => setShowDeleteDialog(true)}
      />

      <DeleteQuizDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirmDelete={() => deleteCourse.mutate()}
      />

      <QuizBanner bannerUrl={course.banner_url} />

      {!isStarted ? (
        <QuizStartScreen
          questionCount={questions.length}
          onStart={() => setIsStarted(true)}
        />
      ) : (
        <QuizQuestion
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          answers={answers}
          selectedAnswer={selectedAnswer}
          isAnswered={isAnswered}
          onAnswerSelect={handleAnswerSelect}
          onNextQuestion={handleNextQuestion}
        />
      )}
    </div>
  );
};

export default Course;