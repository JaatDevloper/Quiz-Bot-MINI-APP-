import EmptyState from '../EmptyState';
import { BookOpen } from 'lucide-react';

export default function EmptyStateExample() {
  return (
    <div className="p-4">
      <EmptyState
        icon={BookOpen}
        title="No quizzes yet"
        description="Create your first quiz to get started with engaging your audience"
        actionLabel="Create Quiz"
        onAction={() => console.log('Create quiz clicked')}
      />
    </div>
  );
}
