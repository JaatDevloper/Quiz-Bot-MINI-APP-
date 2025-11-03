import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import CreateQuiz from "../../pages/CreateQuiz";

export default function CreateQuizExample() {
  return (
    <TooltipProvider>
      <div className="bg-background">
        <CreateQuiz />
      </div>
      <Toaster />
    </TooltipProvider>
  );
}
