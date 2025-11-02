import { useState } from 'react';
import QuestionForm from '../QuestionForm';
import type { Question } from '@shared/schema';

export default function QuestionFormExample() {
  const [question, setQuestion] = useState<Question>({
    text: 'What is the capital of France?',
    options: ['Paris', 'London', 'Berlin', 'Madrid'],
    correctIndex: 0,
    explanation: 'Paris is the capital and largest city of France.',
  });

  return (
    <div className="p-4">
      <QuestionForm
        question={question}
        index={0}
        onUpdate={setQuestion}
        onDelete={() => console.log('Delete question')}
      />
    </div>
  );
}
