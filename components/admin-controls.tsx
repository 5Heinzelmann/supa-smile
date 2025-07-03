"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AdminControlsProps {
  onJokeChange?: () => void;
}

export function AdminControls({ onJokeChange }: AdminControlsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleNextJoke = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
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
      
      // Get the next joke (any joke that isn't the current active one)
      const { data: nextJoke, error: nextJokeError } = await supabase
        .from('jokes')
        .select('id')
        .neq('id', currentActiveJoke.id)
        .limit(1)
        .single();
      
      if (nextJokeError) {
        throw new Error(`Failed to get next joke: ${nextJokeError.message}`);
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

      setSuccess("Successfully loaded the next joke!");
      
      // Notify parent component if callback provided
      if (onJokeChange) {
        onJokeChange();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load next joke");
      console.error("Error loading next joke:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Admin Controls</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-2 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-md text-sm">
            {success}
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