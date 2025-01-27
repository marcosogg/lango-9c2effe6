import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, Mic, GraduationCap, ChevronDown } from "lucide-react";
import { SignOut } from "./sidebar/SignOut";
import { ChatThreadList } from "./sidebar/ChatThreadList";
import { useSearchParams, useNavigation } from "react-router-dom";
import React, { useState } from "react";



export function AppSidebar() {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const threadId = searchParams.get("thread") || "";
    const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);

    const isActive = (path: string) => location.pathname === path;
    const navigation = useNavigation();

    // Function to prevent navigation when clicking on "Chat History" button
    const handleHistoryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsHistoryExpanded(!isHistoryExpanded);
    };


    return (
        <div className="flex h-screen w-[280px] flex-col border-r bg-sidebar text-sidebar-foreground">
            <div className="flex-1 space-y-2 p-4">
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
                    <div className="mt-4 border-t border-gray-200 pt-2">
                         <button
                            onClick={handleHistoryClick}
                            className="w-full flex items-center justify-between px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                        >
                            <span>Chat History</span>
                            <ChevronDown
                                size={16}
                                className={`transform transition-transform ${isHistoryExpanded ? "rotate-180" : ""}`}
                            />
                        </button>
                         {isHistoryExpanded && isActive("/chat") && (
                                <ChatThreadList currentThreadId={threadId} />
                            )}
                    </div>
                </nav>
            </div>
            <div className="p-4 border-t border-gray-200">
                <SignOut />
            </div>
        </div>
    );
}
