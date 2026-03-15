import { useEffect, useState } from 'react'
import { useBrandStore } from '../../store/brandStore'
import './PremiumLoadingScreen.css'

interface PremiumLoadingScreenProps {
  onComplete?: () => void
  minDuration?: number
}

export function PremiumLoadingScreen({ 
  onComplete,
  minDuration = 2500 
}: PremiumLoadingScreenProps) {
  const { currentBrand } = useBrandStore()
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'complete' | 'exit'>('loading')
  
  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          return 100
        }
        return p + Math.random() * 15
      })
    }, 200)
    
    // Minimum duration
    const timer = setTimeout(() => {
      setPhase('complete')
      setTimeout(() => {
        setPhase('exit')
        setTimeout(() => onComplete?.(), 500)
      }, 800)
    }, minDuration)
    
    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [minDuration, onComplete])
  
  return (
    <div className={`premium-loading-screen phase-${phase}`}>
      {/* Background */}
      <div className="loading-background">
        <div className="bg-gradient" />
        <div className="bg-particles">
          {Array.from({ length: 30 }).map((_, i) => (
            <div 
              key={i} 
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        <div className="bg-vignette" />
      </div>
      
      {/* Content */}
      <div className="loading-content">
        {/* Logo */}
        <div className="loading-logo-container">
          <div className="logo-glow-ring" />
          <div className="logo-glow" />
          
          <div className="loading-logo-wrapper">
            {currentBrand.logos.primary.url && (
              <img 
                src={currentBrand.logos.primary.url} 
                alt="Logo"
                className="loading-logo-image"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fb = e.currentTarget.parentElement?.querySelector('.loading-logo-text');
                  if (fb) (fb as HTMLElement).style.display = 'flex';
                }}
              />
            )}
            
            <div 
              className="loading-logo-text"
              style={{ display: currentBrand.logos.primary.url ? 'none' : 'flex' }}
            >
              <span className="logo-sports">SPORTS</span>
              <span className="logo-arena">ARENA</span>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="loading-progress-container">
          <div className="progress-track">
            <div 
              className="progress-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
            <div className="progress-glow" style={{ left: `${Math.min(progress, 100)}%` }} />
          </div>
          <div className="progress-text">
            {phase === 'loading' && 'LOADING...'}
            {phase === 'complete' && 'READY!'}
          </div>
        </div>
        
        {/* Loading Tips */}
        <div className="loading-tip">
          <LoadingTip />
        </div>
      </div>
      
      {/* Stadium silhouette at bottom */}
      <div className="loading-stadium-silhouette" />
    </div>
  )
}

function LoadingTip() {
  const tips = [
    'Drag your paddle to control the puck',
    'First to 5 goals wins the match',
    'Challenge friends or play against AI',
    'Tournament mode supports up to 32 players',
    'Watch for the puck speed indicator'
  ]
  
  const [tip] = useState(() => tips[Math.floor(Math.random() * tips.length)])
  
  return (
    <p className="tip-text">
      <span className="tip-icon">💡</span>
      {tip}
    </p>
  )
}
