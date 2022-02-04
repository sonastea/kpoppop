CREATE OR REPLACE FUNCTION notify_new_meme()
  RETURNS trigger AS $$
DECLARE
BEGIN
  PERFORM pg_notify(
    'new_meme',
    row_to_json(NEW)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER new_meme_insert AFTER INSERT on "kpoppop"."Meme"
        FOR EACH ROW
        WHEN (NEW.flagged is true)
        EXECUTE PROCEDURE notify_new_meme();
