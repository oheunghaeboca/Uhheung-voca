import styled, { css } from 'styled-components';

const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary[500]};
    color: ${({ theme }) => theme.colors.text.inverse};
    &:hover { background: ${({ theme }) => theme.colors.primary[600]}; }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.secondary[500]};
    color: ${({ theme }) => theme.colors.text.inverse};
    &:hover { background: ${({ theme }) => theme.colors.secondary[700]}; }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.text.primary};
    border: 1px solid ${({ theme }) => theme.colors.border};
    &:hover { background: ${({ theme }) => theme.colors.bg}; }
  `,
};

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[5]}`};
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transition.fast};
  &:focus-visible { box-shadow: ${({ theme }) => theme.shadow.focus}; outline: none; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
  ${({ $variant = 'primary' }) => variants[$variant]}
`;

export default Button;
