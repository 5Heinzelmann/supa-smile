"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ValidEmoji } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { EMOJI_LIST } from "@/lib/constants";
import { motion } from "framer-motion";

interface EmojiReactionsProps {
  jokeId: string;
}

export function EmojiReactions({ jokeId }: EmojiReactionsProps) {
  const [loading, setLoading] = useState<ValidEmoji | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastClicked, setLastClicked] = useState<ValidEmoji | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  // Use centralized emoji list
  const emojis: ValidEmoji[] = EMOJI_LIST;

  useEffect(() => {
    const votedJokes = JSON.parse(localStorage.getItem('votedJokes') || '{}');
    setHasVoted(!!votedJokes[jokeId]);
  }, [jokeId]);

  const handleReaction = async (emoji: ValidEmoji) => {
    try {
      if (hasVoted) {
        setError("You've already voted for this joke - wait for the next one...");
        return;
      }

      setLoading(emoji);
      setError(null);
      
      console.log(`Processing reaction for joke ${jokeId} with emoji ${emoji}`);
      
      const supabase = createClient();
      
      // Check if a reaction with this emoji already exists for the joke
      const { data: existingReaction, error: fetchError } = await supabase
        .from('reactions')
        .select('*')
        .eq('joke_id', jokeId)
        .eq('emoji', emoji)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        console.error("Error fetching existing reaction:", fetchError);
        throw new Error(`Failed to check existing reaction: ${fetchError.message}`);
      }
      
      if (existingReaction) {
        console.log(`Updating existing reaction with ID ${existingReaction.id}`);
        // Update existing reaction count
        const { error: updateError } = await supabase
          .from('reactions')
          .update({
            reaction_count: existingReaction.reaction_count + 1
          })
          .eq('id', existingReaction.id);
          
        if (updateError) {
          console.error("Error updating reaction:", updateError);
          throw new Error(`Failed to update reaction: ${updateError.message}`);
        }
      } else {
        console.log(`Creating new reaction for joke ${jokeId} with emoji ${emoji}`);
        // Create new reaction with count 1
        const { error: insertError } = await supabase
          .from('reactions')
          .insert({
            joke_id: jokeId,
            emoji,
            reaction_count: 1
          });
          
        if (insertError) {
          console.error("Error inserting reaction:", insertError);
          throw new Error(`Failed to create reaction: ${insertError.message}`);
        }
      }

      // Save to localStorage that user has voted for this joke
      const votedJokes = JSON.parse(localStorage.getItem('votedJokes') || '{}');
      votedJokes[jokeId] = emoji;
      localStorage.setItem('votedJokes', JSON.stringify(votedJokes));
      
      // Update state to reflect that user has voted
      setHasVoted(true);

      console.log(`Successfully processed reaction for joke ${jokeId} with emoji ${emoji}`);
      setLastClicked(emoji);
      
      // Reset last clicked after animation duration
      setTimeout(() => {
        setLastClicked(null);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reaction");
      console.error("Error sending reaction:", err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      {error && (
        <motion.div
          className="w-full text-center text-sm text-destructive mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.div>
      )}
      
      {hasVoted && (
        <motion.div
          className="w-full text-center text-sm text-primary mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          You've already voted for this joke - wait for the next one...
        </motion.div>
      )}
      
      <div className="flex flex-wrap justify-center gap-2 md:gap-4">
        {emojis.map((emoji, index) => (
          <motion.div
            key={emoji}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index, duration: 0.3 }}
          >
            <Button
              variant="glossy"
              size="lg"
              animation="wiggle"
              className={`text-2xl md:text-3xl h-12 md:h-16 w-12 md:w-16 ${
                lastClicked === emoji ? "scale-125 bg-accent" : ""
              } ${hasVoted ? "opacity-50" : ""}`}
              disabled={loading !== null || hasVoted}
              onClick={() => handleReaction(emoji)}
            >
              {emoji}
              {loading === emoji && (
                <span className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md">
                  <motion.div
                    className="h-4 w-4 rounded-full border-2 border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </span>
              )}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}