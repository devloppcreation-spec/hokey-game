import React from 'react';
import './GameModeCard.css';

export interface GameMode {
  id: string;
  title: string;
  description: string;
  icon: string;
  colorAccent: string;
}

export interface GameModeCardProps {
  mode: GameMode;
  onSelect: () => void;
  index: number;
}

export const GameModeCard: React.FC<GameModeCardProps> = ({ mode, onSelect, index }) => {
  return (
    <div 
      className="game-mode-card" 
      onClick={onSelect}
      style={{ 
        animationDelay: `${index * 150}ms`,
        '--card-accent': mode.colorAccent
      } as React.CSSProperties}
    >
      <div className="mode-glass-panel">
        <div className="mode-shine-sweep"></div>
        
        <div className="mode-icon" style={{ color: mode.colorAccent, textShadow: `0 0 20px ${mode.colorAccent}` }}>
          {mode.icon}
        </div>
        
        <div className="mode-content">
          <h3 className="mode-title">{mode.title}</h3>
          <p className="mode-desc">{mode.description}</p>
        </div>
        
        <div className="mode-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
        
        <div className="mode-glow-bottom"></div>
      </div>
    </div>
  );
};
