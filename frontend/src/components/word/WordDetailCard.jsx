import Card from '../ui/Card.jsx';

export default function WordDetailCard({ word }) {
  if (!word) return null;
  return (
    <Card>
      <h2>{word.english}</h2>
      <p>{word.korean}</p>
      {word.example && <blockquote>{word.example}</blockquote>}
    </Card>
  );
}
