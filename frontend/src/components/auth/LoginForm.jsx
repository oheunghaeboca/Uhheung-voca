import { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export default function LoginForm({ onSubmit }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // TODO: validation, 에러 표시 — Vibe Coding 시 채울 것
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ username, password });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />
      <button type="submit">로그인</button>
    </Form>
  );
}
