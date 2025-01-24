import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="animate-fade-in text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
          Welcome to Your{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            New App
          </span>
        </h1>
        <p className="mx-auto mb-8 max-w-lg text-lg text-muted-foreground">
          Start building something amazing with React, Tailwind CSS, and modern web technologies.
        </p>
        <Button className="group">
          Get Started
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
};

export default Hero;