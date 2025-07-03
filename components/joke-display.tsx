"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Joke, JokeWithReactions } from "@/lib/types";

interface JokeDisplayProps {
  joke?: JokeWithReactions | Joke;
  isLoading?: boolean;
}

export function JokeDisplay({ joke, isLoading }: JokeDisplayProps) {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center">Loading joke...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center">
            <div className="animate-pulse h-4 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!joke) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-center text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-destructive">No joke available</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Joke of the Day</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xl text-center p-6 min-h-24 flex items-center justify-center">
          {joke.text || "No joke available"}
        </div>
      </CardContent>
    </Card>
  );
}