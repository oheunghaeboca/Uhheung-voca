import styled from 'styled-components';

const List = styled.ul`
  display: flex; flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export default function QuizChoiceList({ choices = [], onSelect }) {
  return (
    <List>
      {choices.map((c, i) => (
        <li key={i}>
          <button type="button" onClick={() => onSelect?.(c)}>{c}</button>
        </li>
      ))}
    </List>
  );
}
