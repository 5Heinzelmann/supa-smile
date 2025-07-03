-- Enable realtime for the jokes and reactions tables
-- This migration creates the necessary publications for Supabase realtime functionality

-- Create a publication for the jokes table
CREATE PUBLICATION jokes_publication FOR TABLE jokes;

-- Create a publication for the reactions table
CREATE PUBLICATION reactions_publication FOR TABLE reactions;

-- Create a combined publication for both tables
CREATE PUBLICATION jokez_realtime FOR TABLE jokes, reactions;

-- Add comments for better documentation
COMMENT ON PUBLICATION jokes_publication IS 'Publication for realtime changes to the jokes table';
COMMENT ON PUBLICATION reactions_publication IS 'Publication for realtime changes to the reactions table';
COMMENT ON PUBLICATION jokez_realtime IS 'Combined publication for realtime changes to jokes and reactions tables';