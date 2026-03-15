import { useEffect, useState, useRef } from 'react'
import './GameCountdown.css'

interface GameCountdownProps {
  onComplete: () => void
}

export function GameCountdown({ onComplete }: GameCountdownProps) {
  const [count, setCount] = useState(3)
  const [phase, setPhase] = useState<'counting' | 'go' | 'done'>('counting')

  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    // COUNTING PHASE: 3 → 2 → 1
    if (phase === 'counting') {
      if (count > 1) {
        const timer = setTimeout(() => {
          setCount(c => c - 1)
        }, 1000)
        return () => clearTimeout(timer)
      } else {
        // count === 1, after 1 second go to GO phase
        const timer = setTimeout(() => {
          setPhase('go')
        }, 1000)
        return () => clearTimeout(timer)
      }
    }
    
    // GO PHASE: Show "GO!" for 600ms then complete
    if (phase === 'go') {
      const timer = setTimeout(() => {
        console.log('Countdown: Calling onComplete NOW')
        setPhase('done')
        onCompleteRef.current()
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [count, phase])

  // DONE PHASE: Render nothing
  if (phase === 'done') {
    return null
  }

  return (
    <div className="game-countdown">
      <div className="countdown-backdrop" />
      <div className="countdown-content">
        {phase === 'counting' && (
          <div key={count} className="countdown-number">
            <span className="number-text">{count}</span>
            <div className="number-ring" />
            <div className="pulse-rings">
              <div className="pulse-ring" style={{ animationDelay: '0s' }} />
              <div className="pulse-ring" style={{ animationDelay: '0.33s' }} />
              <div className="pulse-ring" style={{ animationDelay: '0.66s' }} />
            </div>
          </div>
        )}
        {phase === 'go' && (
          <div className="countdown-go">
            <span className="go-text">GO!</span>
          </div>
        )}
      </div>
    </div>
  )
}
