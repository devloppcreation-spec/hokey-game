import { useEffect, useState } from 'react'
import './GoalCelebration.css'

interface GoalCelebrationProps {
  isActive: boolean
  scoringPlayer: 'player1' | 'player2'
  playerName: string
  onComplete?: () => void
}

export function GoalCelebration({
  isActive,
  scoringPlayer,
  playerName,
  onComplete
}: GoalCelebrationProps) {
  const [phase, setPhase] = useState<'flash' | 'text' | 'confetti' | 'done'>('flash')
  
  useEffect(() => {
    if (!isActive) {
      setPhase('flash')
      return
    }
    
    const t1 = setTimeout(() => setPhase('text'), 300)
    const t2 = setTimeout(() => setPhase('confetti'), 1000)
    const t3 = setTimeout(() => {
      setPhase('done')
      onComplete?.()
    }, 5000)
    
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [isActive, onComplete])
  
  if (!isActive) return null
  
  const teamColor = scoringPlayer === 'player1' ? 'var(--team-home)' : 'var(--team-away)'
  
  return (
    <div className={`goal-celebration celebration-${phase}`}>
      {/* Flash */}
      <div className="celebration-flash" />
      
      {/* Radial Burst */}
      <div className="celebration-burst">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="burst-ray" style={{ transform: `rotate(${i * 30}deg)` }} />
        ))}
      </div>
      
      {/* Goal Text */}
      <div className="celebration-text-container">
        <div className="goal-text"><span className="goal-word">GOAL!</span></div>
        <div className="scorer-name" style={{ color: teamColor }}>{playerName}</div>
      </div>
      
      {/* Confetti */}
      <div className="confetti-container">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${Math.random() * 100}%`,
              backgroundColor: i % 3 === 0 ? teamColor : i % 3 === 1 ? 'var(--premium-gold)' : 'white',
              animationDelay: `${Math.random() * 1}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              width: `${8 + Math.random() * 8}px`,
              height: `${8 + Math.random() * 16}px`
            }}
          />
        ))}
      </div>
      
      {/* Spotlights */}
      <div className="spotlight-container">
        <div className="spotlight spotlight-left" />
        <div className="spotlight spotlight-right" />
      </div>
    </div>
  )
}
