import { Rocket } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getTelegramUser } from '@/lib/telegram';

export default function WelcomeCard() {
  const telegramUser = getTelegramUser();
  const userName = telegramUser?.first_name || 'User';

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-600 to-indigo-600 border-0 text-white" data-testid="card-welcome">
      <div className="flex items-start gap-3">
        <Rocket className="w-8 h-8 flex-shrink-0 mt-1" />
        <div>
          <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-purple-100 text-base">
            Create, manage, and track your quizzes all in one place
          </p>
        </div>
      </div>
    </Card>
  );
}
