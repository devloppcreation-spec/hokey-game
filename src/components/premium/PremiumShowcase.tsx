import React, { useState } from 'react';
import { StadiumBackground } from '../stadium/StadiumBackground';
import { PremiumScoreboard } from '../game/PremiumScoreboard';
import { PremiumMainMenu } from './menu/PremiumMainMenu';
import { PremiumButton } from '../ui/PremiumButton';
import { PremiumInput } from '../ui/PremiumInput';
import { PremiumCheckbox } from '../ui/PremiumCheckbox';
import { PremiumModal } from '../ui/PremiumModal';
import { GoalCelebration } from '../effects/GoalCelebration';
import { GameCountdown } from '../effects/GameCountdown';
import { ScreenShake } from '../effects/ScreenShake';
import { PremiumPlayingField } from '../game/PremiumPlayingField';
import { PremiumLoadingScreen } from '../screens/PremiumLoadingScreen';
import { ScreenTransition } from '../transitions/ScreenTransition';

export const PremiumShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'menu' | 'stadium' | 'field' | 'effects' | 'ui' | 'loading'>('menu');
  const [showGoal, setShowGoal] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [shakeIntensity, setShakeIntensity] = useState<'light' | 'medium' | 'heavy'>('medium');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [modalCheckboxChecked, setModalCheckboxChecked] = useState(true);

  // Trigger Shake
  const handleShake = (intensity: 'light' | 'medium' | 'heavy') => {
    setShakeIntensity(intensity);
    setShakeTrigger(prev => prev + 1);
  };

  const handleGoal = () => {
    setShowGoal(true);
  };

  const handleCountdown = () => {
    setShowCountdown(true);
  };

  const startLoading = () => {
    setShowLoading(true);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0f172a', position: 'relative', overflow: 'hidden' }}>
      
      {/* Top Navigation for the Showcase */}
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, display: 'flex', gap: 10 }}>
        {['menu', 'stadium', 'field', 'effects', 'ui', 'loading'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            style={{ 
              padding: '8px 16px', 
              background: activeTab === tab ? '#FFD700' : '#1E293B', 
              color: activeTab === tab ? '#000' : '#fff',
              border: '1px solid #334155',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <ScreenTransition transitionKey={activeTab} type="fade">
        
        {/* 1. Main Menu Screen */}
        {activeTab === 'menu' && (
          <div style={{ width: '100%', height: '100%', background: 'radial-gradient(circle, #1E293B, #000)' }}>
            <PremiumMainMenu />
          </div>
        )}

        {/* 2. Stadium & Scoreboard */}
        {activeTab === 'stadium' && (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <StadiumBackground intensity={showGoal ? 'goal' : 'normal'} />
            <PremiumScoreboard
              score={{ player1: 2, player2: 1 }}
              player1Name="ALEX"
              player2Name="ROBOT"
              sport="hockey"
              timeRemaining={225}
            />
            <div style={{ position: 'absolute', bottom: 50, left: '50%', transform: 'translateX(-50%)', zIndex: 50 }}>
               <PremiumButton onClick={handleGoal} variant="gold">Trigger Goal Event</PremiumButton>
            </div>
            {showGoal && (
              <GoalCelebration
                isActive={showGoal}
                scoringPlayer="player1"
                playerName="ALEX"
                onComplete={() => setShowGoal(false)}
              />
            )}
          </div>
        )}

        {/* 3. 3D Playing Field */}
        {activeTab === 'field' && (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <PremiumPlayingField sport="hockey" />
          </div>
        )}

        {/* 4. Effects (Shake & Countdown) */}
        {activeTab === 'effects' && (
          <ScreenShake trigger={shakeTrigger} intensity={shakeIntensity}>
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
              <h1 className="premium-metal-text" style={{ fontSize: 64 }}>Effects Testing</h1>
              <div style={{ display: 'flex', gap: 20 }}>
                <PremiumButton onClick={() => handleShake('light')} variant="secondary">Light Shake</PremiumButton>
                <PremiumButton onClick={() => handleShake('medium')} variant="primary">Medium Shake</PremiumButton>
                <PremiumButton onClick={() => handleShake('heavy')} variant="danger">Heavy Shake</PremiumButton>
              </div>
              <PremiumButton onClick={handleCountdown} variant="gold" size="xl">Start Full Countdown</PremiumButton>
            </div>
            {showCountdown && <GameCountdown onComplete={() => setShowCountdown(false)} />}
          </ScreenShake>
        )}

        {/* 5. UI Primitives */}
        {activeTab === 'ui' && (
          <div style={{ display: 'flex', width: '100%', height: '100%', padding: '80px', gap: 40, background: '#0F172A', color: 'white' }}>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <h2>Premium Buttons</h2>
              <PremiumButton variant="primary" size="lg">Primary Button</PremiumButton>
              <PremiumButton variant="secondary" size="lg">Secondary Box</PremiumButton>
              <PremiumButton variant="gold" size="lg">Golden Call to Action</PremiumButton>
              <PremiumButton variant="danger" size="lg">Danger Action</PremiumButton>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <h2>Premium Inputs</h2>
              <PremiumInput label="PLAYER 1 NAME" placeholder="Enter name..." />
              <PremiumInput label="PASSWORD" type="password" error="Invalid credentials" />
              <PremiumCheckbox
                label="ENABLE 3D STADIUM EFFECTS"
                checked={checkboxChecked}
                onChange={setCheckboxChecked}
              />
              <PremiumButton variant="ghost" onClick={() => setIsModalOpen(true)}>Open Modal</PremiumButton>
            </div>
            
            <PremiumModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)}
              title="GAME SETTINGS"
            >
              <p>Configure your premium broadcast experience here. Adjust lighting, stadium density, and celebration particles.</p>
              <PremiumCheckbox
                label="Lock 60fps"
                checked={modalCheckboxChecked}
                onChange={setModalCheckboxChecked}
              />
              <div style={{ marginTop: 20 }}>
                <PremiumButton variant="primary" onClick={() => setIsModalOpen(false)}>Save Changes</PremiumButton>
              </div>
            </PremiumModal>
            
          </div>
        )}

        {/* 6. Loading Screen */}
        {activeTab === 'loading' && (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {!showLoading && (
              <PremiumButton onClick={startLoading} size="xl" variant="gold">Simulate Loading</PremiumButton>
            )}
            {showLoading && (
              <PremiumLoadingScreen onComplete={() => setShowLoading(false)} minDuration={3000} />
            )}
          </div>
        )}

      </ScreenTransition>
    </div>
  );
};
