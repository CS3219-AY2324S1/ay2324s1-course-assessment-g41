CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE Room (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    is_open BOOLEAN NOT NULL DEFAULT false,
    user_count INTEGER DEFAULT 0 CHECK (user_count >= 0 AND user_count <= 2),
    attempt_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
