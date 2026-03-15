/**
 * PremiumMainMenu Component
 *
 * Two-step flow: Choose Sport → Choose Game Mode.
 * Uses premium UI components (SportSelector3D, GameModeCard).
 * Drives navigation via gameStore.
 */

import React, { useState } from 'react';
import './PremiumMainMenu.css';
import { SportSelector3D } from './SportSelector3D';
import { GameModeCard } from './GameModeCard';
import { useGameStore } from '@/store/gameStore';
import type { GameMode as GameModeType } from '@/types/gameMode.types';

const SPORTS: any[] = [
  {
    id: 'hockey',
    name: 'AIR HOCKEY',
    icon: '🏒',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)',
    accentColor: '#64b5f6',
    description: 'Fast-paced table action'
  },
  {
    id: 'soccer',
    name: 'SOCCER',
    icon: '⚽',
    gradient: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
    accentColor: '#81c784',
    description: 'Beautiful game'
  },
  {
    id: 'basketball',
    name: 'BASKETBALL',
    icon: '🏀',
    gradient: 'linear-gradient(135deg, #e65100 0%, #bf360c 100%)',
    accentColor: '#ffb74d',
    description: 'Slam dunk action'
  },
  {
    id: 'tennis',
    name: 'TENNIS',
    icon: '🎾',
    gradient: 'linear-gradient(135deg, #558b2f 0%, #33691e 100%)',
    accentColor: '#aed581',
    description: 'Court showdown'
  },
  {
    id: 'volleyball',
    name: 'VOLLEYBALL',
    icon: '🏐',
    gradient: 'linear-gradient(135deg, #f9a825 0%, #f57f17 100%)',
    accentColor: '#fff176',
    description: 'Beach vibes'
  }
];

interface GameModeDisplay {
  id: string;
  title: string;
  description: string;
  icon: string;
  colorAccent: string;
}

const GAME_MODES: GameModeDisplay[] = [
  {
    id: '1v1',
    title: '1 VS 1',
    description: 'Challenge a friend on the same table',
    icon: '👥',
    colorAccent: '#0095FF'
  },
  {
    id: 'vs-ai',
    title: 'VS COMPUTER',
    description: 'Test your skills against AI',
    icon: '🤖',
    colorAccent: '#FFD700'
  },
  {
    id: 'tournament',
    title: 'TOURNAMENT',
    description: 'Compete in bracket-style championship',
    icon: '🏆',
    colorAccent: '#00D68F'
  }
];

export interface PremiumMainMenuProps {
  /** The current step to show ('sport' for sport selection, 'mode' for mode selection). */
  initialStep?: 'sport' | 'mode';
}

export const PremiumMainMenu: React.FC<PremiumMainMenuProps> = ({ initialStep = 'sport' }) => {
  const [step, setStep] = useState<'sport' | 'mode'>(initialStep);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const { selectSport, selectGameMode, currentSport } = useGameStore();

  const handleSportSelect = (id: string) => {
    setSelectedSport(id);
    // Small delay to show selection state before navigation
    setTimeout(() => {
      selectSport(id as any);
    }, 500);
  };

  const handleModeSelect = (modeId: string) => {
    selectGameMode(modeId as GameModeType);
  };

  const handleBack = () => {
    // Navigate back to sport selection via the store (not just local state)
    useGameStore.getState().setCurrentScreen('menu');
    setStep('sport');
    setSelectedSport(null);
  };

  // If we're told to show mode-select and we have a sport, show modes
  const effectiveStep = initialStep === 'mode' ? 'mode' : step;

  return (
    <div className="premium-main-menu">

      {/* Header */}
      <div className="menu-header">
        <div className="logo-container">
          <div className="logo-glow"></div>
          <h1 className="main-logo premium-metal-text">SPORTS ARENA</h1>
        </div>
        <h2 className="tagline">
          {effectiveStep === 'sport' ? 'SELECT YOUR GAME' : 'SELECT GAME MODE'}
        </h2>
      </div>

      {/* Main Content Area */}
      <div className="menu-content-area">

        {effectiveStep === 'sport' && (
          <div className="step-container sport-step">
            <SportSelector3D
              sports={SPORTS}
              selectedSportId={selectedSport}
              onSelect={handleSportSelect}
            />
          </div>
        )}

        {effectiveStep === 'mode' && (
          <div className="step-container mode-step">
            <button className="back-button premium-3d-button" onClick={handleBack}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              BACK
            </button>

            <p className="sport-badge-label">
              Playing: <strong>{currentSport.toUpperCase()}</strong>
            </p>

            <div className="mode-cards-container">
              {GAME_MODES.map((mode, index) => (
                <GameModeCard
                  key={mode.id}
                  mode={mode}
                  index={index}
                  onSelect={() => handleModeSelect(mode.id)}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
