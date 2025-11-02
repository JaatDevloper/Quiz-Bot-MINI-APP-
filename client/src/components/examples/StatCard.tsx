import StatCard from '../StatCard';
import { Layers, Unlock, Lock, Users } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <StatCard title="Total Quizzes" value={24} icon={Layers} iconColor="text-blue-600" />
      <StatCard title="Free Quizzes" value={23} icon={Unlock} iconColor="text-green-600" />
      <StatCard title="Paid Quizzes" value={1} icon={Lock} iconColor="text-orange-600" />
      <StatCard title="Engagement" value={2} icon={Users} iconColor="text-purple-600" />
    </div>
  );
}
