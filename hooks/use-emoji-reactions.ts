'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ValidEmoji } from '@/lib/types'

interface UseEmojiReactionsProps {
  jokeId: string
}

interface UseEmojiReactionsReturn {
  loading: ValidEmoji | null
  error: string | null
  lastClicked: ValidEmoji | null
  hasVoted: boolean
  handleReaction: (emoji: ValidEmoji) => Promise<void>
}

export function useEmojiReactions({ jokeId }: UseEmojiReactionsProps): UseEmojiReactionsReturn {
  const [loading, setLoading] = useState<ValidEmoji | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastClicked, setLastClicked] = useState<ValidEmoji | null>(null)
  const [hasVoted, setHasVoted] = useState<boolean>(false)

  useEffect(() => {
    const votedJokes = JSON.parse(localStorage.getItem('votedJokes') || '{}')
    setHasVoted(!!votedJokes[jokeId])
  }, [jokeId])

  const handleReaction = async (emoji: ValidEmoji) => {
    try {
      if (hasVoted) {
        setError("You've already voted for this joke - wait for the next one...")
        return
      }

      setLoading(emoji)
      setError(null)
      
      console.log(`Processing reaction for joke ${jokeId} with emoji ${emoji}`)
      
      const supabase = createClient()
      
      const { data: existingReaction, error: fetchError } = await supabase
        .from('reactions')
        .select('*')
        .eq('joke_id', jokeId)
        .eq('emoji', emoji)
        .single()
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error("Error fetching existing reaction:", fetchError)
        throw new Error(`Failed to check existing reaction: ${fetchError.message}`)
      }
      
      if (existingReaction) {
        console.log(`Updating existing reaction with ID ${existingReaction.id}`)
        const { error: updateError } = await supabase
          .from('reactions')
          .update({
            reaction_count: existingReaction.reaction_count + 1
          })
          .eq('id', existingReaction.id)
          
        if (updateError) {
          console.error("Error updating reaction:", updateError)
          throw new Error(`Failed to update reaction: ${updateError.message}`)
        }
      } else {
        console.log(`Creating new reaction for joke ${jokeId} with emoji ${emoji}`)
        const { error: insertError } = await supabase
          .from('reactions')
          .insert({
            joke_id: jokeId,
            emoji,
            reaction_count: 1
          })
          
        if (insertError) {
          console.error("Error inserting reaction:", insertError)
          throw new Error(`Failed to create reaction: ${insertError.message}`)
        }
      }

      const votedJokes = JSON.parse(localStorage.getItem('votedJokes') || '{}')
      votedJokes[jokeId] = emoji
      localStorage.setItem('votedJokes', JSON.stringify(votedJokes))
      
      setHasVoted(true)

      console.log(`Successfully processed reaction for joke ${jokeId} with emoji ${emoji}`)
      setLastClicked(emoji)
      
      setTimeout(() => {
        setLastClicked(null)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reaction")
      console.error("Error sending reaction:", err)
    } finally {
      setLoading(null)
    }
  }

  return {
    loading,
    error,
    lastClicked,
    hasVoted,
    handleReaction
  }
}