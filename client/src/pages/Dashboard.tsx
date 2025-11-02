import { useQuery } from '@tanstack/react-query';
import { Layers, Unlock, Lock, Users } from 'lucide-react';
import WelcomeCard from '@/components/WelcomeCard';
import StatCard from '@/components/StatCard';
import QuickActions from '@/components/QuickActions';
import { getTelegramUser } from '@/lib/telegram';
import type { QuizStats } from '@shared/schema';

export default function Dashboard() {
  const telegramUser = getTelegramUser();

  const { data: stats } = useQuery<QuizStats>({
    queryKey: ['/api/stats', telegramUser?.id || 'guest'],
    enabled: !!telegramUser?.id,
  });

  const defaultStats = {
    totalQuizzes: 0,
    freeQuizzes: 0,
    paidQuizzes: 0,
    engagement: 0,
  };

  return (
    <div className="pb-20 px-4 pt-6 space-y-6">
      <WelcomeCard />

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Total Quizzes"
          value={(stats || defaultStats).totalQuizzes}
          icon={Layers}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Free Quizzes"
          value={(stats || defaultStats).freeQuizzes}
          icon={Unlock}
          iconColor="text-green-600"
        />
        <StatCard
          title="Paid Quizzes"
          value={(stats || defaultStats).paidQuizzes}
          icon={Lock}
          iconColor="text-orange-600"
        />
        <StatCard
          title="Engagement"
          value={(stats || defaultStats).engagement}
          icon={Users}
          iconColor="text-purple-600"
        />
      </div>

      <QuickActions />
    </div>
  );
}
