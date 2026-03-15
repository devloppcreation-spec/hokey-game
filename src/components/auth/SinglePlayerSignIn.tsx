import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useUserStore } from '../../store/userStore'
import './SinglePlayerSignIn.css'

export function SinglePlayerSignIn() {
  const [playerName, setPlayerName] = useState('')
  const [email, setEmail] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState('')
  
  // Get store actions
  const { aiDifficulty, goBack, setPlayer1Ready } = useGameStore()
  const { setPlayer1 } = useUserStore()
  
  // Handle "Ready to Play" click
  const handleReadyToPlay = () => {
    console.log('Ready to Play clicked!') // Debug
    
    // Validate
    if (!playerName.trim()) {
      setError('Please enter your name')
      return
    }

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email')
      return
    }
    
    if (!acceptedTerms) {
      setError('Please accept the Terms and Conditions')
      return
    }
    
    // Clear error
    setError('')
    
    // Save player info
    setPlayer1({
      email: email,
      displayName: playerName, 
      playerNumber: 1
    })
    
    // Set player ready - this will trigger startGame in the store
    console.log('Setting player 1 ready...') // Debug
    setPlayer1Ready(true)
  }
  
  // Handle back button
  const handleBack = () => {
    console.log('Back clicked!') // Debug
    goBack()
  }
  
  // Get difficulty display info
  const getDifficultyInfo = () => {
    switch (aiDifficulty) {
      case 'easy': return { emoji: '😊', name: 'Easy', color: '#00D68F' }
      case 'medium': return { emoji: '😐', name: 'Medium', color: '#FFAA00' }
      case 'hard': return { emoji: '😤', name: 'Hard', color: '#FF6B00' }
      case 'nightmare': return { emoji: '💀', name: 'Nightmare', color: '#FF3D71' }
      default: return { emoji: '🤖', name: 'AI', color: '#FFD700' }
    }
  }
  
  const diffInfo = getDifficultyInfo()
  
  return (
    <div className="single-signin-screen">
      {/* Back Button - MUST WORK */}
      <button className="back-button" onClick={handleBack}>
        ← Back
      </button>
      
      {/* Title */}
      <h1 className="signin-title">
        🏒 Enter Your Details to Play
      </h1>
      
      {/* VS Display */}
      <div className="vs-display">
        <div className="vs-player">
          <div className="player-avatar player-1-avatar">
            👤
          </div>
          <span className="player-label">YOU</span>
        </div>
        
        <span className="vs-text">VS</span>
        
        <div className="vs-player">
          <div 
            className="player-avatar ai-avatar"
            style={{ backgroundColor: diffInfo.color }}
          >
            🤖
          </div>
          <span className="player-label">{diffInfo.name} AI</span>
        </div>
      </div>
      
      {/* Sign In Card */}
      <div className="signin-card">
        <div className="card-header">
          <div className="player-icon blue-icon"></div>
          <h2>Player 1</h2>
          <p>Enter your email to play</p>
        </div>
        
        <div className="card-content">
          <input
            type="text"
            placeholder="Your Name"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value)
              setError('')
            }}
            className="email-input"
            style={{ marginBottom: '15px' }}
          />
          <input
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            className="email-input"
          />
          
          <label className="terms-checkbox">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => {
                setAcceptedTerms(e.target.checked)
                setError('')
              }}
            />
            <span>I accept the <a href="#" className="terms-link">Terms and Conditions</a></span>
          </label>
          
          {error && <p className="error-message">{error}</p>}
          
          {/* READY BUTTON - MUST WORK */}
          <button 
            className="ready-button"
            onClick={handleReadyToPlay}
            type="button"
          >
            Ready to Play! 🎮
          </button>
        </div>
      </div>
    </div>
  )
}
