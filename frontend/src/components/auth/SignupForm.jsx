import { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export default function SignupForm({ onSubmit }) {
  const [form, setForm] = useState({ username: '', password: '', nickname: '' });

  // TODO: 비밀번호 정책, 닉네임 검증 — Vibe Coding 시 채울 것
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
  };

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <Form onSubmit={handleSubmit}>
      <input value={form.username} onChange={update('username')} placeholder="username" />
      <input value={form.password} onChange={update('password')} placeholder="password" type="password" />
      <input value={form.nickname} onChange={update('nickname')} placeholder="nickname" />
      <button type="submit">회원가입</button>
    </Form>
  );
}
