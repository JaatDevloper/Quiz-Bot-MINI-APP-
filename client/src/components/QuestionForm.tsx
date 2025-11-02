import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { hapticFeedback } from '@/lib/telegram';
import type { Question } from '@shared/schema';

interface QuestionFormProps {
  question: Question;
  index: number;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
}

export default function QuestionForm({ question, index, onUpdate, onDelete }: QuestionFormProps) {
  const [text, setText] = useState(question.text);
  const [options, setOptions] = useState(question.options);
  const [correctIndex, setCorrectIndex] = useState(question.correctIndex);
  const [explanation, setExplanation] = useState(question.explanation || '');

  const updateQuestion = (updates: Partial<Question>) => {
    onUpdate({
      text,
      options,
      correctIndex,
      explanation,
      ...updates,
    });
  };

  const handleTextChange = (value: string) => {
    setText(value);
    updateQuestion({ text: value });
  };

  const handleOptionChange = (idx: number, value: string) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    setOptions(newOptions);
    updateQuestion({ options: newOptions });
  };

  const handleAddOption = () => {
    hapticFeedback('light');
    const newOptions = [...options, ''];
    setOptions(newOptions);
    updateQuestion({ options: newOptions });
  };

  const handleRemoveOption = (idx: number) => {
    hapticFeedback('warning');
    if (options.length <= 2) return;
    const newOptions = options.filter((_, i) => i !== idx);
    setOptions(newOptions);
    const newCorrectIndex = correctIndex >= newOptions.length ? 0 : correctIndex === idx ? 0 : correctIndex > idx ? correctIndex - 1 : correctIndex;
    setCorrectIndex(newCorrectIndex);
    updateQuestion({ options: newOptions, correctIndex: newCorrectIndex });
  };

  const handleCorrectChange = (idx: number) => {
    hapticFeedback('success');
    setCorrectIndex(idx);
    updateQuestion({ correctIndex: idx });
  };

  const handleExplanationChange = (value: string) => {
    setExplanation(value);
    updateQuestion({ explanation: value });
  };

  return (
    <Card className="p-4" data-testid={`card-question-${index}`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="secondary" className="flex-shrink-0">Question {index + 1}</Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              hapticFeedback('warning');
              onDelete();
            }}
            className="flex-shrink-0 w-8 h-8"
            data-testid="button-delete-question"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Question Text</label>
          <Textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Enter your question..."
            className="min-h-20"
            data-testid="input-question-text"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Answer Options</label>
          <div className="space-y-2">
            {options.map((option, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Checkbox
                  checked={correctIndex === idx}
                  onCheckedChange={() => handleCorrectChange(idx)}
                  data-testid={`checkbox-correct-${idx}`}
                />
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  className="flex-1"
                  data-testid={`input-option-${idx}`}
                />
                {options.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(idx)}
                    className="flex-shrink-0 w-8 h-8"
                    data-testid={`button-remove-option-${idx}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {options.length < 6 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddOption}
              className="mt-2 w-full"
              data-testid="button-add-option"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Option
            </Button>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Explanation (Optional)</label>
          <Textarea
            value={explanation}
            onChange={(e) => handleExplanationChange(e.target.value)}
            placeholder="Explain the correct answer..."
            className="min-h-16"
            data-testid="input-explanation"
          />
        </div>
      </div>
    </Card>
  );
}
