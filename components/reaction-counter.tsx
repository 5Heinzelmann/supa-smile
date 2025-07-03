"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Reaction, ValidEmoji } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

interface ReactionCounterProps {
  jokeId: string;
  initialReactions?: Reaction[];
}

export function ReactionCounter({ jokeId, initialReactions = [] }: ReactionCounterProps) {
  const [reactions, setReactions] = useState<Record<ValidEmoji, number>>({
    "😂": 0,
    "🙃": 0,
    "😐": 0,
    "😤": 0,
    "😮": 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentlyUpdated, setRecentlyUpdated] = useState<ValidEmoji | null>(null);

  useEffect(() => {
    // Initialize with any provided initial reactions
    if (initialReactions.length > 0) {
      const initialCounts = { ...reactions };
      initialReactions.forEach((reaction) => {
        initialCounts[reaction.emoji as ValidEmoji] = reaction.reaction_count;
      });
      setReactions(initialCounts);
      setLoading(false);
    } else {
      // Fetch reactions if not provided
      fetchReactions();
    }

    // Set up Supabase realtime subscription
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
          setReactions((prev) => ({
            ...prev,
            [updatedReaction.emoji as ValidEmoji]: updatedReaction.reaction_count,
          }));
          
          // Highlight the updated reaction
          setRecentlyUpdated(updatedReaction.emoji as ValidEmoji);
          setTimeout(() => setRecentlyUpdated(null), 1000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jokeId, initialReactions]);

  const fetchReactions = async () => {
    try {
      setLoading(true);
      
      const supabase = createClient();
      const { data: reactionData, error: fetchError } = await supabase
        .from('reactions')
        .select('*')
        .eq('joke_id', jokeId);
      
      if (fetchError) {
        throw fetchError;
      }
      
      const counts = { ...reactions };
      if (reactionData) {
        reactionData.forEach((reaction) => {
          counts[reaction.emoji as ValidEmoji] = reaction.reaction_count;
        });
      }
      
      setReactions(counts);
      setError(null);
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

  const emojis: ValidEmoji[] = ["😂", "🙃", "😐", "😤", "😮"];

  if (loading) {
    return (
      <Card className="w-full">
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
      <Card className="w-full border-destructive">
        <CardContent className="pt-6">
          <div className="text-center text-destructive">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-3">
          {emojis.map((emoji) => (
            <div key={emoji} className="flex items-center gap-2">
              <span className="text-xl w-8">{emoji}</span>
              <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full bg-primary transition-all duration-500 ${
                    recentlyUpdated === emoji ? "animate-pulse" : ""
                  }`}
                  style={{ width: `${getPercentage(reactions[emoji])}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium w-8 text-right">
                {reactions[emoji]}
              </span>
            </div>
          ))}
          <div className="text-sm text-muted-foreground text-right pt-2">
            Total: {totalReactions}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}