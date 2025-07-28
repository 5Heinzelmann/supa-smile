"use client";

import { Button } from "@/components/ui/button";
import { ValidEmoji } from "@/lib/types";
import { motion } from "framer-motion";

interface EmojiButtonProps {
  emoji: ValidEmoji;
  loading: ValidEmoji | null;
  hasVoted: boolean;
  lastClicked: ValidEmoji | null;
  onClick: (emoji: ValidEmoji) => void;
}

export function EmojiButton({
  emoji,
  loading,
  hasVoted,
  lastClicked,
  onClick,
}: EmojiButtonProps) {
  return (
    <Button
      variant="glossy"
      size="lg"
      animation="wiggle"
      className={`text-2xl md:text-3xl h-12 md:h-16 w-12 md:w-16 ${
        lastClicked === emoji ? "scale-125 bg-accent" : ""
      } ${hasVoted ? "opacity-50" : ""}`}
      disabled={loading !== null || hasVoted}
      onClick={() => onClick(emoji)}
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
  );
}