"use client";

import { motion } from "framer-motion";

interface ReactionMessageProps {
  error: string | null;
  hasVoted: boolean;
}

export function ReactionMessage({ error, hasVoted }: ReactionMessageProps) {
  if (!error && !hasVoted) {
    return null;
  }

  return (
    <>
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
          Thanks for voting! Just wait for the next one...
        </motion.div>
      )}
    </>
  );
}