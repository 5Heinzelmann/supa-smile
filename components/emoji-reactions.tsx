'use client'

import { EmojiButton } from './emoji-button'
import { ReactionMessage } from './reaction-message'
import { useEmojiReactions } from '@/hooks/use-emoji-reactions'
import { EMOJI_LIST } from '@/lib/constants'
import { motion } from 'framer-motion'

interface EmojiReactionsProps {
  jokeId: string
}

export function EmojiReactions({ jokeId }: EmojiReactionsProps) {
  const {
    loading,
    error,
    lastClicked,
    hasVoted,
    handleReaction
  } = useEmojiReactions({ jokeId })

  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <ReactionMessage error={error} hasVoted={hasVoted} />
      
      <div className="flex flex-wrap justify-center gap-2 md:gap-4">
        {EMOJI_LIST.map((emoji, index) => (
          <motion.div
            key={emoji}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index, duration: 0.3 }}
          >
            <EmojiButton
              emoji={emoji}
              loading={loading}
              hasVoted={hasVoted}
              lastClicked={lastClicked}
              onClick={handleReaction}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}