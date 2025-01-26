import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, Mic, GraduationCap, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

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
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}