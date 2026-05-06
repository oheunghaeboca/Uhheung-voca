-- 어흥해보카 초기 스키마
-- API 명세서 v1.0 ERD 기반 (users, words, quiz_results, quiz_result_details, bookmarks, attendance, daily_missions)

CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(20) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       nickname VARCHAR(20) NOT NULL,
                       role VARCHAR(10) NOT NULL DEFAULT 'USER',
                       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE words (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       english VARCHAR(50) NOT NULL UNIQUE,
                       korean VARCHAR(200) NOT NULL,
                       level VARCHAR(20) NOT NULL,
                       type VARCHAR(10) NOT NULL,
                       example VARCHAR(300),
                       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       INDEX idx_words_level (level),
                       INDEX idx_words_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE quiz_results (
                              id BIGINT AUTO_INCREMENT PRIMARY KEY,
                              user_id BIGINT NOT NULL,
                              quiz_type VARCHAR(20) NOT NULL,
                              total_questions INT NOT NULL,
                              correct_count INT NOT NULL,
                              score DECIMAL(5,2) NOT NULL,
                              submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              CONSTRAINT fk_quiz_results_user
                                  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                              INDEX idx_quiz_results_user (user_id),
                              INDEX idx_quiz_results_submitted (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE quiz_result_details (
                                     id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                     quiz_result_id BIGINT NOT NULL,
                                     word_id BIGINT NOT NULL,
                                     question_number INT NOT NULL,
                                     user_answer VARCHAR(50),
                                     correct_answer VARCHAR(50) NOT NULL,
                                     is_correct BOOLEAN NOT NULL,
                                     CONSTRAINT fk_qrd_quiz_result
                                         FOREIGN KEY (quiz_result_id) REFERENCES quiz_results(id) ON DELETE CASCADE,
                                     CONSTRAINT fk_qrd_word
                                         FOREIGN KEY (word_id) REFERENCES words(id),
                                     INDEX idx_qrd_quiz_result (quiz_result_id),
                                     INDEX idx_qrd_word (word_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE bookmarks (
                           id BIGINT AUTO_INCREMENT PRIMARY KEY,
                           user_id BIGINT NOT NULL,
                           word_id BIGINT NOT NULL,
                           created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           CONSTRAINT fk_bookmarks_user
                               FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                           CONSTRAINT fk_bookmarks_word
                               FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
                           CONSTRAINT uq_bookmarks_user_word UNIQUE (user_id, word_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE attendance (
                            id BIGINT AUTO_INCREMENT PRIMARY KEY,
                            user_id BIGINT NOT NULL,
                            date DATE NOT NULL,
                            is_attended BOOLEAN NOT NULL DEFAULT FALSE,
                            score DECIMAL(5,2),
                            CONSTRAINT fk_attendance_user
                                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                            CONSTRAINT uq_attendance_user_date UNIQUE (user_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE daily_missions (
                                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                user_id BIGINT NOT NULL,
                                date DATE NOT NULL,
                                words_studied INT NOT NULL DEFAULT 0,
                                quizzes_taken INT NOT NULL DEFAULT 0,
                                highest_score DECIMAL(5,2),
                                is_completed BOOLEAN NOT NULL DEFAULT FALSE,
                                attendance_granted BOOLEAN NOT NULL DEFAULT FALSE,
                                CONSTRAINT fk_daily_missions_user
                                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                CONSTRAINT uq_daily_missions_user_date UNIQUE (user_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;