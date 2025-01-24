import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={handleSignOut}
        className="absolute top-4 right-4"
        variant="outline"
      >
        Sign Out
      </Button>
      <Hero />
    </div>
  );
};

export default Index;