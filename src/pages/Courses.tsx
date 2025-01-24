import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, Book, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Courses = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: async () => {
      const { data: course, error: courseError } = await supabase
        .from("courses")
        .insert([{ title, topic }])
        .select()
        .single();

      if (courseError) throw courseError;

      // Generate questions using the edge function
      const { data: questions, error: questionsError } = await supabase.functions.invoke(
        "generate-suggestion",
        {
          body: { topic, count: 10 },
        }
      );

      if (questionsError) throw questionsError;

      // Insert the generated questions
      const { error: insertError } = await supabase
        .from("questions")
        .insert(
          questions.map((q: any) => ({
            course_id: course.id,
            question: q.question,
            correct_answer: q.correct_answer,
            wrong_answer_1: q.wrong_answers[0],
            wrong_answer_2: q.wrong_answers[1],
            wrong_answer_3: q.wrong_answers[2],
          }))
        );

      if (insertError) throw insertError;

      return course;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setShowCreateForm(false);
      setTitle("");
      setTopic("");
      toast({
        title: "Course created!",
        description: "Your course has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating course:", error);
    },
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Course
        </Button>
      </div>

      {showCreateForm && (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Create New Course
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter course title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter the topic for questions"
              />
            </div>
            <Button
              onClick={() => createCourseMutation.mutate()}
              disabled={!title || !topic || createCourseMutation.isPending}
              className="w-full"
            >
              {createCourseMutation.isPending ? (
                "Creating Course..."
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Course
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p>Loading courses...</p>
        ) : courses?.length === 0 ? (
          <p>No courses yet. Create your first course!</p>
        ) : (
          courses?.map((course) => (
            <Card
              key={course.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  {course.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{course.topic}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Courses;