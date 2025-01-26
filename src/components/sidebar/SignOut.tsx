import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function SignOut() {
  const { signOut } = useAuth();

  return (
    <Button
      variant="ghost"
      className="w-full justify-start text-base font-normal"
      onClick={() => signOut()}
    >
      <LogOut className="mr-3 h-5 w-5" />
      Sign Out
    </Button>
  );
}