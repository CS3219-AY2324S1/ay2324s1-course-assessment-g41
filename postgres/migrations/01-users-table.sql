CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    image TEXT NOT NULL,
    name VARCHAR(255),
    preferred_language UUID,
    preferred_difficulty INTEGER
);