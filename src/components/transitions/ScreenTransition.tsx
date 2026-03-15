import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import './ScreenTransition.css'

interface ScreenTransitionProps {
  children: ReactNode
  transitionKey: string
  type?: 'fade' | 'slide' | 'zoom' | 'wipe'
}

export function ScreenTransition({ 
  children, 
  transitionKey,
  type = 'fade'
}: ScreenTransitionProps) {
  const [displayKey, setDisplayKey] = useState(transitionKey)
  const [_isTransitioning, setIsTransitioning] = useState(false)
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter')
  
  useEffect(() => {
    if (transitionKey !== displayKey) {
      setIsTransitioning(true)
      setPhase('exit')
      
      const timer = setTimeout(() => {
        setDisplayKey(transitionKey)
        setPhase('enter')
        setTimeout(() => setIsTransitioning(false), 500)
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [transitionKey, displayKey])
  
  return (
    <div className={`screen-transition transition-${type} phase-${phase}`}>
      {children}
    </div>
  )
}
