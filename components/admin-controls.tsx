"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AdminControlsProps {
  onJokeChange?: () => void;
}

export function AdminControls({ onJokeChange }: AdminControlsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNextJoke = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      
      // Get the current active joke
      const { data: currentActiveJoke, error: fetchError } = await supabase
        .from('jokes')
        .select('id')
        .eq('is_current', true)
        .single();
      
      if (fetchError) {
        throw new Error(`Failed to get current active joke: ${fetchError.message}`);
      }
      
      // Try to get the joke with the next higher ID
      const { data: nextJokeHigher } = await supabase
        .from('jokes')
        .select('id')
        .gt('id', currentActiveJoke.id)
        .order('id')
        .limit(1);
      
      let nextJoke;
      
      // If there's a joke with a higher ID, use it
      if (nextJokeHigher && nextJokeHigher.length > 0) {
        nextJoke = nextJokeHigher[0];
      } else {
        // Otherwise, wrap around to the joke with the lowest ID
        const { data: nextJokeLower, error: nextJokeLowerError } = await supabase
          .from('jokes')
          .select('id')
          .neq('id', currentActiveJoke.id)
          .order('id')
          .limit(1);
        
        if (nextJokeLowerError || !nextJokeLower || nextJokeLower.length === 0) {
          throw new Error(`Failed to get next joke: ${nextJokeLowerError?.message || 'No jokes available'}`);
        }
        
        nextJoke = nextJokeLower[0];
      }
      
      // Update the active status
      const { error: updateError } = await supabase
        .from('jokes')
        .update({ is_current: false })
        .eq('id', currentActiveJoke.id);
      
      if (updateError) {
        throw new Error(`Failed to deactivate current joke: ${updateError.message}`);
      }
      
      const { error: activateError } = await supabase
        .from('jokes')
        .update({ is_current: true })
        .eq('id', nextJoke.id);
      
      if (activateError) {
        throw new Error(`Failed to activate next joke: ${activateError.message}`);
      }

      // Notify parent component if callback provided
      if (onJokeChange) {
        onJokeChange();
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load next joke");
      console.error("Error loading next joke:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent>
        {error && (
          <div className="mb-4 p-2 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}
        
        <Button
          onClick={handleNextJoke}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading Next Joke...
            </>
          ) : (
            <>
              Next Joke
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}