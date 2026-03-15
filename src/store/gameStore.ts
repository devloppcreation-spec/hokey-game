/**
 * Game Store
 *
 * Zustand store that bridges the GameEngine with React.
 * Holds a snapshot of game state and exposes engine controls.
 * Also manages top-level screen navigation for the app.
 */

import { create } from 'zustand';
import type { GameState, GameStatus, GameConfig } from '@/types';
import type { SportType } from '@/types/sportTheme.types';
import type { GameMode, AIDifficulty, TournamentSettings } from '@/types/gameMode.types';
import { GameEngine } from '@/game/GameEngine';

export type GameScreen =
    | 'menu'
    | 'sport-select'
    | 'mode-select'
    | 'difficulty'
    | 'signin'
    | 'tournament-setup'
    | 'tournament-registration'
    | 'tournament-bracket'
    | 'game'
    | 'game-over';

interface GameStore {
    /** Snapshot of the current game state (updated each frame). */
    gameState: GameState | null;
    engine: GameEngine | null;

    /** Top-level screen routing. */
    currentScreen: GameScreen;
    setCurrentScreen: (screen: GameScreen) => void;

    /** Current sport visual theme. */
    currentSport: SportType;
    setSport: (sport: SportType) => void;

    /** Game mode. */
    gameMode: GameMode;
    setGameMode: (mode: GameMode) => void;

    /** AI settings. */
    aiDifficulty: AIDifficulty;
    setAIDifficulty: (difficulty: AIDifficulty) => void;

    /** Tournament settings. */
    tournamentSettings: TournamentSettings;
    setTournamentSettings: (settings: TournamentSettings) => void;

    /** Score to win. */
    scoreToWin: number;
    setScoreToWin: (score: number) => void;

    /** Match duration in seconds, null for infinite */
    matchDuration: number | null;
    setMatchDuration: (duration: number | null) => void;

    /** Players ready state */
    player1Ready: boolean;
    player2Ready: boolean;

    /** Navigation helpers. */
    goBack: () => void;
    selectSport: (sport: SportType) => void;
    selectGameMode: (mode: GameMode) => void;
    returnToMenu: () => void;

    /** Game flow */
    setPlayer1Ready: (ready: boolean) => void;
    setPlayer2Ready: (ready: boolean) => void;
    endGame: () => void;

    /** Initialise the engine for a given rink width. */
    initEngine: (
        rinkWidth: number,
        config?: Partial<GameConfig>,
        playerNames?: [string, string],
    ) => void;

    /** Start / restart the game. */
    startGame: () => void;
    pauseGame: () => void;
    resumeGame: () => void;
    togglePause: () => void;
    disposeEngine: () => void;
    resizeRink: (width: number) => void;

    /** Called internally on every frame to update React state. */
    syncState: () => void;

    /** Convenience getters. */
    status: GameStatus;
    scores: [number, number];
}

export const useGameStore = create<GameStore>((set, get) => ({
    gameState: null,
    engine: null,

    currentScreen: 'menu',
    setCurrentScreen: (screen) => set({ currentScreen: screen }),

    currentSport: 'hockey',
    setSport: (sport) => set({ currentSport: sport }),

    gameMode: 'menu',
    setGameMode: (mode) => set({ gameMode: mode }),

    aiDifficulty: 'medium',
    setAIDifficulty: (difficulty) => set({ aiDifficulty: difficulty }),

    tournamentSettings: { playerCount: 8, fillWithAI: true, aiDifficulty: 'medium' },
    setTournamentSettings: (settings) => set({ tournamentSettings: settings }),

    scoreToWin: 5,
    setScoreToWin: (score) => set({ scoreToWin: score }),

    matchDuration: 180,
    setMatchDuration: (duration) => set({ matchDuration: duration }),

    player1Ready: false,
    player2Ready: false,

    // Navigation helpers
    goBack: () => {
        const { currentScreen, gameMode } = get();
        
        const backMap: Record<GameScreen, GameScreen> = {
            'menu': 'menu',
            'sport-select': 'menu',
            'mode-select': 'sport-select',
            'difficulty': 'mode-select',
            'signin': gameMode === 'vs-ai' ? 'difficulty' : 'mode-select',
            'tournament-setup': 'mode-select',
            'tournament-registration': 'tournament-setup',
            'tournament-bracket': 'tournament-registration',
            'game': 'menu', // Can't go back during game
            'game-over': 'menu'
        };
        
        set({ currentScreen: backMap[currentScreen] || 'menu' });
    },

    selectSport: (sport) => {
        set({ currentSport: sport, currentScreen: 'mode-select' });
    },

    selectGameMode: (mode) => {
        set({ gameMode: mode, player1Ready: false, player2Ready: false });
        switch (mode) {
            case '1v1':
                set({ currentScreen: 'signin' });
                break;
            case 'vs-ai':
                set({ currentScreen: 'difficulty' });
                break;
            case 'tournament':
                set({ currentScreen: 'tournament-setup' });
                break;
            default:
                set({ currentScreen: 'menu' });
        }
    },

    returnToMenu: () => {
        set({ 
            currentScreen: 'menu', 
            gameMode: 'menu',
            player1Ready: false,
            player2Ready: false
        });
    },

    status: 'idle',
    scores: [0, 0],

    setPlayer1Ready: (ready) => {
        set({ player1Ready: ready });
        
        const { gameMode, player2Ready } = get();
        
        // Auto-start conditions
        if (ready) {
            if (gameMode === 'vs-ai') {
                // VS AI: Only need player 1 ready
                get().startGame();
            } else if (gameMode === '1v1' && player2Ready) {
                // 1v1: Need both players ready
                get().startGame();
            }
        }
    },

    setPlayer2Ready: (ready) => {
        set({ player2Ready: ready });
        
        const { gameMode, player1Ready } = get();
        
        // 1v1: Check if both ready
        if (ready && gameMode === '1v1' && player1Ready) {
            get().startGame();
        }
    },

    initEngine: (rinkWidth, config, playerNames) => {
        get().engine?.dispose();

        const engine = new GameEngine(rinkWidth, config, {
            onStateChange: () => get().syncState(),
            onGoal: () => get().syncState(),
            onGameEnd: () => get().syncState(),
        }, playerNames);

        set({ engine, gameState: engine.getState(), status: 'idle', scores: [0, 0] });
    },

    startGame: () => {
        console.log('Starting game screen...'); // Debug log
        set({ currentScreen: 'game', player1Ready: false, player2Ready: false });
    },

    endGame: () => {
        set({ currentScreen: 'game-over' });
    },

    pauseGame: () => get().engine?.pause(),
    resumeGame: () => get().engine?.resume(),
    togglePause: () => get().engine?.togglePause(),

    disposeEngine: () => {
        get().engine?.dispose();
        set({ engine: null, gameState: null, status: 'idle', scores: [0, 0] });
    },

    resizeRink: (width) => {
        get().engine?.resize(width);
        get().syncState();
    },

    syncState: () => {
        const engine = get().engine;
        if (!engine) return;
        const s = engine.getState();
        set({
            gameState: s,
            status: s.status,
            scores: [...s.scores] as [number, number],
        });
    },
}));

