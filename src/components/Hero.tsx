import { Book, Image, Brain, BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

const Hero = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="animate-fade-in">
        <div className="mb-12 text-center">
          <Badge variant="destructive" className="mb-4">Coming Soon</Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Master English Expressions
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              The Smart Way
            </span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground">
            Learn phrasal verbs and idioms through AI-powered visual explanations, real-world examples, and interactive practice.
          </p>

          <div className="grid gap-8 mb-12 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Image className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Visual Learning</h3>
              <p className="text-sm text-muted-foreground">
                Understand expressions through AI-generated images and visual explanations
              </p>
            </Card>

            <Card className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Smart Practice</h3>
              <p className="text-sm text-muted-foreground">
                Interactive exercises adapted to your learning progress
              </p>
            </Card>

            <Card className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Real-World Context</h3>
              <p className="text-sm text-muted-foreground">
                Learn how natives actually use these expressions
              </p>
            </Card>
          </div>

          <Button size="lg" disabled className="opacity-70">
            <Book className="mr-2 h-5 w-5" />
            Coming Soon
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;