-- Migration to remove unused database functions

-- Drop the get_current_joke function
DROP FUNCTION IF EXISTS get_current_joke();

-- Drop the set_current_joke function
DROP FUNCTION IF EXISTS set_current_joke(UUID);

-- Drop the get_next_joke function
DROP FUNCTION IF EXISTS get_next_joke();

-- Add a comment explaining the migration
COMMENT ON SCHEMA public IS 'Removed unused database functions (get_current_joke, set_current_joke, get_next_joke) as they were not being used by the application code.';