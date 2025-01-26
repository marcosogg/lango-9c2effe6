import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { RequireAuth } from "@/components/RequireAuth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";
import VoiceChat from "./pages/VoiceChat";
import Quizzes from "./pages/Quizzes";
import Quiz from "./pages/Quiz";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/*"
              element={
                <RequireAuth>
                  <SidebarProvider>
                    <div className="flex min-h-screen w-full">
                      <AppSidebar />
                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/chat" element={<Chat />} />
                          <Route path="/voice-chat" element={<VoiceChat />} />
                          <Route path="/quizzes" element={<Quizzes />} />
                          <Route path="/quizzes/:id" element={<Quiz />} />
                        </Routes>
                      </main>
                    </div>
                  </SidebarProvider>
                </RequireAuth>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;