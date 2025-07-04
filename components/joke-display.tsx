"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Joke, JokeWithReactions } from "@/lib/types";
import { motion } from "framer-motion";

interface JokeDisplayProps {
  joke?: JokeWithReactions | Joke;
  isLoading?: boolean;
}

export function JokeDisplay({ joke, isLoading }: JokeDisplayProps) {
  if (isLoading) {
    return (
      <Card variant="glossy" animation="pulse" className="w-full">
        <CardHeader>
          <CardTitle className="text-center">Loading joke...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center">
            <div className="animate-pulse h-4 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!joke) {
    return (
      <Card variant="glossy" className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-center text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-destructive">No joke available</div>
          <motion.button
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Retry
          </motion.button>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card variant="glossyPrimary" className="w-full">
        <CardContent>
          <motion.div
            className="text-xl text-center p-6 min-h-24 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {joke.text || "No joke available"}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}