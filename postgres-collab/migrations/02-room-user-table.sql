CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE Room_User (
  id serial PRIMARY KEY,
  user_id UUID NOT NULL,
  room_name TEXT NOT NULL,
  -- Add a unique constraint to ensure that user_id is not repeatted per room
  CONSTRAINT unique_user_per_room UNIQUE (room_name, user_id)
);