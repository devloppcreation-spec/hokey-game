import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useTournamentStore } from '../../store/tournamentStore'
import './TournamentSetup.css'

export function TournamentSetup() {
  const [selectedCount, setSelectedCount] = useState<4 | 8 | 16 | 32>(8)
  const { setCurrentScreen } = useGameStore()
  const { createTournament } = useTournamentStore()
  
  const playerOptions = [
    { count: 4, label: '4 Players', rounds: 2, icon: '👥' },
    { count: 8, label: '8 Players', rounds: 3, icon: '👥👥' },
    { count: 16, label: '16 Players', rounds: 4, icon: '👥👥👥' },
    { count: 32, label: '32 Players', rounds: 5, icon: '👥👥👥👥' }
  ]
  
  const handleStart = () => {
    createTournament(selectedCount)
    setCurrentScreen('tournament-registration')
  }
  
  return (
    <div className="tournament-setup">
      {/* Back Button */}
      <button 
        className="back-button"
        onClick={() => setCurrentScreen('mode-select')}
      >
        ← Back
      </button>
      
      {/* Title */}
      <div className="setup-header">
        <span className="trophy-icon">🏆</span>
        <h1>Tournament Setup</h1>
        <p>Select the number of players for your championship</p>
      </div>
      
      {/* Player Count Selection */}
      <div className="player-count-grid">
        {playerOptions.map((option) => (
          <button
            key={option.count}
            className={`count-card ${selectedCount === option.count ? 'selected' : ''}`}
            onClick={() => setSelectedCount(option.count as 4 | 8 | 16 | 32)}
          >
            <div className="count-number">{option.count}</div>
            <div className="count-label">Players</div>
            <div className="count-rounds">{option.rounds} Rounds</div>
            {selectedCount === option.count && (
              <div className="selected-check">✓</div>
            )}
          </button>
        ))}
      </div>
      
      {/* Tournament Info */}
      <div className="tournament-info">
        <div className="info-item">
          <span className="info-icon">🎮</span>
          <span className="info-text">{selectedCount / 2} First Round Matches</span>
        </div>
        <div className="info-item">
          <span className="info-icon">🤖</span>
          <span className="info-text">AI can fill empty spots</span>
        </div>
        <div className="info-item">
          <span className="info-icon">🏅</span>
          <span className="info-text">Single Elimination</span>
        </div>
      </div>
      
      {/* Start Button */}
      <button className="start-tournament-btn" onClick={handleStart}>
        Continue to Registration →
      </button>
    </div>
  )
}
