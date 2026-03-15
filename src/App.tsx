/**
 * App.tsx — Top-level screen router
 *
 * Routes between screens based on gameStore.currentScreen.
 * Always shows a fixed settings button.
 */

import { useState } from 'react';
import { useBrandContext } from '@/brand/BrandProvider';
import { useGameStore } from '@/store/gameStore';
import { PremiumMainMenu } from '@/components/premium/menu/PremiumMainMenu';
import { DifficultySelection } from '@/components/menu/DifficultySelection';
import { SignInScreen } from '@/components/auth/SignInScreen';
import { GameContainer } from '@/components/game/GameContainer';
import { PremiumLoadingScreen } from '@/components/screens/PremiumLoadingScreen';
import { TournamentSetup } from '@/components/tournament/TournamentSetup';
import { TournamentRegistration } from '@/components/tournament/TournamentRegistration';
import { TournamentBracket } from '@/components/tournament/TournamentBracket';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { ScreenTransition } from '@/components/transitions/ScreenTransition';
import { DevModeAccess } from '@/admin/DevModeAccess';
import { AdminPanel } from '@/admin/AdminPanel';
import { APP_CONFIG } from '@/config/appConfig';
import type { PlayerInfo } from '@/types/user.types';
import { useUserStore } from '@/store/userStore';
import './App.css';

function App() {
  const { brand } = useBrandContext();
  const { currentScreen, setCurrentScreen } = useGameStore();
  const { setPlayer1, setPlayer2 } = useUserStore();
  const [showSettings, setShowSettings] = useState(false);
  const [isBooting, setIsBooting] = useState(true);

  const handleSignInComplete = (p1: PlayerInfo, p2: PlayerInfo) => {
    setPlayer1(p1);
    setPlayer2(p2);
    // Small delay for "both ready" message
    setTimeout(() => setCurrentScreen('game'), 1200);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return <PremiumMainMenu initialStep="sport" />;

      case 'mode-select':
        return <PremiumMainMenu initialStep="mode" />;

      case 'difficulty':
        return <DifficultySelection />;

      case 'signin':
        return <SignInScreen onBothPlayersReady={handleSignInComplete} />;

      case 'tournament-setup':
        return <TournamentSetup />;

      case 'tournament-registration':
        return <TournamentRegistration />;

      case 'tournament-bracket':
        return <TournamentBracket />;

      case 'game':
      case 'game-over':
        return <GameContainer brand={brand} />;

      default:
        return <PremiumMainMenu initialStep="sport" />;
    }
  };

  if (isBooting) {
    return <PremiumLoadingScreen onComplete={() => setIsBooting(false)} />;
  }

  return (
    <>
      <ScreenTransition transitionKey={currentScreen} type="fade">
        {renderScreen()}
      </ScreenTransition>

      {/* Settings Button — Always visible except during active gameplay */}
      {currentScreen !== 'game' && (
        <button
          className="settings-button"
          onClick={() => setShowSettings(true)}
          aria-label="Settings"
        >
          ⚙️
        </button>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}

      {/* Admin panel — only via secret "devmode" key sequence */}
      <DevModeAccess enabled={APP_CONFIG.DEV_MODE_ENABLED}>
        <AdminPanel brand={brand} />
      </DevModeAccess>
    </>
  );
}

export default App;
