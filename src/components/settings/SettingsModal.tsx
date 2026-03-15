import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import './SettingsModal.css'

interface SettingsModalProps {
  onClose: () => void
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { scoreToWin, setScoreToWin, matchDuration, setMatchDuration } = useGameStore()
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [volume, setVolume] = useState(80)
  const [showEffects, setShowEffects] = useState(true)
  const [timedMatch, setTimedMatch] = useState(matchDuration !== null)

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="settings-header">
          <h2 className="settings-title">⚙️ Settings</h2>
          <button className="settings-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="settings-content">

          {/* Game Settings */}
          <section className="settings-section">
            <h3 className="section-title">Game</h3>

            <div className="setting-row">
              <label className="setting-label">Score to Win</label>
              <div className="score-selector">
                {[3, 5, 7, 10].map(score => (
                  <button 
                    key={score}
                    className={`score-btn-select ${scoreToWin === score ? 'active' : ''}`}
                    onClick={() => setScoreToWin(score)}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-row">
              <label className="setting-label">Timed Match</label>
              <ToggleSwitch 
                checked={timedMatch} 
                onChange={(enabled) => {
                  setTimedMatch(enabled);
                  if (!enabled) setMatchDuration(null);
                  else if (matchDuration === null) setMatchDuration(180);
                }} 
              />
            </div>

            {timedMatch && (
              <div className="setting-row">
                <label className="setting-label">Match Duration</label>
                <select 
                  className="duration-select"
                  value={matchDuration || 180} 
                  onChange={(e) => setMatchDuration(Number(e.target.value))}
                >
                  <option value="60">1 Minute</option>
                  <option value="120">2 Minutes</option>
                  <option value="180">3 Minutes</option>
                  <option value="300">5 Minutes</option>
                </select>
              </div>
            )}

            <div className="setting-row">
              <label className="setting-label">Visual Effects</label>
              <ToggleSwitch checked={showEffects} onChange={setShowEffects} />
            </div>
          </section>

          {/* Audio Settings */}
          <section className="settings-section">
            <h3 className="section-title">Audio</h3>

            <div className="setting-row">
              <label className="setting-label">Sound Effects</label>
              <ToggleSwitch checked={soundEnabled} onChange={setSoundEnabled} />
            </div>

            <div className="setting-row">
              <label className="setting-label">Music</label>
              <ToggleSwitch checked={musicEnabled} onChange={setMusicEnabled} />
            </div>

            <div className="setting-row">
              <label className="setting-label">Volume</label>
              <div className="volume-control">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="volume-slider"
                />
                <span className="volume-value">{volume}%</span>
              </div>
            </div>
          </section>

          {/* About */}
          <section className="settings-section">
            <h3 className="section-title">About</h3>
            <p className="about-text">
              Sports Arena v1.0.0<br />
              © 2024 Sports Arena
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="settings-footer">
          <button className="settings-done-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

// Toggle Switch Component
function ToggleSwitch({ checked, onChange }: {
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      className={`toggle-switch ${checked ? 'on' : 'off'}`}
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
    >
      <span className="toggle-knob" />
    </button>
  )
}
