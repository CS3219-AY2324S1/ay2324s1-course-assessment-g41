CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE topics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    description TEXT
);

CREATE TABLE languages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    description TEXT
);

CREATE TABLE user_topic (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES topics (id) ON DELETE CASCADE,
    CONSTRAINT user_topic_unique UNIQUE (user_id, topic_id)
);

ALTER TABLE users
ADD CONSTRAINT fk_preferred_language
FOREIGN KEY (preferred_language)
REFERENCES languages (id);