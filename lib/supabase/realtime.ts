import { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "./client";
import { JokeWithReactions, Reaction, ValidEmoji } from "../types";

/**
 * Subscribes to updates for the current joke
 */
export function subscribeToCurrentJoke(
  onJokeUpdate: (joke: JokeWithReactions) => void
): { channel: RealtimeChannel; unsubscribe: () => void } {
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
        // Ensure payload.new has an id property
        if (payload.new && typeof payload.new === 'object' && 'id' in payload.new) {
          try {
            const { data } = await supabase
              .from('jokes')
              .select('*, reactions(*)')
              .eq('id', payload.new.id)
              .single();
              
            if (data) {
              // Create a new joke object with a new reactions array to ensure React detects the change
              const updatedJoke = {
                ...data,
                reactions: [...data.reactions] // Create a new array reference
              };
              
              onJokeUpdate(updatedJoke as JokeWithReactions);
            }
          } catch (error) {
            console.error('Error fetching updated joke:', error);
          }
        }
      }
    )
    .subscribe();

  return {
    channel,
    unsubscribe: () => supabase.removeChannel(channel)
  };
}

/**
 * Subscribes to reaction updates for a specific joke
 */
export function subscribeToJokeReactions(
  jokeId: string,
  onReactionUpdate: (reaction: Reaction) => void
): { channel: RealtimeChannel; unsubscribe: () => void } {
  const supabase = createClient();
  
  const channel = supabase
    .channel(`reactions:${jokeId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'reactions',
        filter: `joke_id=eq.${jokeId}`,
      },
      (payload) => {
        const updatedReaction = payload.new as Reaction;
        onReactionUpdate(updatedReaction);
      }
    )
    .subscribe();

  return {
    channel,
    unsubscribe: () => supabase.removeChannel(channel)
  };
}

/**
 * Fetches all reactions for a specific joke
 */
export async function fetchJokeReactions(
  jokeId: string
): Promise<Record<ValidEmoji, number> | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('reactions')
      .select('*')
      .eq('joke_id', jokeId);
    
    if (error) {
      throw error;
    }
    
    // Initialize with zero counts
    const counts: Record<ValidEmoji, number> = {} as Record<ValidEmoji, number>;
    
    // Update with actual counts from data
    if (data) {
      data.forEach((reaction) => {
        counts[reaction.emoji as ValidEmoji] = reaction.reaction_count;
      });
    }
    
    return counts;
  } catch (error) {
    console.error("Error fetching reactions:", error);
    return null;
  }
}