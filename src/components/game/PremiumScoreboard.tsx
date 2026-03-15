import { useState, useEffect, useRef } from 'react'
import type { SportType } from '../../types/sportTheme.types'
import { getSportTheme } from '../../themes/sportThemes'
import { useGameStore } from '../../store/gameStore'
import './PremiumScoreboard.css'

interface PremiumScoreboardProps {
  player1Name: string
  player2Name: string
  score: { player1: number; player2: number }
  sport: SportType
  timeRemaining?: number // in seconds, optional
  period?: number
  isLive?: boolean
}

export function PremiumScoreboard({
  player1Name,
  player2Name,
  score,
  sport,
  timeRemaining,
  period = 1,
  isLive = true
}: PremiumScoreboardProps) {
  const theme = getSportTheme(sport)
  const gameMode = useGameStore(s => s.gameMode)
  const aiDifficulty = useGameStore(s => s.aiDifficulty)
  const [animatingScore, setAnimatingScore] = useState<'player1' | 'player2' | null>(null)
  const prevScoreRef = useRef(score)
  
  // Detect score changes for animation
  useEffect(() => {
    if (score.player1 > prevScoreRef.current.player1) {
      setAnimatingScore('player1')
      setTimeout(() => setAnimatingScore(null), 1000)
    } else if (score.player2 > prevScoreRef.current.player2) {
      setAnimatingScore('player2')
      setTimeout(() => setAnimatingScore(null), 1000)
    }
    prevScoreRef.current = score
  }, [score])
  
  // Determine player 2 display based on game mode
  const isVsAI = gameMode === 'vs-ai'
  
  const getAIDifficultyLabel = () => {
    switch (aiDifficulty) {
      case 'easy': return 'EASY AI'
      case 'medium': return 'MEDIUM AI'
      case 'hard': return 'HARD AI'
      case 'nightmare': return 'NIGHTMARE AI'
      default: return 'AI'
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  return (
    <div className="premium-scoreboard">
      {/* Main Container with 3D Effect */}
      <div className="scoreboard-container">
        
        {/* Background Glow */}
        <div className="scoreboard-glow" />
        
        {/* Metal Frame */}
        <div className="scoreboard-frame">
          
          {/* Live Indicator */}
          {isLive && (
            <div className="live-indicator">
              <span className="live-dot" />
              <span className="live-text">LIVE</span>
            </div>
          )}
          
          {/* Left Player Panel */}
          <div className="player-panel player-panel-left">
            <div className="team-color-bar team-home" />
            <div className="player-info">
              <div className="player-avatar">
                <div className="avatar-inner">👤</div>
              </div>
              <div className="player-name-container">
                <span className="player-label">PLAYER 1</span>
                <span className="player-name">{player1Name}</span>
              </div>
            </div>
            <div className={`score-display ${animatingScore === 'player1' ? 'score-pop' : ''}`}>
              <span className="score-value">{score.player1}</span>
              {animatingScore === 'player1' && (
                <div className="score-flash" />
              )}
            </div>
          </div>
          
          {/* Center Divider with Sport Icon */}
          <div className="center-section">
            <div className="sport-badge">
              <span className="sport-icon">{theme.icon}</span>
            </div>
            
            {/* Timer (if applicable) */}
            {timeRemaining !== undefined && (
              <div className="timer-section">
                <div className="period-indicator">
                  <span className="period-label">PERIOD</span>
                  <span className="period-value">{period}</span>
                </div>
                <div className="time-display">
                  <span className="time-value">{formatTime(timeRemaining)}</span>
                </div>
              </div>
            )}
            
            <div className="vs-badge">VS</div>
          </div>
          
          {/* Right Player Panel */}
          <div className="player-panel player-panel-right">
            <div className={`score-display ${animatingScore === 'player2' ? 'score-pop' : ''}`}>
              <span className="score-value">{score.player2}</span>
              {animatingScore === 'player2' && (
                <div className="score-flash" />
              )}
            </div>
            <div className="player-info">
              <div className="player-name-container align-right">
                <span className="player-label">
                  {isVsAI ? 'AI OPPONENT' : 'PLAYER 2'}
                </span>
                <span className="player-name">
                  {isVsAI ? getAIDifficultyLabel() : (player2Name || 'Player 2')}
                </span>
              </div>
              <div className={`player-avatar ${isVsAI ? 'ai' : 'human'}`}>
                <div className="avatar-inner">
                  {isVsAI ? '🤖' : '👤'}
                </div>
              </div>
            </div>
            <div className="team-color-bar team-away" />
          </div>
          
        </div>
        
        {/* Bottom Reflection */}
        <div className="scoreboard-reflection" />
        
      </div>
    </div>
  )
}
