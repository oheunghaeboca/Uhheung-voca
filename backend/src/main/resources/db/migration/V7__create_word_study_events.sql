-- PBI-12 B-옵션: 단어 학습 이벤트 추적 테이블.
-- 사용자가 단어 상세 또는 플래시카드에서 단어를 본 시점을 기록한다.
-- STUDY_WORDS 미션의 current 는 본 테이블의 오늘자 distinct word_id 카운트로 계산된다.
-- 같은 단어를 같은 날 여러 번 봐도 새 행이 쌓이지만, 카운트 시 DISTINCT 로 1로 환산된다.

CREATE TABLE word_study_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    word_id BIGINT NOT NULL,
    studied_at DATETIME(6) NOT NULL,
    CONSTRAINT fk_wse_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_wse_word FOREIGN KEY (word_id) REFERENCES words(id),
    INDEX idx_wse_user_studied (user_id, studied_at),
    INDEX idx_wse_word_id (word_id)
);
