import styled from 'styled-components';
import { useToast } from '../../hooks/useToast';

const Stack = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing[6]};
  right: ${({ theme }) => theme.spacing[6]};
  display: flex; flex-direction: column; gap: ${({ theme }) => theme.spacing[2]};
  z-index: ${({ theme }) => theme.z.toast};
`;
const Item = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-left: 4px solid ${({ theme, $variant }) => theme.colors[$variant] ?? theme.colors.info};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.lg};
`;

export default function Toast() {
  const { toasts } = useToast();
  return (
    <Stack>
      {toasts.map((t) => (
        <Item key={t.id} $variant={t.variant}>{t.message}</Item>
      ))}
    </Stack>
  );
}
