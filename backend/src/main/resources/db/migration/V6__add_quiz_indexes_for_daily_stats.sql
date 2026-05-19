-- PBI-12 데일리 미션 통계 쿼리의 성능 인덱스.
-- (1) GET /api/missions/today 의 quiz_results 일자 필터 (user_id, DATE(submitted_at))
-- (2) PBI-11 GET /api/words/daily 의 learning history aggregation (word_id GROUP BY)
-- 머지된 V1~V5 는 절대 수정 금지. 신규 V6 으로만 변경.

CREATE INDEX idx_qr_user_submitted ON quiz_results (user_id, submitted_at);
CREATE INDEX idx_qrd_word_id ON quiz_result_details (word_id);
