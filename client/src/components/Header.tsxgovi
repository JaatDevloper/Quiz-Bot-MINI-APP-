import { Moon, Sun, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from '@/contexts/ThemeContext';
import { getTelegramUser } from '@/lib/telegram';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const telegramUser = getTelegramUser();

  const getUserInitials = () => {
    if (!telegramUser) return 'U';
    const first = telegramUser.first_name?.[0] || '';
    const last = telegramUser.last_name?.[0] || '';
    return (first + last).toUpperCase() || 'U';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Premium Quiz Bot
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
            className="w-9 h-9"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          <Avatar className="w-9 h-9" data-testid="img-avatar">
            <AvatarImage src={telegramUser?.photo_url} />
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-sm font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
