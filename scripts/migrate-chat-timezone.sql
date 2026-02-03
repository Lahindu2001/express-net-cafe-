-- Migrate chat tables to use TIMESTAMPTZ for proper timezone handling

-- Update chat_sessions table
ALTER TABLE chat_sessions 
  ALTER COLUMN last_message_at TYPE TIMESTAMPTZ USING last_message_at AT TIME ZONE 'UTC',
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';

-- Update chat_messages table
ALTER TABLE chat_messages 
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('chat_sessions', 'chat_messages') 
  AND column_name LIKE '%_at';
