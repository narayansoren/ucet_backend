CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role_id INTEGER NOT NULL REFERENCES roles(id),
  graduation_year INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_email_verified BOOLEAN NOT NULL DEFAULT false,
  token_version INTEGER NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at timestamptz NOT NULL,
  revoked BOOLEAN NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- seed roles
INSERT INTO roles (name, description)
VALUES
  ('super_user', 'System super user'),
  ('admin', 'Admin user'),
  ('faculty', 'Faculty'),
  ('student', 'Student'),
  ('alumni', 'Alumni')
ON CONFLICT (name) DO NOTHING;