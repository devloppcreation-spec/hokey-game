import { useState, useCallback, useMemo } from 'react'

export function useGameEffects() {
  const [showGoalCelebration, setShowGoalCelebration] = useState(false)
  const [goalScorer, setGoalScorer] = useState<{ player: 'player1' | 'player2'; name: string } | null>(null)
  const [shakeTrigger, setShakeTrigger] = useState(0)
  const [showCountdown, setShowCountdown] = useState(false)
  
  const triggerGoal = useCallback((player: 'player1' | 'player2', name: string) => {
    setGoalScorer({ player, name })
    setShowGoalCelebration(true)
    setShakeTrigger(t => t + 1)
  }, [])
  
  const clearGoal = useCallback(() => {
    setShowGoalCelebration(false)
    setGoalScorer(null)
  }, [])
  
  const triggerShake = useCallback((_intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
    setShakeTrigger(t => t + 1)
  }, [])
  
  const startCountdown = useCallback(() => {
    setShowCountdown(true)
  }, [])
  
  const endCountdown = useCallback(() => {
    setShowCountdown(false)
  }, [])
  
  return useMemo(() => ({
    showGoalCelebration,
    goalScorer,
    shakeTrigger,
    showCountdown,
    triggerGoal,
    clearGoal,
    triggerShake,
    startCountdown,
    endCountdown
  }), [
    showGoalCelebration,
    goalScorer,
    shakeTrigger,
    showCountdown,
    triggerGoal,
    clearGoal,
    triggerShake,
    startCountdown,
    endCountdown
  ])
}
