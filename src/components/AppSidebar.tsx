import { Link, useLocation, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, Mic, GraduationCap } from "lucide-react";
import { SignOut } from "./sidebar/SignOut";
import { ChatThreadList } from "./sidebar/ChatThreadList";

export function AppSidebar() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const threadId = searchParams.get("thread") || "";

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen w-[280px] flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex-1 space-y-4 p-4">
        <nav className="space-y-1">
          <Link to="/">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-base font-normal",
                isActive("/") && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <Home className="mr-3 h-5 w-5" />
              Home
            </Button>
          </Link>
          <Link to="/chat">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-base font-normal",
                isActive("/chat") && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <MessageSquare className="mr-3 h-5 w-5" />
              Chat
            </Button>
          </Link>
          <Link to="/voice-chat">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-base font-normal",
                isActive("/voice-chat") && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <Mic className="mr-3 h-5 w-5" />
              Voice Chat
            </Button>
          </Link>
          <Link to="/quizzes">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-base font-normal",
                isActive("/quizzes") && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <GraduationCap className="mr-3 h-5 w-5" />
              Quizzes
            </Button>
          </Link>
        </nav>
        <ChatThreadList currentThreadId={threadId} />
      </div>
      <div className="p-4">
        <SignOut />
      </div>
    </div>
  );
}