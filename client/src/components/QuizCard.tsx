import { MoreVertical, Users, Calendar, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { hapticFeedback } from '@/lib/telegram';
import type { Quiz } from '@shared/schema';

interface QuizCardProps {
  quiz: Quiz;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function QuizCard({ quiz, onEdit, onDelete }: QuizCardProps) {
  const handleEdit = () => {
    hapticFeedback('light');
    onEdit?.(quiz.id);
    console.log('Edit quiz:', quiz.id);
  };

  const handleDelete = () => {
    hapticFeedback('warning');
    onDelete?.(quiz.id);
    console.log('Delete quiz:', quiz.id);
  };

  const questionCount = Array.isArray(quiz.questions) ? quiz.questions.length : 0;

  return (
    <Card className="p-4 hover-elevate" data-testid={`card-quiz-${quiz.id}`}>
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate" data-testid="text-quiz-title">
              {quiz.title}
            </h3>
            {quiz.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {quiz.description}
              </p>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex-shrink-0 w-8 h-8" data-testid="button-quiz-menu">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit} data-testid="button-edit-quiz">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive" data-testid="button-delete-quiz">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {quiz.category}
          </Badge>
          <Badge
            variant={quiz.isPaid ? 'default' : 'outline'}
            className={quiz.isPaid ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : ''}
          >
            {quiz.isPaid ? 'Paid' : 'Free'}
          </Badge>
          {quiz.published && (
            <Badge variant="outline" className="text-xs border-green-600 text-green-600">
              Published
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{questionCount} questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
