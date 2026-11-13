CREATE DATABASE IF NOT EXISTS lsda CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lsda;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  identifier VARCHAR(160) NOT NULL UNIQUE,           -- email OR phone number
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('learner','instructor','admin') NOT NULL DEFAULT 'learner',
  gender ENUM('female','male','other','undisclosed') NOT NULL DEFAULT 'undisclosed',
  age_group ENUM('under18','18-35','36-60','over60') NULL,
  has_disability ENUM('yes','no','undisclosed') NOT NULL DEFAULT 'undisclosed',
  language ENUM('en','so') NOT NULL DEFAULT 'en',
  consent_at DATETIME NULL,
  guardian_consent TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  module_no INT NOT NULL,
  title_en VARCHAR(160) NOT NULL,
  title_so VARCHAR(160) NULL,
  description_en TEXT NOT NULL,
  description_so TEXT NULL,
  published TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS lessons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  position INT NOT NULL,
  title_en VARCHAR(160) NOT NULL,
  title_so VARCHAR(160) NULL,
  body_en TEXT NOT NULL,
  body_so TEXT NULL,
  video_url VARCHAR(300) NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_enroll (user_id, course_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  lesson_id INT NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_progress (user_id, lesson_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quizzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL UNIQUE,
  pass_mark INT NOT NULL DEFAULT 70,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id INT NOT NULL,
  text_en VARCHAR(400) NOT NULL,
  text_so VARCHAR(400) NULL,
  options_en JSON NOT NULL,
  options_so JSON NULL,
  correct_index INT NOT NULL,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- kind 'pre' = baseline test before learning, 'post' = final assessment (used for the M&E pre/post comparison)
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  kind ENUM('pre','post') NOT NULL,
  score INT NOT NULL,
  passed TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  certificate_no VARCHAR(40) NOT NULL UNIQUE,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('valid','revoked') NOT NULL DEFAULT 'valid',
  UNIQUE KEY uq_cert (user_id, course_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NULL,
  rating INT NOT NULL,
  usability_ok TINYINT(1) NOT NULL,                  -- "I could use this without help"
  comment VARCHAR(1000) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
