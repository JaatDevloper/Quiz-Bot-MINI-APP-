import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Dashboard from "@/pages/Dashboard";
import CreateQuiz from "@/pages/CreateQuiz";
import MyQuizzes from "@/pages/MyQuizzes";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/create" component={CreateQuiz} />
      <Route path="/my-quizzes" component={MyQuizzes} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="min-h-[calc(100vh-3.5rem)]">
              <Router />
            </main>
            <BottomNav />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
