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
          console.log('Joke update received:', payload.new);
          
          // When joke changes, fetch the full joke with reactions
          // Ensure payload.new has an id property
          if (payload.new && typeof payload.new === 'object' && 'id' in payload.new) {
            try {
              const { data } = await supabase
                .from('jokes')
                .select('*, reactions(*)')
                .eq('id', payload.new.id)
                .single();
                
              if (data) {
                console.log('Fetched updated joke with reactions:', data);
                
                // Create a new joke object with a new reactions array to ensure React detects the change
                const updatedJoke = {
                  ...data,
                  reactions: [...data.reactions] // Create a new array reference
                };
                
                console.log('Setting joke with new reactions array:', updatedJoke);
                setJoke(updatedJoke as JokeWithReactions);
              }
            } catch (error) {
              console.error('Error fetching updated joke:', error);
            }
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