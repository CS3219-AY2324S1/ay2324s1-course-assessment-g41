CREATE TRIGGER Room_User_insert_trigger
AFTER INSERT ON Room_User
FOR EACH ROW
EXECUTE FUNCTION update_user_count();