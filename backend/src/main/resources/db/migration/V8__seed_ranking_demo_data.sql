-- 랭킹 화면(/api/ranking) 검증용 데모 데이터.
-- 기간 필터(WEEKLY/MONTHLY/ALL)별로 순위가 의미 있게 달라지도록 submitted_at 분포를 의도적으로 섞었다.
-- 비밀번호는 BCrypt("password") 한 가지로 통일 (운영 배포 시에는 본 V*.sql 을 별도로 제거하거나 사용자 삭제 처리 필요).

INSERT IGNORE INTO users (username, password, nickname, role) VALUES
  ('demo_tiger',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '호랑이왕',   'USER'),
  ('demo_cheetah', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '치타킹',     'USER'),
  ('demo_lion',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '사자단어왕', 'USER'),
  ('demo_panda',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '판다보카',   'USER'),
  ('demo_fox',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '여우영어',   'USER'),
  ('demo_wolf',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '늑대학생',   'USER');

-- demo_tiger: 모든 기간 1위 (전체 평균 ~95)
INSERT INTO quiz_results (user_id, quiz_type, total_questions, correct_count, score, submitted_at)
SELECT u.id, 'WORD_TO_MEANING', 10, 10, 100.00, DATE_SUB(NOW(), INTERVAL 1 DAY)  FROM users u WHERE u.username = 'demo_tiger' UNION ALL
SELECT u.id, 'MEANING_TO_WORD', 10,  9,  95.00, DATE_SUB(NOW(), INTERVAL 3 DAY)  FROM users u WHERE u.username = 'demo_tiger' UNION ALL
SELECT u.id, 'WORD_TO_MEANING', 10,  8,  85.00, DATE_SUB(NOW(), INTERVAL 5 DAY)  FROM users u WHERE u.username = 'demo_tiger' UNION ALL
SELECT u.id, 'MEANING_TO_WORD', 10,  9,  95.00, DATE_SUB(NOW(), INTERVAL 10 DAY) FROM users u WHERE u.username = 'demo_tiger' UNION ALL
SELECT u.id, 'WORD_TO_MEANING', 10,  9,  92.00, DATE_SUB(NOW(), INTERVAL 20 DAY) FROM users u WHERE u.username = 'demo_tiger' UNION ALL
SELECT u.id, 'MEANING_TO_WORD', 10, 10,  98.00, DATE_SUB(NOW(), INTERVAL 28 DAY) FROM users u WHERE u.username = 'demo_tiger';

-- demo_cheetah: WEEKLY 1위(평균 ~95) / ALL 2위(평균 ~88) — 최근 폼이 좋아진 케이스
INSERT INTO quiz_results (user_id, quiz_type, total_questions, correct_count, score, submitted_at)
SELECT u.id, 'WORD_TO_MEANING', 10, 10, 100.00, DATE_SUB(NOW(), INTERVAL 1 DAY)  FROM users u WHERE u.username = 'demo_cheetah' UNION ALL
SELECT u.id, 'MEANING_TO_WORD', 10,  9,  95.00, DATE_SUB(NOW(), INTERVAL 2 DAY)  FROM users u WHERE u.username = 'demo_cheetah' UNION ALL
SELECT u.id, 'WORD_TO_MEANING', 10,  9,  90.00, DATE_SUB(NOW(), INTERVAL 4 DAY)  FROM users u WHERE u.username = 'demo_cheetah' UNION ALL
SELECT u.id, 'MEANING_TO_WORD', 10,  8,  85.00, DATE_SUB(NOW(), INTERVAL 10 DAY) FROM users u WHERE u.username = 'demo_cheetah' UNION ALL
SELECT u.id, 'WORD_TO_MEANING', 10,  7,  78.00, DATE_SUB(NOW(), INTERVAL 20 DAY) FROM users u WHERE u.username = 'demo_cheetah' UNION ALL
SELECT u.id, 'MEANING_TO_WORD', 10,  8,  80.00, DATE_SUB(NOW(), INTERVAL 28 DAY) FROM users u WHERE u.username = 'demo_cheetah';

-- demo_lion: ALL 3위(평균 ~80) / WEEKLY 4위(평균 ~70) — 과거에 잘했지만 최근 하락
INSERT INTO quiz_results (user_id, quiz_type, total_questions, correct_count, score, submitted_at)
SELECT u.id, 'WORD_TO_MEANING', 10, 7, 70.00, DATE_SUB(NOW(), INTERVAL 2 DAY)  FROM users u WHERE u.username = 'demo_lion' UNION ALL
SELECT u.id, 'MEANING_TO_WORD', 10, 7, 70.00, DATE_SUB(NOW(), INTERVAL 5 DAY)  FROM users u WHERE u.username = 'demo_lion' UNION ALL
SELECT u.id, 'WORD_TO_MEANING', 10, 8, 80.00, DATE_SUB(NOW(), INTERVAL 10 DAY) FROM users u WHERE u.username = 'demo_lion' UNION ALL
SELECT u.id, 'MEANING_TO_WORD', 10, 8, 85.00, DATE_SUB(NOW(), INTERVAL 15 DAY) FROM users u WHERE u.username = 'demo_lion' UNION ALL
SELECT u.id, 'WORD_TO_MEANING', 10, 9, 90.00, DATE_SUB(NOW(), INTERVAL 22 DAY) FROM users u WHERE u.username = 'demo_lion' UNION ALL
SELECT u.id, 'MEANING_TO_WORD', 10, 8, 85.00, DATE_SUB(NOW(), INTERVAL 28 DAY) FROM users u WHERE u.username = 'demo_lion';

