import { PlusCircle, Upload, BarChart3, Share2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { hapticFeedback } from '@/lib/telegram';

interface QuickAction {
  icon: typeof PlusCircle;
  label: string;
  onClick: () => void;
}

export default function QuickActions() {
  const handleAction = (label: string) => {
    hapticFeedback('light');
    console.log(`${label} triggered`);
  };

  const actions: QuickAction[] = [
    { icon: PlusCircle, label: 'Create Quiz', onClick: () => handleAction('Create Quiz') },
    { icon: Upload, label: 'Import Questions', onClick: () => handleAction('Import Questions') },
    { icon: BarChart3, label: 'View Analytics', onClick: () => handleAction('View Analytics') },
    { icon: Share2, label: 'Share Bot', onClick: () => handleAction('Share Bot') },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full" />
        <h3 className="text-xl font-semibold">Quick Actions</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Card
              key={action.label}
              className="p-4 cursor-pointer hover-elevate active-elevate-2 transition-all"
              onClick={action.onClick}
              data-testid={`button-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex flex-col items-center justify-center gap-2 text-center">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
