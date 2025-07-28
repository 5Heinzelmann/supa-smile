"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reaction, ValidEmoji } from "@/lib/types";
import { EMOJI_REACTIONS, EMOJI_LIST } from "@/lib/constants";
import { subscribeToJokeReactions, fetchJokeReactions } from "@/lib/supabase/realtime";
import { motion, AnimatePresence } from "framer-motion";

interface ReactionCounterProps {
  jokeId: string;
  initialReactions?: Reaction[];
}

export function ReactionCounter({ jokeId, initialReactions = [] }: ReactionCounterProps) {
  // Initialize reactions state using centralized emoji constants
  const [reactions, setReactions] = useState<Record<ValidEmoji, number>>({
    [EMOJI_REACTIONS.LAUGHING]: 0,
    [EMOJI_REACTIONS.SMIRKING]: 0,
    [EMOJI_REACTIONS.NEUTRAL]: 0,
    [EMOJI_REACTIONS.ANNOYED]: 0,
    [EMOJI_REACTIONS.SURPRISED]: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentlyUpdated, setRecentlyUpdated] = useState<ValidEmoji | null>(null);

  // Add a ref to track if initialReactions has changed
  const prevInitialReactionsRef = useRef<Reaction[]>([]);
  
  // Compare two arrays of reactions to see if they're different
  const haveReactionsChanged = (prev: Reaction[], current: Reaction[]) => {
    if (prev.length !== current.length) return true;
    
    // Create maps of emoji -> count for easier comparison
    const prevMap = new Map(prev.map(r => [r.emoji, r.reaction_count]));
    const currentMap = new Map(current.map(r => [r.emoji, r.reaction_count]));
    
    // Check if any emoji has a different count
    for (const [emoji, count] of currentMap.entries()) {
      if (prevMap.get(emoji) !== count) return true;
    }
    
    return false;
  };
  
  useEffect(() => {
    console.log('ReactionCounter useEffect triggered', { jokeId, initialReactions });
    
    const reactionsChanged = haveReactionsChanged(prevInitialReactionsRef.current, initialReactions);
    console.log('Have reactions changed?', reactionsChanged);
    
    // Update the ref with current initialReactions
    prevInitialReactionsRef.current = [...initialReactions];
    
    // Initialize with any provided initial reactions
    if (initialReactions.length > 0) {
      console.log('Initializing with provided reactions:', initialReactions);
      const initialCounts = {
        [EMOJI_REACTIONS.LAUGHING]: 0,
        [EMOJI_REACTIONS.SMIRKING]: 0,
        [EMOJI_REACTIONS.NEUTRAL]: 0,
        [EMOJI_REACTIONS.ANNOYED]: 0,
        [EMOJI_REACTIONS.SURPRISED]: 0,
      };
      initialReactions.forEach((reaction) => {
        initialCounts[reaction.emoji as ValidEmoji] = reaction.reaction_count;
      });
      console.log('Setting initial counts:', initialCounts);
      setReactions(initialCounts);
      setLoading(false);
    } else {
      console.log('No initial reactions provided, fetching reactions');
      // Fetch reactions if not provided
      fetchReactions();
    }

    // Set up Supabase realtime subscription for reactions
    const { unsubscribe } = subscribeToJokeReactions(jokeId, (updatedReaction) => {
      console.log('Reaction update received:', updatedReaction);
      setReactions((prev) => ({
        ...prev,
        [updatedReaction.emoji as ValidEmoji]: updatedReaction.reaction_count,
      }));
      
      // Highlight the updated reaction
      setRecentlyUpdated(updatedReaction.emoji as ValidEmoji);
      setTimeout(() => setRecentlyUpdated(null), 1000);
    });

    return () => {
      unsubscribe();
    };
  }, [jokeId, initialReactions]);

  const fetchReactions = async () => {
    try {
      setLoading(true);
      
      const counts = await fetchJokeReactions(jokeId);
      
      if (counts) {
        setReactions(counts);
        setError(null);
      } else {
        throw new Error("Failed to load reactions");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reactions");
      console.error("Error fetching reactions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get total reactions
  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);

  // Calculate percentage for each emoji
  const getPercentage = (count: number) => {
    if (totalReactions === 0) return 0;
    return (count / totalReactions) * 100;
  };

  // Use centralized emoji list
  const emojis: ValidEmoji[] = EMOJI_LIST;

  if (loading) {
    return (
      <Card variant="glossy" animation="pulse" className="w-full">
        <CardContent className="pt-6">
          <div className="space-y-2">
            {emojis.map((emoji) => (
              <div key={emoji} className="flex items-center gap-2">
                <span className="text-xl w-8">{emoji}</span>
                <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="glossy" className="w-full border-destructive">
        <CardContent className="pt-6">
          <div className="text-center text-destructive">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card variant="glossyPrimary" className="w-full">
        <CardContent className="pt-6">
          <div className="space-y-3">
            {emojis.map((emoji, index) => (
              <motion.div
                key={emoji}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
              >
                <span className="text-xl w-8">{emoji}</span>
                <div className="flex-1 h-6 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-white/90 transition-all duration-500 ${
                      recentlyUpdated === emoji ? "animate-pulse-custom" : ""
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${getPercentage(reactions[emoji])}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + (0.1 * index) }}
                  />
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={reactions[emoji]}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Badge
                      variant={recentlyUpdated === emoji ? "glossy" : "default"}
                      animation={recentlyUpdated === emoji ? "pulse" : "none"}
                      className="w-8 justify-center"
                    >
                      {reactions[emoji]}
                    </Badge>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            ))}
            <motion.div
              className="text-sm font-medium text-right pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Badge variant="glossy" animation="float">
                Total: {totalReactions}
              </Badge>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}