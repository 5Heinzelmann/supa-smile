-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Jokes table
CREATE TABLE jokes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_current BOOLEAN DEFAULT FALSE
);

-- Create index on is_current for faster queries
CREATE INDEX idx_jokes_is_current ON jokes(is_current);

-- Create Reactions table
CREATE TABLE reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    joke_id UUID NOT NULL REFERENCES jokes(id) ON DELETE CASCADE,
    emoji TEXT NOT NULL,
    reaction_count INTEGER DEFAULT 0,
    
    -- Ensure unique emoji reactions per joke
    CONSTRAINT unique_joke_emoji UNIQUE (joke_id, emoji)
);

-- Create index on joke_id for faster joins
CREATE INDEX idx_reactions_joke_id ON reactions(joke_id);

-- Function to get the current joke
CREATE OR REPLACE FUNCTION get_current_joke()
RETURNS TABLE (
    id UUID,
    text TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    is_current BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT j.id, j.text, j.created_at, j.is_current
    FROM jokes j
    WHERE j.is_current = TRUE
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to set a joke as the current one
CREATE OR REPLACE FUNCTION set_current_joke(target_joke_id UUID)
RETURNS VOID AS $$
BEGIN
    -- First, set all jokes to not current
    UPDATE jokes
    SET is_current = FALSE;
    
    -- Then set the specified joke as current
    UPDATE jokes
    SET is_current = TRUE
    WHERE id = target_joke_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get the next joke (a random joke that hasn't been current yet)
CREATE OR REPLACE FUNCTION get_next_joke()
RETURNS TABLE (
    id UUID,
    text TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    is_current BOOLEAN
) AS $$
DECLARE
    next_joke_id UUID;
BEGIN
    -- Try to find a joke that hasn't been current yet
    SELECT j.id INTO next_joke_id
    FROM jokes j
    WHERE j.is_current = FALSE
    ORDER BY RANDOM()
    LIMIT 1;
    
    -- If no joke found (all have been current), get any random joke except the current one
    IF next_joke_id IS NULL THEN
        SELECT j.id INTO next_joke_id
        FROM jokes j
        WHERE j.is_current = FALSE
        ORDER BY RANDOM()
        LIMIT 1;
        
        -- If still no joke found (only one joke in the table and it's current), return the current joke
        IF next_joke_id IS NULL THEN
            RETURN QUERY
            SELECT j.id, j.text, j.created_at, j.is_current
            FROM jokes j
            WHERE j.is_current = TRUE
            LIMIT 1;
            RETURN;
        END IF;
    END IF;
    
    -- Return the selected next joke
    RETURN QUERY
    SELECT j.id, j.text, j.created_at, j.is_current
    FROM jokes j
    WHERE j.id = next_joke_id;
END;
$$ LANGUAGE plpgsql;

-- Add comment to tables and functions for better documentation
COMMENT ON TABLE jokes IS 'Table storing all jokes for the SupaSmile application';
COMMENT ON TABLE reactions IS 'Table storing emoji reactions for jokes';
COMMENT ON FUNCTION get_current_joke() IS 'Returns the currently active joke';
COMMENT ON FUNCTION set_current_joke(UUID) IS 'Sets a specific joke as the current one and resets all others';
COMMENT ON FUNCTION get_next_joke() IS 'Returns a random joke that has not been set as current yet';