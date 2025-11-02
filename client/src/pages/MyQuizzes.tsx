import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuizCard from '@/components/QuizCard';
import EmptyState from '@/components/EmptyState';
import { getTelegramUser } from '@/lib/telegram';
import { showConfirm, hapticFeedback } from '@/lib/telegram';
import type { Quiz } from '@shared/schema';

export default function MyQuizzes() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const telegramUser = getTelegramUser();

  const { data: quizzes = [] } = useQuery<Quiz[]>({
    queryKey: ['/api/quizzes', telegramUser?.id || 'guest'],
    enabled: !!telegramUser?.id,
  });

  const handleEdit = (id: string) => {
    hapticFeedback('light');
    console.log('Edit quiz:', id);
    // TODO: Navigate to edit page
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm('Are you sure you want to delete this quiz?');
    if (confirmed) {
      hapticFeedback('success');
      try {
        const response = await fetch(`/api/quiz/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          // Invalidate cache to refresh the list
          window.location.reload();
        }
      } catch (error) {
        console.error('Failed to delete quiz:', error);
      }
    }
  };

  const filteredQuizzes = quizzes
    .filter((quiz) => {
      if (tab === 'published') return quiz.published;
      if (tab === 'drafts') return !quiz.published;
      return true;
    })
    .filter((quiz) =>
      quiz.title.toLowerCase().includes(search.toLowerCase()) ||
      quiz.category.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="pb-20 px-4 pt-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">My Quizzes</h1>
        <p className="text-sm text-muted-foreground">
          Manage and organize your quiz collection
        </p>
      </div>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search quizzes..."
        className="w-full"
        data-testid="input-search-quizzes"
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" data-testid="tab-all">
            All
          </TabsTrigger>
          <TabsTrigger value="published" data-testid="tab-published">
            Published
          </TabsTrigger>
          <TabsTrigger value="drafts" data-testid="tab-drafts">
            Drafts
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-6">
          {filteredQuizzes.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title={search ? 'No quizzes found' : 'No quizzes yet'}
              description={
                search
                  ? 'Try adjusting your search terms'
                  : 'Create your first quiz to get started'
              }
              actionLabel={search ? undefined : 'Create Quiz'}
              onAction={search ? undefined : () => console.log('Create quiz')}
            />
          ) : (
            <div className="space-y-4">
              {filteredQuizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
