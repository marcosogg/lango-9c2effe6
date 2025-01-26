import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, Mic, GraduationCap } from "lucide-react";
import { SignOut } from "./sidebar/SignOut";
import { ChatThreadList } from "./sidebar/ChatThreadList";
import { useSearchParams } from "react-router-dom";

export function AppSidebar() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const threadId = searchParams.get("thread") || "";

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-screen w-[250px] border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-1 p-2">
          <Link to="/">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                isActive("/") && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link to="/chat">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                isActive("/chat") && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat
            </Button>
          </Link>
          {isActive("/chat") && <ChatThreadList currentThreadId={threadId} />}
          <Link to="/voice-chat">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                isActive("/voice-chat") && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <Mic className="mr-2 h-4 w-4" />
              Voice Chat
            </Button>
          </Link>
          <Link to="/quizzes">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                isActive("/quizzes") && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              Quizzes
            </Button>
          </Link>
        </div>
        <div className="p-2">
          <SignOut />
        </div>
      </div>
    </div>
  );
}