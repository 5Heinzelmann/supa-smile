/**
 * Type definitions for the SupaSmile application
 */
import { EMOJI_REACTIONS } from './constants';

/**
 * Interface for Joke entity matching the database schema
 */
export interface Joke {
  id: string; // UUID
  text: string;
  created_at: string; // ISO timestamp
  is_current: boolean;
}

/**
 * Valid emoji reactions for jokes
 */
export type ValidEmoji = typeof EMOJI_REACTIONS[keyof typeof EMOJI_REACTIONS];

/**
 * Interface for Reaction entity matching the database schema
 */
export interface Reaction {
  id: string; // UUID
  joke_id: string; // UUID reference to Joke
  emoji: ValidEmoji;
  reaction_count: number;
}

/**
 * Type for a Joke with its associated Reactions
 */
export interface JokeWithReactions extends Joke {
  reactions: Reaction[];
}

/**
 * Type for creating a new Joke
 */
export type CreateJokeInput = {
  text: string;
  is_current?: boolean;
};

/**
 * Type for creating a new Reaction
 */
export type CreateReactionInput = {
  joke_id: string;
  emoji: ValidEmoji;
};

/**
 * Type for updating a Reaction's count
 */
export type UpdateReactionCountInput = {
  id: string;
  reaction_count: number;
};