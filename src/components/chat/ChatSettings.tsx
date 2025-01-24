import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Settings2 } from "lucide-react"

export function ChatSettings() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
        >
          <Settings2 className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Chat Settings</SheetTitle>
          <SheetDescription>
            Configure your chat experience here.
          </SheetDescription>
        </SheetHeader>
        {/* Add settings options here */}
      </SheetContent>
    </Sheet>
  )
}