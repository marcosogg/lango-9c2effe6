import { LogOut, LayoutDashboard, MessageSquare, BookOpen, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useChatThreads } from "@/hooks/use-chat-threads";
import { format } from "date-fns";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Chat",
    url: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Courses",
    url: "/courses",
    icon: BookOpen,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const { threads, isLoading, createThread } = useChatThreads();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleNewChat = () => {
    createThread.mutate();
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <SidebarGroupLabel>Chat History</SidebarGroupLabel>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleNewChat}
              disabled={createThread.isPending}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="h-[300px]">
            <SidebarGroupContent>
              <SidebarMenu>
                {threads?.map((thread) => (
                  <SidebarMenuItem key={thread.id}>
                    <SidebarMenuButton
                      asChild
                      tooltip={format(new Date(thread.created_at), "PPp")}
                    >
                      <a href={`/chat?thread=${thread.id}`}>
                        <MessageSquare className="h-4 w-4" />
                        <span className="truncate">{thread.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </ScrollArea>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleSignOut}
                  tooltip="Sign Out"
                >
                  <LogOut />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}