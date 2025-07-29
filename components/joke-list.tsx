"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Joke } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface JokeListProps {
  refreshTrigger?: number;
}

export function JokeList({ refreshTrigger }: JokeListProps) {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJokes = async () => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('jokes')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setJokes(data || []);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to load jokes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJokes();
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Supa-Smile Collection 📚</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading all the giggles... 🔄</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Jokes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Jokes ({jokes.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {jokes.length === 0 ? (
          <p className="text-muted-foreground">No jokes found. Add the first one!</p>
        ) : (
          <div className="space-y-4">
            {jokes.map((joke) => (
              <div
                key={joke.id}
                className="p-4 border rounded-lg bg-muted/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="flex-1">{joke.text}</p>
                  {joke.is_current && (
                    <Badge variant="default">Current</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Added: {new Date(joke.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}