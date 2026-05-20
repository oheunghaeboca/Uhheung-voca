import styled from 'styled-components';

const Wrap = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
const Field = styled.input`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[3]}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  &:focus { outline: none; box-shadow: ${({ theme }) => theme.shadow.focus}; }
`;
const Helper = styled.span`
  color: ${({ $error, theme }) => ($error ? theme.colors.error : theme.colors.text.muted)};
`;

export default function Input({ label, error, helperText, ...rest }) {
  return (
    <Wrap>
      {label && <span>{label}</span>}
      <Field {...rest} />
      {(error || helperText) && <Helper $error={!!error}>{error || helperText}</Helper>}
    </Wrap>
  );
}
