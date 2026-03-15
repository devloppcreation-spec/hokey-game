import { useState, useCallback, useEffect } from 'react'

type IntensityLevel = 'calm' | 'normal' | 'excited' | 'goal'

export function useStadiumAtmosphere() {
  const [intensity, setIntensity] = useState<IntensityLevel>('normal')
  const [autoReset, setAutoReset] = useState<ReturnType<typeof setTimeout> | null>(null)
  
  const triggerGoal = useCallback(() => {
    setIntensity('goal')
    
    // Auto-reset after celebration
    if (autoReset) clearTimeout(autoReset)
    const timeout = setTimeout(() => {
      setIntensity('excited')
      setTimeout(() => setIntensity('normal'), 3000)
    }, 5000)
    setAutoReset(timeout)
  }, [autoReset])
  
  const triggerExcitement = useCallback(() => {
    setIntensity('excited')
    
    if (autoReset) clearTimeout(autoReset)
    const timeout = setTimeout(() => {
      setIntensity('normal')
    }, 3000)
    setAutoReset(timeout)
  }, [autoReset])
  
  const setCalm = useCallback(() => {
    setIntensity('calm')
  }, [])
  
  const setNormal = useCallback(() => {
    setIntensity('normal')
  }, [])
  
  useEffect(() => {
    return () => {
      if (autoReset) clearTimeout(autoReset)
    }
  }, [autoReset])
  
  return {
    intensity,
    triggerGoal,
    triggerExcitement,
    setCalm,
    setNormal
  }
}
