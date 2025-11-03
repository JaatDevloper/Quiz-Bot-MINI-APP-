import { Moon, Sun, Rocket } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-primary via-purple-600 to-violet-600">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-white">Premium Quiz Bot</h1>
        </div>
        
        <Button
          data-testid="button-theme-toggle"
          size="icon"
          variant="ghost"
          onClick={toggleTheme}
          className="h-9 w-9 text-white hover:bg-white/20"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}
