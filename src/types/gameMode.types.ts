/**
 * Game Mode Type Definitions
 */

import type { SportType } from './sportTheme.types';

export type GameMode = 'menu' | '1v1' | 'vs-ai' | 'tournament';

export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'nightmare';

export interface GameSettings {
    mode: GameMode;
    sport: SportType;
    aiDifficulty?: AIDifficulty;
    scoreToWin: number;
    player1Name: string;
    player2Name: string;
}

export interface TournamentSettings {
    playerCount: 4 | 8 | 16 | 32;
    fillWithAI: boolean;
    aiDifficulty: AIDifficulty;
}
