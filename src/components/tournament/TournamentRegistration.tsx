import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useTournamentStore } from '../../store/tournamentStore'
import type { TournamentPlayer } from '../../store/tournamentStore'
import './TournamentRegistration.css'

export function TournamentRegistration() {
  const [email, setEmail] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState('')
  const [showAIModal, setShowAIModal] = useState(false)
  
  const { setCurrentScreen } = useGameStore()
  const { tournament, addPlayer, removePlayer, fillWithAI, startTournament } = useTournamentStore()
  
  if (!tournament) {
    return <div>No tournament created</div>
  }
  
  const spotsRemaining = tournament.playerCount - tournament.players.length
  const canStartTournament = tournament.players.length === tournament.playerCount
  
  const handleAddPlayer = () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email')
      return
    }
    if (!playerName.trim()) {
      setError('Please enter a player name')
      return
    }
    if (!acceptedTerms) {
      setError('Please accept the Terms and Conditions')
      return
    }
    
    const newPlayer: TournamentPlayer = {
      id: `player-${Date.now()}`,
      name: playerName.trim(),
      email: email,
      isAI: false
    }
    
    addPlayer(newPlayer)
    setEmail('')
    setPlayerName('')
    setAcceptedTerms(false)
    setError('')
  }
  
  const handleFillWithAI = (difficulty: 'easy' | 'medium' | 'hard' | 'nightmare') => {
    fillWithAI(difficulty)
    setShowAIModal(false)
  }
  
  const handleStartTournament = () => {
    console.log('Starting tournament!') // Debug
    startTournament()
    setCurrentScreen('tournament-bracket')
  }
  
  return (
    <div className="tournament-registration">
      {/* Back Button */}
      <button 
        className="back-button"
        onClick={() => setCurrentScreen('tournament-setup')}
      >
        ← Back
      </button>
      
      {/* Header */}
      <div className="reg-header">
        <h1>🏆 Player Registration</h1>
        <p>{tournament.playerCount} Player Tournament</p>
        <div className="spots-counter">
          <span className="spots-filled">{tournament.players.length}</span>
          <span className="spots-divider">/</span>
          <span className="spots-total">{tournament.playerCount}</span>
          <span className="spots-label">Players Registered</span>
        </div>
      </div>
      
      <div className="reg-content">
        {/* Left: Registration Form */}
        <div className="reg-form-section">
          {spotsRemaining > 0 ? (
            <div className="reg-form-card">
              <h2>Add Player #{tournament.players.length + 1}</h2>
              
              <input
                type="text"
                placeholder="Player Name"
                value={playerName}
                onChange={(e) => { setPlayerName(e.target.value); setError('') }}
                className="reg-input"
              />
              
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                className="reg-input"
              />
              
              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => { setAcceptedTerms(e.target.checked); setError('') }}
                />
                <span>I accept the <a href="#">Terms and Conditions</a></span>
              </label>
              
              {error && <p className="error-message">{error}</p>}
              
              <button className="add-player-btn" onClick={handleAddPlayer}>
                ➕ Add Player
              </button>
              
              {/* Fill with AI option */}
              {spotsRemaining > 0 && tournament.players.length > 0 && (
                <button 
                  className="fill-ai-btn"
                  onClick={() => setShowAIModal(true)}
                >
                  🤖 Fill {spotsRemaining} Remaining Spots with AI
                </button>
              )}
            </div>
          ) : (
            <div className="all-registered">
              <span className="check-icon">✅</span>
              <h2>All Players Registered!</h2>
              <p>Ready to start the tournament</p>
            </div>
          )}
        </div>
        
        {/* Right: Player List */}
        <div className="player-list-section">
          <h2>Registered Players</h2>
          
          <div className="player-list">
            {tournament.players.length === 0 ? (
              <div className="empty-list">
                <span>👥</span>
                <p>No players registered yet</p>
              </div>
            ) : (
              tournament.players.map((player, index) => (
                <div key={player.id} className={`player-item ${player.isAI ? 'ai-player' : ''}`}>
                  <span className="player-number">#{index + 1}</span>
                  <div className="player-info">
                    <span className="player-name">
                      {player.isAI ? '🤖' : '👤'} {player.name}
                    </span>
                    {player.isAI && (
                      <span className="ai-badge">{player.aiDifficulty} AI</span>
                    )}
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removePlayer(player.id)}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
            
            {/* Empty slots */}
            {Array.from({ length: spotsRemaining }).map((_, i) => (
              <div key={`empty-${i}`} className="player-item empty-slot">
                <span className="player-number">#{tournament.players.length + i + 1}</span>
                <span className="empty-text">Empty Slot</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Start Tournament Button */}
      {canStartTournament && (
        <button 
          className="start-btn" 
          onClick={handleStartTournament}
          type="button"
        >
          🏆 Start Tournament!
        </button>
      )}
      
      {/* AI Difficulty Modal */}
      {showAIModal && (
        <div className="ai-modal-overlay" onClick={() => setShowAIModal(false)}>
          <div className="ai-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Select AI Difficulty</h2>
            <p>All {spotsRemaining} AI players will use this difficulty</p>
            
            <div className="ai-difficulty-grid">
              <button onClick={() => handleFillWithAI('easy')} className="diff-btn easy">
                <span>😊</span> Easy
              </button>
              <button onClick={() => handleFillWithAI('medium')} className="diff-btn medium">
                <span>😐</span> Medium
              </button>
              <button onClick={() => handleFillWithAI('hard')} className="diff-btn hard">
                <span>😤</span> Hard
              </button>
              <button onClick={() => handleFillWithAI('nightmare')} className="diff-btn nightmare">
                <span>💀</span> Nightmare
              </button>
            </div>
            
            <button className="cancel-btn" onClick={() => setShowAIModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
