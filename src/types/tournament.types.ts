/**
 * Tournament Type Definitions
 *
 * Types for the bracket-based tournament system:
 * registration, bracket generation, match progression, and champion crowning.
 */

import type { AIDifficulty } from './gameMode.types';

// ── Tournament Player ────────────────────────────────────────

export interface TournamentPlayer {
    id: string;
    name: string;
    email: string;
    isAI: boolean;
    aiDifficulty?: AIDifficulty;
    seed?: number;
}

// ── Tournament Match ─────────────────────────────────────────

export type TournamentMatchStatus = 'pending' | 'ready' | 'playing' | 'completed';

export interface TournamentMatch {
    id: string;
    round: number;
    position: number; // Position within the round (0, 1, 2, 3…)
    player1: TournamentPlayer | null;
    player2: TournamentPlayer | null;
    winner: TournamentPlayer | null;
    score: { player1: number; player2: number } | null;
    status: TournamentMatchStatus;
}

// ── Tournament ───────────────────────────────────────────────

export type TournamentStatus = 'registration' | 'in-progress' | 'completed';

export interface Tournament {
    id: string;
    name: string;
    playerCount: 4 | 8 | 16 | 32;
    players: TournamentPlayer[];
    bracket: TournamentMatch[];
    currentMatch: TournamentMatch | null;
    status: TournamentStatus;
    champion: TournamentPlayer | null;
    createdAt: string;
}

// ── Round (display helper) ───────────────────────────────────

export interface TournamentRound {
    name: string;
    matches: TournamentMatch[];
}
