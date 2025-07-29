-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Jokes table
CREATE TABLE jokes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_current BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_jokes_is_current ON jokes(is_current);

-- Create Reactions table
CREATE TABLE reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    joke_id UUID NOT NULL REFERENCES jokes(id) ON DELETE CASCADE,
    emoji TEXT NOT NULL,
    reaction_count INTEGER DEFAULT 0
);

CREATE INDEX idx_reactions_joke_id ON reactions(joke_id);

-- Add comment to tables and functions for better documentation
COMMENT ON TABLE jokes IS 'Table storing all jokes for the SupaSmile application';
COMMENT ON TABLE reactions IS 'Table storing emoji reactions for jokes';