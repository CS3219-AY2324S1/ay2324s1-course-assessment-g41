CREATE OR REPLACE FUNCTION update_user_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE Room
    SET user_count = user_count + 1
    WHERE name = NEW.room_name;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;