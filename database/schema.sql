-- PostgreSQL schema for multi-course E-Learning platform
-- Run: psql -f database/schema.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE organizations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE courses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL REFERENCES organizations(id),
  slug          TEXT NOT NULL,
  default_locale TEXT NOT NULL DEFAULT 'th',
  is_published  BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (org_id, slug)
);

CREATE TABLE course_translations (
  course_id     UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  locale        TEXT NOT NULL,
  title         TEXT NOT NULL,
  subtitle      TEXT,
  PRIMARY KEY (course_id, locale)
);

CREATE TABLE course_modules (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id     UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  sort_order    INT NOT NULL,
  slug          TEXT NOT NULL,
  UNIQUE (course_id, slug)
);

CREATE TABLE lesson_pages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id     UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  sort_order    INT NOT NULL,
  legacy_page_id INT,
  page_type     TEXT NOT NULL CHECK (page_type IN (
    'home', 'cover', 'article', 'cards_grid', 'split_advanced',
    'methods', 'quiz_interactive'
  )),
  quiz_mode     TEXT CHECK (quiz_mode IN ('pre', 'post')),
  content       JSONB NOT NULL DEFAULT '{}',
  UNIQUE (module_id, sort_order)
);

CREATE TABLE page_translations (
  page_id       UUID NOT NULL REFERENCES lesson_pages(id) ON DELETE CASCADE,
  locale        TEXT NOT NULL,
  title         TEXT,
  subtitle      TEXT,
  body          JSONB DEFAULT '{}',
  PRIMARY KEY (page_id, locale)
);

CREATE TABLE quiz_questions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id       UUID NOT NULL REFERENCES lesson_pages(id) ON DELETE CASCADE,
  sort_order    INT NOT NULL,
  correct_option_index INT NOT NULL
);

CREATE TABLE quiz_question_translations (
  question_id   UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  locale        TEXT NOT NULL,
  prompt        TEXT NOT NULL,
  hint          TEXT,
  image_url     TEXT,
  image_alt     TEXT,
  PRIMARY KEY (question_id, locale)
);

CREATE TABLE quiz_options (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id   UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  sort_order    INT NOT NULL
);

CREATE TABLE quiz_option_translations (
  option_id     UUID NOT NULL REFERENCES quiz_options(id) ON DELETE CASCADE,
  locale        TEXT NOT NULL,
  label         TEXT NOT NULL,
  PRIMARY KEY (option_id, locale)
);

CREATE TABLE classrooms (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id     UUID NOT NULL REFERENCES courses(id),
  org_id        UUID NOT NULL REFERENCES organizations(id),
  slug          TEXT NOT NULL,
  name          TEXT NOT NULL,
  UNIQUE (course_id, slug)
);

CREATE TABLE classroom_settings (
  classroom_id  UUID PRIMARY KEY REFERENCES classrooms(id) ON DELETE CASCADE,
  content_unlocked      BOOLEAN NOT NULL DEFAULT false,
  post_test_unlocked    BOOLEAN NOT NULL DEFAULT false,
  pre_test_required     BOOLEAN NOT NULL DEFAULT true,
  pretest_music_enabled BOOLEAN NOT NULL DEFAULT false,
  pretest_music_file    TEXT,
  pretest_music_title   TEXT,
  pretest_music_require_finish BOOLEAN DEFAULT true,
  pretest_music_skippable      BOOLEAN DEFAULT false,
  pretest_music_volume  NUMERIC(3,2) DEFAULT 0.70,
  announcement_html_enabled BOOLEAN DEFAULT false,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by    TEXT
);

CREATE TABLE announcements (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id  UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  body          TEXT NOT NULL,
  html_enabled  BOOLEAN NOT NULL DEFAULT false,
  published_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE,
  display_name  TEXT,
  role          TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin'))
);

CREATE TABLE classroom_enrollments (
  classroom_id  UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role          TEXT NOT NULL DEFAULT 'student',
  PRIMARY KEY (classroom_id, user_id)
);

CREATE TABLE quiz_attempts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id  UUID NOT NULL REFERENCES classrooms(id),
  page_id       UUID NOT NULL REFERENCES lesson_pages(id),
  user_id       UUID REFERENCES users(id),
  student_id    TEXT,
  score         INT NOT NULL,
  total         INT NOT NULL,
  percentage    INT,
  passed        BOOLEAN,
  started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at  TIMESTAMPTZ
);

CREATE TABLE manual_articles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id     UUID REFERENCES courses(id),
  slug          TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
  sort_order    INT NOT NULL DEFAULT 0
);

CREATE TABLE manual_article_translations (
  article_id    UUID NOT NULL REFERENCES manual_articles(id) ON DELETE CASCADE,
  locale        TEXT NOT NULL,
  title         TEXT NOT NULL,
  summary       TEXT,
  sections      JSONB NOT NULL DEFAULT '[]',
  PRIMARY KEY (article_id, locale)
);

CREATE INDEX idx_lesson_pages_module ON lesson_pages(module_id, sort_order);
CREATE INDEX idx_classrooms_course ON classrooms(course_id);
CREATE INDEX idx_quiz_attempts_classroom ON quiz_attempts(classroom_id, page_id);
CREATE INDEX idx_page_translations_locale ON page_translations(locale);
CREATE INDEX idx_manual_articles_course_role ON manual_articles(course_id, role);
