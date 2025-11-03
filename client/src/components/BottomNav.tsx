import { Home, PlusCircle, BookOpen } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { hapticFeedback } from '@/lib/telegram';

interface NavItem {
  path: string;
  label: string;
  icon: typeof Home;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/create', label: 'Create', icon: PlusCircle },
  { path: '/my-quizzes', label: 'My Quizzes', icon: BookOpen },
];

export default function BottomNav() {
  const [location] = useLocation();

  const handleNavClick = () => {
    hapticFeedback('light');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-inset-bottom">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={handleNavClick}
              data-testid={`link-nav-${item.label.toLowerCase().replace(' ', '-')}`}
            >
              <div
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
