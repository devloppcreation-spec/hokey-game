import { useGameStore } from '@/store/gameStore'
import type { AIDifficulty } from '@/types/gameMode.types'
import './DifficultySelection.css'

const DIFFICULTIES: {
  id: AIDifficulty
  name: string
  icon: string
  color: string
  description: string
}[] = [
  { id: 'easy', name: 'EASY', icon: '😊', color: '#00D68F', description: 'Relaxed gameplay' },
  { id: 'medium', name: 'MEDIUM', icon: '😐', color: '#FFAA00', description: 'Balanced challenge' },
  { id: 'hard', name: 'HARD', icon: '😤', color: '#FF6B00', description: 'Serious competition' },
  { id: 'nightmare', name: 'NIGHTMARE', icon: '💀', color: '#FF3D71', description: 'Near impossible' },
]

export function DifficultySelection() {
  const { setAIDifficulty, setCurrentScreen } = useGameStore()

  const handleSelect = (difficulty: AIDifficulty) => {
    setAIDifficulty(difficulty)
    setCurrentScreen('signin')
  }

  return (
    <div className="difficulty-screen">
      <button
        className="difficulty-back-button premium-3d-button"
        onClick={() => setCurrentScreen('mode-select')}
      >
        ← Back
      </button>

      <div className="difficulty-content">
        <h1 className="difficulty-title premium-gold-text">SELECT DIFFICULTY</h1>
        <p className="difficulty-subtitle">Choose your AI opponent's skill level</p>

        <div className="difficulty-grid">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff.id}
              className="difficulty-card"
              onClick={() => handleSelect(diff.id)}
              style={{ '--diff-color': diff.color } as React.CSSProperties}
            >
              <div className="diff-card-glow" />
              <span className="diff-icon">{diff.icon}</span>
              <span className="diff-name">{diff.name}</span>
              <span className="diff-desc">{diff.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
