import QuizChoiceList from './QuizChoiceList.jsx';

export default function QuizQuestion({ question, onAnswer }) {
  if (!question) return null;
  return (
    <div>
      <h3>{question.prompt}</h3>
      <QuizChoiceList choices={question.choices} onSelect={onAnswer} />
    </div>
  );
}
