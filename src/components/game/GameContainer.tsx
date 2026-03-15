/**
 * GameContainer Component
 *
 * Top-level game wrapper that orchestrates all sub-components:
 * MainMenu → SignIn → PlayerSetup → GameCanvas + Scoreboard + Controls + Overlay.
 *
 * In vs-ai mode, sign-in is skipped for Player 2 (auto-filled as the AI).
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { BrandConfig } from '@/types/brand.types';
import type { PlayerInfo } from '@/types/user.types';
import { useGame } from '@/hooks/useGame';
import { useSound } from '@/hooks/useSound';
import { useUserStore } from '@/store/userStore';
import { useGameStore } from '@/store/gameStore';
import { GameCanvas } from './GameCanvas';
import { PremiumScoreboard } from './PremiumScoreboard';
import { GameControls } from './GameControls';
import { GameOverlay } from './GameOverlay';
import { AIOpponent } from './AIOpponent';
import { getAIPersonality } from '@/game/ai/AIPersonality';
import { useStadiumAtmosphere } from '@/hooks/useStadiumAtmosphere';
import { useGameEffects } from '@/hooks/useGameEffects';
import { StadiumBackground } from '@/components/stadium/StadiumBackground';
import { ScreenShake } from '@/components/effects/ScreenShake';
import { GoalCelebration } from '@/components/effects/GoalCelebration';
import { GameCountdown } from '@/components/effects/GameCountdown';
import type { SportType } from '@/types/sportTheme.types';

interface GameContainerProps {
    brand: BrandConfig;
}

export function GameContainer({ brand }: GameContainerProps) {
    const game = useGame(brand);
    const sound = useSound(brand.sounds);
    const containerRef = useRef<HTMLDivElement>(null);
    const storePlayer2 = useUserStore((s) => s.setPlayer2);
    const gameMode = useGameStore((s) => s.gameMode);
    const aiDifficulty = useGameStore((s) => s.aiDifficulty);
    const currentSport = useGameStore((s) => s.currentSport);
    const scoreToWin = useGameStore((s) => s.scoreToWin);
    const matchDuration = useGameStore((s) => s.matchDuration);

    // Track AI goal events for taunt display
    const [aiLastEvent, setAILastEvent] = useState<'score' | 'concede' | null>(null);
    const [aiEventKey, setAIEventKey] = useState(0);

    // Premium Effects hooks
    const atmosphere = useStadiumAtmosphere();
    const effects = useGameEffects();

    const [playerNames, setPlayerNames] = useState<[string, string]>([
        brand.gameCustomization.playerNames.player1Default,
        brand.gameCustomization.playerNames.player2Default,
    ]);

    // Initialize player names from store
    useEffect(() => {
        const p1Name = useUserStore.getState().player1?.displayName || brand.gameCustomization.playerNames.player1Default;
        
        if (gameMode === 'vs-ai') {
            const aiPersonality = getAIPersonality(aiDifficulty);
            const p2: PlayerInfo = {
                email: '',
                displayName: aiPersonality.name,
                playerNumber: 2,
            };
            storePlayer2(p2);
            setPlayerNames([p1Name, aiPersonality.name]);
        } else {
            const p2Name = useUserStore.getState().player2?.displayName || brand.gameCustomization.playerNames.player2Default;
            setPlayerNames([p1Name, p2Name]);
        }
    }, [gameMode, aiDifficulty, storePlayer2, brand]);


    // Flag: did we already init AI for this game session?
    const aiInitDone = useRef(false);

    const handleGameStart = useCallback(() => {
        console.log('[GameContainer] handleGameStart - triggering countdown');
        effects.startCountdown();
    }, [effects]);

    const handleCountdownComplete = useCallback(() => {
        console.log('[GameContainer] handleCountdownComplete - starting engine');
        effects.endCountdown();
        game.start();
        sound.play('whistle');

        // Init AI after engine starts if in vs-ai mode
        if (gameMode === 'vs-ai' && !aiInitDone.current) {
            console.log('[GameContainer] Initialzing AI:', aiDifficulty);
            game.initAI(aiDifficulty);
            aiInitDone.current = true;
        }
    }, [effects, game, sound, gameMode, aiDifficulty]);

    const handlePause = useCallback(() => {
        game.pause();
    }, [game]);

    const handleResume = useCallback(() => {
        game.resume();
    }, [game]);

    const handleReset = useCallback(() => {
        game.reset();
        sound.play('whistle');
        // Re-init AI on reset
        if (gameMode === 'vs-ai') {
            game.initAI(aiDifficulty);
        }
    }, [game, sound, gameMode, aiDifficulty]);

    const handlePlayAgain = useCallback(() => {
        handleGameStart();
        if (gameMode === 'vs-ai') {
            game.initAI(aiDifficulty);
        }
    }, [handleGameStart, game, gameMode, aiDifficulty]);

    const handleFullscreen = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            el.requestFullscreen();
        }
    }, []);

    // Track goal events
    const previousStatus = useRef(game.gameState?.status);
    useEffect(() => {
        const s = game.gameState;
        if (!s) return;
        
        if (s.status === 'goal' && previousStatus.current !== 'goal' && s.lastGoalBy !== null) {
            // AI updates
            if (gameMode === 'vs-ai') {
                setAILastEvent(s.lastGoalBy === 1 ? 'score' : 'concede');
                setAIEventKey((k) => k + 1);
            }
            
            // Premium Effects updates
            const isP1 = s.lastGoalBy === 0;
            const playerKey = isP1 ? 'player1' : 'player2';
            const playerName = playerNames[s.lastGoalBy] || (isP1 ? 'Player 1' : 'Player 2');
            
            effects.triggerGoal(playerKey, playerName);
            effects.triggerShake('heavy');
            atmosphere.triggerGoal();
        }
        
        previousStatus.current = s.status;
    }, [game.gameState?.status, game.gameState?.lastGoalBy, gameMode, playerNames, effects, atmosphere]); // eslint-disable-line react-hooks/exhaustive-deps

    // Initial countdown on mount
    useEffect(() => {
        if (!game.status.includes('playing')) {
            handleGameStart();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const c = brand.colors;

    // Game phase
    const sportType = currentSport as SportType;

    return (
        <ScreenShake trigger={effects.shakeTrigger} intensity="heavy">
            <div
                ref={containerRef}
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: c.background,
                    padding: '1rem',
                    gap: '0.75rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* 3D Stadium Atmosphere */}
                <StadiumBackground intensity={atmosphere.intensity} sport={sportType} />
                
                {/* Scoreboard (HTML) */}
                <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1200px' }}>
                    <PremiumScoreboard 
                        player1Name={playerNames[0]} 
                        player2Name={playerNames[1]} 
                        score={{ player1: game.gameState?.scores[0] || 0, player2: game.gameState?.scores[1] || 0 }} 
                        sport={sportType} 
                        timeRemaining={game.gameState?.matchTimeRemaining ?? undefined} 
                        isLive={game.status === 'playing'}
                    />
                </div>

                {/* Canvas + Overlay */}
                <div style={{ position: 'relative', width: '100%', maxWidth: '1200px', zIndex: 5 }}>
                    {/* Event Effects Layer */}
                    <GoalCelebration
                        isActive={effects.showGoalCelebration}
                        scoringPlayer={effects.goalScorer?.player || 'player1'}
                        playerName={effects.goalScorer?.name || ''}
                        onComplete={effects.clearGoal}
                    />
                    
                    {effects.showCountdown && (
                        <GameCountdown onComplete={handleCountdownComplete} />
                    )}
                
                    <GameCanvas
                        brand={brand}
                        game={game}
                        config={{
                            scoreToWin: scoreToWin,
                            matchDuration: matchDuration,
                            celebrationDuration: brand.gameCustomization.celebrationDuration,
                        }}
                        playerNames={playerNames}
                    />


                    
                    {!effects.showCountdown && (
                        <GameOverlay
                            state={game.gameState}
                            brand={brand}
                            onPlayAgain={handlePlayAgain}
                        />
                    )}
                </div>

                {/* AI Indicator (vs-ai mode only) */}
                <div style={{ position: 'relative', zIndex: 10 }}>
                    {gameMode === 'vs-ai' && (
                        <AIOpponent
                            difficulty={aiDifficulty}
                            lastEvent={aiLastEvent}
                            eventKey={aiEventKey}
                        />
                    )}
                </div>

                {/* Controls */}
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <GameControls
                        status={game.status}
                        muted={sound.muted}
                        brand={brand}
                        onPause={handlePause}
                        onResume={handleResume}
                        onReset={handleReset}
                        onToggleMute={sound.toggleMute}
                        onFullscreen={handleFullscreen}
                    />
                </div>
            </div>
        </ScreenShake>
    );
}
