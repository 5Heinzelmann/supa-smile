"use client";

import { useEffect, useState } from "react";
import { JokeDisplay } from "@/components/joke-display";
import { EmojiReactions } from "@/components/emoji-reactions";
import { ReactionCounter } from "@/components/reaction-counter";
import { JokeWithReactions } from "@/lib/types";
import { subscribeToCurrentJoke } from "@/lib/supabase/realtime";

interface JokePageClientProps {
  initialJoke?: JokeWithReactions;
}

export function JokePageClient({ initialJoke }: JokePageClientProps) {
  const [joke, setJoke] = useState<JokeWithReactions | null>(initialJoke || null);
  const [loading] = useState(!initialJoke);

  useEffect(() => {
    // Set up Supabase realtime subscription for current joke
    const { unsubscribe } = subscribeToCurrentJoke((updatedJoke) => {
      console.log('Setting joke with new reactions array:', updatedJoke);
      setJoke(updatedJoke);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading || !joke) {
    return (
      <div className="w-full">
        <JokeDisplay isLoading />
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        <JokeDisplay joke={joke} />
      </div>
      
      <div className="w-full space-y-8">
        <div className="w-full">
          <EmojiReactions jokeId={joke.id} />
        </div>
        
        <div className="w-full">
          <ReactionCounter
            key={`reactions-${joke.id}-${joke.reactions.length}`}
            jokeId={joke.id}
            initialReactions={joke.reactions}
          />
        </div>
      </div>
    </>
  );
}