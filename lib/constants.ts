/**
 * Application-wide constants
 */

/**
 * Emoji constants for reactions
 */
export const EMOJI_REACTIONS = {
  LAUGHING: "🤣",
  SMIRKING: "😅",
  NEUTRAL: "😐",
  ANNOYED: "😝",
  SURPRISED: "🤔"
} as const;

/**
 * Array of all emoji reactions for iteration
 */
export const EMOJI_LIST = Object.values(EMOJI_REACTIONS);