"use client";

import { useEffect, useState } from "react";
import { JokeDisplay } from "@/components/joke-display";
import { EmojiReactions } from "@/components/emoji-reactions";
import { ReactionCounter } from "@/components/reaction-counter";
import { JokeWithReactions } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

interface JokePageClientProps {
  initialJoke?: JokeWithReactions;
}

export function JokePageClient({ initialJoke }: JokePageClientProps) {
  const [joke, setJoke] = useState<JokeWithReactions | null>(initialJoke || null);
  const [loading, setLoading] = useState(!initialJoke);

  useEffect(() => {
    // Set up Supabase realtime subscription
    const supabase = createClient();
    
    const channel = supabase
      .channel('current_joke_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jokes',
          filter: 'is_current=eq.true',
        },
        async (payload) => {
          // When joke changes, fetch the full joke with reactions
          const { data } = await supabase
            .from('jokes')
            .select('*, reactions(*)')
            .eq('id', payload.new.id)
            .single();
            
          if (data) {
            setJoke(data as JokeWithReactions);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
          <ReactionCounter jokeId={joke.id} initialReactions={joke.reactions} />
        </div>
      </div>
    </>
  );
}