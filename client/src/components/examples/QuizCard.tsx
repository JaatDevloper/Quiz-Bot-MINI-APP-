import QuizCard from '../QuizCard';
import type { Quiz } from '@shared/schema';

export default function QuizCardExample() {
  const mockQuiz: Quiz = {
    id: '1',
    userId: 'user1',
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of core JavaScript concepts including variables, functions, and scope',
    category: 'Programming',
    isPaid: false,
    questions: [
      { text: 'What is a closure?', options: ['A', 'B', 'C'], correctIndex: 0 },
      { text: 'What is hoisting?', options: ['A', 'B', 'C'], correctIndex: 1 },
    ],
    createdAt: new Date(),
    published: true,
  };

  return (
    <div className="p-4 space-y-4">
      <QuizCard quiz={mockQuiz} />
      <QuizCard
        quiz={{
          ...mockQuiz,
          id: '2',
          title: 'Advanced React Patterns',
          isPaid: true,
          published: false,
        }}
      />
    </div>
  );
}
