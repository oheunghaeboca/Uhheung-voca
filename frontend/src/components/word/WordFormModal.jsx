import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.z.modal};
`;

const Dialog = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[5]};
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[5]};
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const inputStyle = ({ theme }) => `
  width: 100%;
  box-sizing: border-box;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  font-size: ${theme.fontSize.base};
  font-family: inherit;
  color: ${theme.colors.text.primary};
  outline: none;
  transition: border-color ${theme.transition.fast}, box-shadow ${theme.transition.fast};

  &:focus {
    border-color: ${theme.colors.primary[500]};
    box-shadow: ${theme.shadow.focus};
  }
`;

const Input = styled.input`${inputStyle}`;

const Select = styled.select`
  ${inputStyle}
  background: white;
  cursor: pointer;
`;

const Textarea = styled.textarea`
  ${inputStyle}
  resize: vertical;
  min-height: 72px;
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const CancelButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[5]}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  background: transparent;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transition.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.bg};
  }

  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const SaveButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[5]}`};
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.inverse};
  background: ${({ theme }) => theme.colors.primary[500]};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transition.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary[600]};
  }

  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const EMPTY = { english: '', korean: '', level: 'BASIC', type: 'RC', part: '', example: '', exampleTranslation: '' };

export default function WordFormModal({ word, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setForm(
      word
        ? { english: word.english ?? '', korean: word.korean ?? '', level: word.level ?? 'BASIC',
            type: word.type ?? 'RC', part: word.part ?? '', example: word.example ?? '',
            exampleTranslation: word.exampleTranslation ?? '' }
        : EMPTY
    );
    setError(null);
  }, [word]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message ?? '저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Title>{word ? '단어 수정' : '단어 추가'}</Title>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div>
              <Label htmlFor="wf-english">영단어 *</Label>
              <Input id="wf-english" name="english" value={form.english} onChange={handleChange}
                placeholder="예: achieve" required />
            </div>
            <div>
              <Label htmlFor="wf-korean">뜻 *</Label>
              <Input id="wf-korean" name="korean" value={form.korean} onChange={handleChange}
                placeholder="예: 달성하다" required />
            </div>
            <FieldRow>
              <div>
                <Label htmlFor="wf-level">레벨 *</Label>
                <Select id="wf-level" name="level" value={form.level} onChange={handleChange} required>
                  <option value="BASIC">BASIC</option>
                  <option value="FREQUENT">FREQUENT</option>
                  <option value="ADVANCED">ADVANCED</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="wf-type">유형 *</Label>
                <Select id="wf-type" name="type" value={form.type} onChange={handleChange} required>
                  <option value="LC">LC</option>
                  <option value="RC">RC</option>
                </Select>
              </div>
            </FieldRow>
            <div>
              <Label htmlFor="wf-part">품사</Label>
              <Input id="wf-part" name="part" value={form.part} onChange={handleChange}
                placeholder="예: 동사" />
            </div>
            <div>
              <Label htmlFor="wf-example">예문</Label>
              <Textarea id="wf-example" name="example" value={form.example} onChange={handleChange}
                placeholder="영어 예문을 입력하세요" />
            </div>
            <div>
              <Label htmlFor="wf-exTrans">예문 번역</Label>
              <Textarea id="wf-exTrans" name="exampleTranslation" value={form.exampleTranslation}
                onChange={handleChange} placeholder="예문의 한국어 번역을 입력하세요" />
            </div>
          </FieldGroup>
          {error && <ErrorText>{error}</ErrorText>}
          <ButtonRow>
            <CancelButton type="button" onClick={onClose} disabled={loading}>취소</CancelButton>
            <SaveButton type="submit" disabled={loading}>{loading ? '저장 중...' : '저장'}</SaveButton>
          </ButtonRow>
        </form>
      </Dialog>
    </Overlay>
  );
}
