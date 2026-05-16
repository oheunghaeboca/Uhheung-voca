import { useState } from 'react';
import styled from 'styled-components';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';

/**
 * 로그인 폼.
 *
 * 책임:
 *  - username/password 입력 받기.
 *  - 클라이언트 측 1차 검증(빈값/길이) — 서버 왕복을 줄인다.
 *  - 비밀번호 보기/숨기기 토글.
 *  - submit 중 disabled 처리, 부모가 내려준 server error 메시지 노출.
 *  - 비밀번호 값을 절대 console 등에 출력하지 않음.
 */
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const PasswordRow = styled.div`
  position: relative;
`;

const ToggleEye = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing[3]};
  top: 32px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.muted};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ErrorMsg = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSize.sm};
  min-height: 20px;
`;

const SubmitButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[5]};
  font-size: ${({ theme }) => theme.fontSize.base};
`;

export default function LoginForm({ onSubmit, submitting, errorMessage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    // 클라이언트 검증 — 백엔드와 동일한 길이 정책을 둔다.
    if (!username.trim() || !password) {
      setLocalError('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    if (username.length < 4 || username.length > 20) {
      setLocalError('아이디는 4~20자여야 합니다.');
      return;
    }
    if (password.length < 8) {
      setLocalError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    onSubmit?.({ username, password });
  };

  // 서버 에러가 우선, 없으면 로컬 검증 메시지.
  const errorToShow = errorMessage || localError;

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <Input
        label="아이디"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="username"
        autoComplete="username"
        disabled={submitting}
      />
      <PasswordRow>
        <Input
          label="비밀번호"
          type={showPw ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          disabled={submitting}
        />
        <ToggleEye
          type="button"
          onClick={() => setShowPw((v) => !v)}
          aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 표시'}
        >
          {showPw ? '숨기기' : '보기'}
        </ToggleEye>
      </PasswordRow>
      <ErrorMsg role="alert">{errorToShow}</ErrorMsg>
      <SubmitButton type="submit" disabled={submitting}>
        {submitting ? '로그인 중...' : '로그인'}
      </SubmitButton>
    </Form>
  );
}