-- demo_panda: ALL 4위(평균 ~72) / WEEKLY 3위(평균 ~80) — 중위권에서 최근 반등
INSERT INTO quiz_results (user_id, quiz_type, total_questions, correct_count, score, submitted_at)
SELECT u.id, 'WORD_TO_MEANING', 10, 8, 85.00, DATE_SUB(NOW(), INTERVAL 1 DAY)  FROM users u WHERE u.username = 'demo_panda' UNION ALL
SELECT u.id, 'MEANING_TO_WORD', 10, 7, 75.00, DATE_SUB(NOW(), INTERVAL 4 DAY)  FROM users u WHERE u.username = 'demo_panda' UNION ALL
SELECT u.id, 'WORD_TO_MEANING', 10, 8, 80.00, DATE_SUB(NOW(), INTERVAL 6 DAY)  FROM users u WHERE u.username = 'demo_panda' UNION ALL
SELECT u.id, 'MEANING_TO_WORD', 10, 6, 65.00, DATE_SUB(NOW(), INTERVAL 12 DAY) FROM users u WHERE u.username = 'demo_panda' UNION ALL
SELECT u.id, 'WORD_TO_MEANING', 10, 6, 65.00, DATE_SUB(NOW(), INTERVAL 18 DAY) FROM users u WHERE u.username = 'demo_panda' UNION ALL
SELECT u.id, 'MEANING_TO_WORD', 10, 6, 62.00, DATE_SUB(NOW(), INTERVAL 25 DAY) FROM users u WHERE u.username = 'demo_panda';

-- demo_fox: ALL 5위(평균 ~65) / WEEKLY 5위(평균 ~60)
INSERT INTO quiz_results (user_id, quiz_type, total_questions, correct_count, score, submitted_at)
SELECT u.id, 'WORD_TO_MEANING', 10, 6, 60.00, DATE_SUB(NOW(), INTERVAL 2 DAY)  FROM users u WHERE u.username = 'demo_fox' UNION ALL
SELECT u.id, 'MEANING_TO_WORD', 10, 6, 60.00, DATE_SUB(NOW(), INTERVAL 6 DAY)  FROM users u WHERE u.username = 'demo_fox' UNION ALL
SELECT u.id, 'WORD_TO_MEANING', 10, 6, 65.00, DATE_SUB(NOW(), INTERVAL 12 DAY) FROM users u WHERE u.username = 'demo_fox' UNION ALL
SELECT u.id, 'MEANING_TO_WORD', 10, 7, 70.00, DATE_SUB(NOW(), INTERVAL 18 DAY) FROM users u WHERE u.username = 'demo_fox' UNION ALL
SELECT u.id, 'WORD_TO_MEANING', 10, 6, 68.00, DATE_SUB(NOW(), INTERVAL 22 DAY) FROM users u WHERE u.username = 'demo_fox' UNION ALL
SELECT u.id, 'MEANING_TO_WORD', 10, 6, 67.00, DATE_SUB(NOW(), INTERVAL 28 DAY) FROM users u WHERE u.username = 'demo_fox';

-- demo_wolf: ALL/WEEKLY 모두 최하위
INSERT INTO quiz_results (user_id, quiz_type, total_questions, correct_count, score, submitted_at)
SELECT u.id, 'WORD_TO_MEANING', 10, 5, 50.00, DATE_SUB(NOW(), INTERVAL 3 DAY)  FROM users u WHERE u.username = 'demo_wolf' UNION ALL
SELECT u.id, 'MEANING_TO_WORD', 10, 4, 40.00, DATE_SUB(NOW(), INTERVAL 5 DAY)  FROM users u WHERE u.username = 'demo_wolf' UNION ALL
SELECT u.id, 'WORD_TO_MEANING', 10, 5, 55.00, DATE_SUB(NOW(), INTERVAL 10 DAY) FROM users u WHERE u.username = 'demo_wolf' UNION ALL
SELECT u.id, 'MEANING_TO_WORD', 10, 6, 60.00, DATE_SUB(NOW(), INTERVAL 15 DAY) FROM users u WHERE u.username = 'demo_wolf' UNION ALL
SELECT u.id, 'WORD_TO_MEANING', 10, 6, 65.00, DATE_SUB(NOW(), INTERVAL 20 DAY) FROM users u WHERE u.username = 'demo_wolf' UNION ALL
SELECT u.id, 'MEANING_TO_WORD', 10, 6, 60.00, DATE_SUB(NOW(), INTERVAL 28 DAY) FROM users u WHERE u.username = 'demo_wolf';
