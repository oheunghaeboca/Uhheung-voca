import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex; align-items: center; justify-content: center;
  z-index: ${({ theme }) => theme.z.overlay};
`;
const Box = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  z-index: ${({ theme }) => theme.z.modal};
  min-width: 320px;
`;

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <Overlay onClick={onClose}>
      <Box onClick={(e) => e.stopPropagation()}>{children}</Box>
    </Overlay>
  );
}
