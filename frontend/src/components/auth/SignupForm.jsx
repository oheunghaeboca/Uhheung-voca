import { useState } from 'react';
import styled from 'styled-components';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';

/**
 * 회원가입 폼.
 *
 * 책임:
 *  - username / password / nickname 입력 받기 (백엔드 SignupRequest 와 동일).
 *  - 클라이언트 측 검증 — 백엔드 정책(4~20 / ≥8 / 1~20)과 동일하게.
 *  - username 정규식: 영문/숫자/언더스코어. 백엔드와 일치시켜 라운드트립 줄임.
 *  - 비밀번호 보기/숨기기 토글.
 *  - 부모의 server error 메시지가 들어오면 그것을 우선 노출.
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

const USERNAME_RE = /^[a-zA-Z0-9_]+$/;

export default function SignupForm({ onSubmit, submitting, errorMessage }) {
  const [form, setForm] = useState({ username: '', password: '', nickname: '' });
  const [showPw, setShowPw] = useState(false);
  const [localError, setLocalError] = useState('');

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    const { username, password, nickname } = form;

    if (!username.trim() || !password || !nickname.trim()) {
      setLocalError('모든 필드를 입력해주세요.');
      return;
    }
    if (username.length < 4 || username.length > 20) {
      setLocalError('아이디는 4~20자여야 합니다.');
      return;
    }
    if (!USERNAME_RE.test(username)) {
      setLocalError('아이디는 영문/숫자/언더스코어만 사용할 수 있습니다.');
      return;
    }
    if (password.length < 8) {
      setLocalError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (nickname.length < 1 || nickname.length > 20) {
      setLocalError('닉네임은 1~20자여야 합니다.');
      return;
    }

    onSubmit?.({ username, password, nickname });
  };

  const errorToShow = errorMessage || localError;

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <Input
        label="아이디"
        value={form.username}
        onChange={update('username')}
        placeholder="4~20자, 영문/숫자/_"
        autoComplete="username"
        disabled={submitting}
      />
      <Input
        label="닉네임"
        value={form.nickname}
        onChange={update('nickname')}
        placeholder="화면에 표시될 이름"
        autoComplete="nickname"
        disabled={submitting}
      />
      <PasswordRow>
        <Input
          label="비밀번호"
          type={showPw ? 'text' : 'password'}
          value={form.password}
          onChange={update('password')}
          placeholder="8자 이상"
          autoComplete="new-password"
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
        {submitting ? '가입 중...' : '회원가입'}
      </SubmitButton>
    </Form>
  );
}
