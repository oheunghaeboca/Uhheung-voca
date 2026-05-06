import Modal from '../ui/Modal.jsx';

export default function QuizStartModal({ open, onClose, onStart }) {
  // TODO: 퀴즈 유형 / 난이도 / 문항 수 선택 — Vibe Coding 시 채울 것
  return (
    <Modal open={open} onClose={onClose}>
      <h3>퀴즈 시작</h3>
      <button type="button" onClick={() => onStart?.({ quizType: 'EN_TO_KO', questionCount: 10 })}>
        시작
      </button>
    </Modal>
  );
}
