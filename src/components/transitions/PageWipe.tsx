import { useEffect, useState } from 'react'
import './PageWipe.css'

interface PageWipeProps {
  isActive: boolean
  onComplete?: () => void
  color?: string
}

export function PageWipe({ isActive, onComplete, color }: PageWipeProps) {
  const [phase, setPhase] = useState<'idle' | 'wipe-in' | 'hold' | 'wipe-out'>('idle')
  
  useEffect(() => {
    if (isActive) {
      setPhase('wipe-in')
      setTimeout(() => setPhase('hold'), 400)
      setTimeout(() => {
        setPhase('wipe-out')
        setTimeout(() => {
          setPhase('idle')
          onComplete?.()
        }, 400)
      }, 600)
    }
  }, [isActive, onComplete])
  
  if (phase === 'idle') return null
  
  return (
    <div 
      className={`page-wipe phase-${phase}`}
      style={{ '--wipe-color': color || 'var(--premium-gold)' } as React.CSSProperties}
    >
      <div className="wipe-panel wipe-1" />
      <div className="wipe-panel wipe-2" />
      <div className="wipe-panel wipe-3" />
    </div>
  )
}
