import { useState } from 'react';
import { Plus, Save } from 'lucide-react';
import { getTelegramUser } from '@/lib/telegram';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import QuestionForm from '@/components/QuestionForm';
import { hapticFeedback, showAlert } from '@/lib/telegram';
import type { Question } from '@shared/schema';

const CATEGORIES = [
  'General Knowledge',
  'Programming',
  'Science',
  'History',
  'Mathematics',
  'Geography',
  'Literature',
  'Sports',
  'Entertainment',
  'Other',
];

export default function CreateQuiz() {
  const telegramUser = getTelegramUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([
    { text: '', options: ['', '', '', ''], correctIndex: 0 },
  ]);

  const handleAddQuestion = () => {
    hapticFeedback('light');
    setQuestions([
      ...questions,
      { text: '', options: ['', '', '', ''], correctIndex: 0 },
    ]);
  };

  const handleUpdateQuestion = (index: number, question: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = question;
    setQuestions(newQuestions);
  };

  const handleDeleteQuestion = (index: number) => {
    if (questions.length === 1) {
      showAlert('You must have at least one question');
      return;
    }
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSave = async () => {
    if (!telegramUser?.id) {
      showAlert('Please open this app from Telegram');
      return;
    }

    hapticFeedback('light');
    
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: telegramUser.id.toString(),
          title,
          description,
          category,
          isPaid,
          questions,
          published: false,
        }),
      });

      if (response.ok) {
        hapticFeedback('success');
        showAlert('Quiz saved successfully!');
        // Reset form
        setTitle('');
        setDescription('');
        setCategory('');
        setIsPaid(false);
        setQuestions([{ text: '', options: ['', '', '', ''], correctIndex: 0 }]);
      } else {
        throw new Error('Failed to save quiz');
      }
    } catch (error) {
      hapticFeedback('error');
      showAlert('Failed to save quiz. Please try again.');
      console.error('Error saving quiz:', error);
    }
  };

  const isValid = title && category && questions.every(q => q.text && q.options.every(o => o));

  return (
    <div className="pb-20 px-4 pt-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Create Quiz</h1>
        <p className="text-sm text-muted-foreground">
          Build engaging quizzes for your audience
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Quiz Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter quiz title..."
            className="mt-1.5"
            data-testid="input-quiz-title"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this quiz about?"
            className="mt-1.5 min-h-20"
            data-testid="input-quiz-description"
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="mt-1.5" data-testid="select-category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <Label htmlFor="isPaid">Paid Quiz</Label>
            <p className="text-sm text-muted-foreground">
              Require payment to access this quiz
            </p>
          </div>
          <Switch
            id="isPaid"
            checked={isPaid}
            onCheckedChange={setIsPaid}
            data-testid="switch-paid"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full" />
          <h3 className="text-xl font-semibold">Questions</h3>
        </div>
        
        <div className="space-y-4">
          {questions.map((question, index) => (
            <QuestionForm
              key={index}
              question={question}
              index={index}
              onUpdate={(q) => handleUpdateQuestion(index, q)}
              onDelete={() => handleDeleteQuestion(index)}
            />
          ))}
        </div>

        <Button
          variant="outline"
          onClick={handleAddQuestion}
          className="w-full mt-4"
          data-testid="button-add-question"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </Button>
      </div>

      <Button
        onClick={handleSave}
        disabled={!isValid}
        className="w-full"
        size="lg"
        data-testid="button-save-quiz"
      >
        <Save className="w-4 h-4 mr-2" />
        Save Quiz
      </Button>
    </div>
  );
}
