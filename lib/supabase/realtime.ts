import { createClient } from './client';
import { Joke, Reaction, JokeWithReactions } from '../types';

// Channel names
const JOKE_UPDATES_CHANNEL = 'joke_updates';
const REACTION_UPDATES_CHANNEL = 'reaction_updates';

// Maximum number of reconnection attempts
const MAX_RECONNECT_ATTEMPTS = 5;
// Delay between reconnection attempts (in ms)
const RECONNECT_DELAY = 2000;

// Types for channel callbacks
export type JokeUpdateCallback = (joke: Joke) => void;
export type ReactionUpdateCallback = (reaction: Reaction) => void;

/**
 * Subscribe to joke updates channel
 */
export function subscribeToJokeUpdates(
  onJokeUpdate: JokeUpdateCallback,
  onError?: (error: Error) => void
) {
  const supabase = createClient();
  let reconnectAttempts = 0;
  
  const channel = supabase
    .channel(JOKE_UPDATES_CHANNEL)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'jokes',
      },
      (payload) => {
        try {
          const joke = payload.new as Joke;
          onJokeUpdate(joke);
        } catch (error) {
          if (onError && error instanceof Error) {
            onError(error);
          }
        }
      }
    )
    .subscribe((status) => {
      if (status === 'CHANNEL_ERROR') {
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++;
          setTimeout(() => {
            channel.subscribe();
          }, RECONNECT_DELAY);
        } else if (onError) {
          onError(new Error(`Failed to connect to ${JOKE_UPDATES_CHANNEL} after ${MAX_RECONNECT_ATTEMPTS} attempts`));
        }
      } else if (status === 'SUBSCRIBED') {
        reconnectAttempts = 0;
      }
    });

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    }
  };
}

/**
 * Subscribe to reaction updates channel
 */
export function subscribeToReactionUpdates(
  onReactionUpdate: ReactionUpdateCallback,
  onError?: (error: Error) => void
) {
  const supabase = createClient();
  let reconnectAttempts = 0;
  
  const channel = supabase
    .channel(REACTION_UPDATES_CHANNEL)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'reactions',
      },
      (payload) => {
        try {
          const reaction = payload.new as Reaction;
          onReactionUpdate(reaction);
        } catch (error) {
          if (onError && error instanceof Error) {
            onError(error);
          }
        }
      }
    )
    .subscribe((status) => {
      if (status === 'CHANNEL_ERROR') {
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++;
          setTimeout(() => {
            channel.subscribe();
          }, RECONNECT_DELAY);
        } else if (onError) {
          onError(new Error(`Failed to connect to ${REACTION_UPDATES_CHANNEL} after ${MAX_RECONNECT_ATTEMPTS} attempts`));
        }
      } else if (status === 'SUBSCRIBED') {
        reconnectAttempts = 0;
      }
    });

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    }
  };
}

/**
 * Subscribe to both joke and reaction updates for a specific joke
 */
export function subscribeToJokeWithReactions(
  jokeId: string,
  onUpdate: (data: { joke?: Joke; reaction?: Reaction }) => void,
  onError?: (error: Error) => void
) {
  const supabase = createClient();
  let reconnectAttempts = 0;
  
  const channel = supabase
    .channel(`joke_with_reactions:${jokeId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'jokes',
        filter: `id=eq.${jokeId}`,
      },
      (payload) => {
        try {
          const joke = payload.new as Joke;
          onUpdate({ joke });
        } catch (error) {
          if (onError && error instanceof Error) {
            onError(error);
          }
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'reactions',
        filter: `joke_id=eq.${jokeId}`,
      },
      (payload) => {
        try {
          const reaction = payload.new as Reaction;
          onUpdate({ reaction });
        } catch (error) {
          if (onError && error instanceof Error) {
            onError(error);
          }
        }
      }
    )
    .subscribe((status) => {
      if (status === 'CHANNEL_ERROR') {
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++;
          setTimeout(() => {
            channel.subscribe();
          }, RECONNECT_DELAY);
        } else if (onError) {
          onError(new Error(`Failed to connect to joke_with_reactions:${jokeId} after ${MAX_RECONNECT_ATTEMPTS} attempts`));
        }
      } else if (status === 'SUBSCRIBED') {
        reconnectAttempts = 0;
      }
    });

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    }
  };
}

/**
 * Subscribe to current joke updates
 */
export function subscribeToCurrentJoke(
  onCurrentJokeUpdate: JokeUpdateCallback,
  onError?: (error: Error) => void
) {
  const supabase = createClient();
  let reconnectAttempts = 0;
  
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
      (payload) => {
        try {
          const joke = payload.new as Joke;
          onCurrentJokeUpdate(joke);
        } catch (error) {
          if (onError && error instanceof Error) {
            onError(error);
          }
        }
      }
    )
    .subscribe((status) => {
      if (status === 'CHANNEL_ERROR') {
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++;
          setTimeout(() => {
            channel.subscribe();
          }, RECONNECT_DELAY);
        } else if (onError) {
          onError(new Error(`Failed to connect to current_joke_updates after ${MAX_RECONNECT_ATTEMPTS} attempts`));
        }
      } else if (status === 'SUBSCRIBED') {
        reconnectAttempts = 0;
      }
    });

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    }
  };
}