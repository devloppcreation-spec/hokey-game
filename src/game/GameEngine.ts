/**
 * Game Engine
 *
 * Main game loop class:
 * - 60 FPS loop via requestAnimationFrame with delta-time
 * - Game state machine (idle → countdown → playing → goal → playing/ended)
 * - Pause/resume
 * - Integrates physics, input, and entity management
 * - Optional AI opponent for vs-computer mode
 */

import type {
    GameState,
    GameConfig,
    GameStatus,
    GameStats,
    InputState,
} from '@/types/game.types';
import type { AIDifficulty } from '@/types/gameMode.types';
import { createRink, createGoals } from './entities/Rink';
import { createPuck, resetPuck, updatePuckTrail } from './entities/Puck';
import { createPlayer, resetPlayerPosition, clampPlayerPosition } from './entities/Player';
import { isPuckInGoal, getGoalpostCollision } from './entities/Goal';
import {
    applyFriction,
    integratePuck,
    integratePlayer,
    collidePuckWithPlayer,
    collidePuckWithWalls,
    collidePuckWithGoalpost,
} from './Physics';
import {
    createInputState,
    attachInputListeners,
    getPlayerVelocityFromInput,
    getPlayerVelocityFromTouch,
} from './Input';
import { AIController } from './ai/AIController';

// ── Default Config ────────────────────────────────────────────

export const DEFAULT_GAME_CONFIG: GameConfig = {
    scoreToWin: 5,
    matchDuration: null,
    countdownSeconds: 3,
    celebrationDuration: 3000,
    friction: 0.02,
    puckBounce: 0.75,
    puckMaxSpeed: 900,
    playerSpeed: 400,
    playerStickRadius: 22,
    puckRadius: 12,
    goalWidth: 0, // set from rink
    goalDepth: 0, // set from rink
};

// ── Callbacks ─────────────────────────────────────────────────

export interface GameCallbacks {
    onStateChange?: (state: GameState) => void;
    onGoal?: (scoringPlayer: number, state: GameState) => void;
    onGameEnd?: (winner: number, state: GameState) => void;
    onCountdownTick?: (remaining: number) => void;
}

// ── Engine Class ──────────────────────────────────────────────

export class GameEngine {
    private state: GameState;
    private config: GameConfig;
    private callbacks: GameCallbacks;
    private input = createInputState();
    private cleanupInput: (() => void) | null = null;
    private animFrameId: number | null = null;
    private lastTimestamp = 0;
    private countdownTimer = 0;
    private celebrationTimer = 0;
    private disposed = false;

    // AI opponent
    private aiController: AIController | null = null;
    private isVsAI = false;

    constructor(
        rinkWidth: number,
        config: Partial<GameConfig> = {},
        callbacks: GameCallbacks = {},
        playerNames?: [string, string],
    ) {
        this.config = { ...DEFAULT_GAME_CONFIG, ...config };
        this.callbacks = callbacks;

        const rink = createRink(rinkWidth);
        this.config.goalWidth = rink.goalWidth;
        this.config.goalDepth = rink.goalDepth;

        const goals = createGoals(rink);
        const puck = createPuck(rink, this.config.puckRadius, this.config.puckMaxSpeed);
        const p1 = createPlayer(0, rink, this.config.playerStickRadius, this.config.playerSpeed, playerNames?.[0]);
        const p2 = createPlayer(1, rink, this.config.playerStickRadius, this.config.playerSpeed, playerNames?.[1]);

        const stats: GameStats = {
            shots: [0, 0],
            goals: [0, 0],
            possession: [0, 0],
            totalPlayTime: 0,
        };

        this.state = {
            status: 'idle',
            players: [p1, p2],
            puck,
            goals,
            rink,
            config: this.config,
            stats,
            scores: [0, 0],
            countdownRemaining: this.config.countdownSeconds,
            matchTimeRemaining: this.config.matchDuration,
            lastGoalBy: null,
            winner: null,
        };
    }

    // ── Public API ────────────────────────────────────────

    getState(): GameState {
        return this.state;
    }

    /** Attach input listeners (call after canvas is mounted). */
    attachInput(canvas?: HTMLElement): void {
        this.cleanupInput = attachInputListeners(this.input, canvas);
    }

    /** Expose input state for external touch systems (e.g. TouchInput). */
    getInputState(): InputState {
        return this.input;
    }

    /** Start or restart the game. */
    start(skipCountdown = false): void {
        this.resetPositions();
        this.state.scores = [0, 0];
        this.state.stats = { shots: [0, 0], goals: [0, 0], possession: [0, 0], totalPlayTime: 0 };
        this.state.winner = null;
        this.state.matchTimeRemaining = this.config.matchDuration;

        if (skipCountdown) {
            this.setStatus('playing');
            this.countdownTimer = 0;
            this.state.countdownRemaining = 0;
        } else {
            this.setStatus('countdown');
            this.countdownTimer = this.config.countdownSeconds;
            this.state.countdownRemaining = this.config.countdownSeconds;
        }

        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
        
        console.log('[GameEngine] Starting loop...');
        this.lastTimestamp = performance.now();
        this.animFrameId = requestAnimationFrame((ts) => this.loop(ts));
    }

    pause(): void {
        if (this.state.status === 'playing') {
            this.setStatus('paused');
        }
    }

    resume(): void {
        if (this.state.status === 'paused') {
            this.setStatus('playing');
            this.lastTimestamp = performance.now();
        }
    }

    togglePause(): void {
        if (this.state.status === 'playing') this.pause();
        else if (this.state.status === 'paused') this.resume();
    }

    /** Enable AI opponent for Player 2. */
    initAI(difficulty: AIDifficulty): void {
        this.isVsAI = true;
        this.aiController = new AIController(difficulty);
    }

    /** Disable AI and return to human control. */
    disableAI(): void {
        this.isVsAI = false;
        this.aiController = null;
    }

    /** Whether AI mode is active. */
    get aiEnabled(): boolean {
        return this.isVsAI;
    }

    dispose(): void {
        this.disposed = true;
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
        this.cleanupInput?.();
        this.aiController = null;
    }

    /** Resize the rink (e.g. on window resize). */
    resize(newWidth: number): void {
        const rink = createRink(newWidth);
        this.config.goalWidth = rink.goalWidth;
        this.config.goalDepth = rink.goalDepth;
        const goals = createGoals(rink);

        // Scale positions proportionally
        const scaleX = rink.width / (this.state.rink?.width || 1);
        const scaleY = rink.height / (this.state.rink?.height || 1);

        this.state.puck.position.x *= scaleX;
        this.state.puck.position.y *= scaleY;

        for (const p of this.state.players) {
            p.position.x *= scaleX;
            p.position.y *= scaleY;
            // Recalculate zone bounds
            const padding = p.stickRadius + rink.borderWidth;
            const halfW = rink.width / 2;
            const overlap = rink.width * 0.02;
            p.zoneBounds = p.index === 0
                ? { minX: padding, maxX: halfW + overlap, minY: padding, maxY: rink.height - padding }
                : { minX: halfW - overlap, maxX: rink.width - padding, minY: padding, maxY: rink.height - padding };
        }

        this.state.rink = rink;
        this.state.goals = goals;
        this.state.config = this.config;
    }

    // ── Private: State Machine ────────────────────────────

    private setStatus(status: GameStatus): void {
        this.state.status = status;
        this.callbacks.onStateChange?.(this.state);
    }

    // ── Private: Game Loop ────────────────────────────────

    private loop(timestamp: number): void {
        if (this.disposed) return;

        const rawDt = (timestamp - this.lastTimestamp) / 1000;
        const dt = Math.max(0, Math.min(rawDt, 1 / 30));
        this.lastTimestamp = timestamp;

        this.update(dt);

        this.animFrameId = requestAnimationFrame((ts) => this.loop(ts));
    }

    private update(dt: number): void {
        switch (this.state.status) {
            case 'countdown':
                this.updateCountdown(dt);
                break;
            case 'playing':
                this.updatePlaying(dt);
                break;
            case 'goal':
                this.updateCelebration(dt);
                break;
            case 'idle':
            case 'paused':
            case 'ended':
                // No physics update
                break;
        }
    }

    // ── Countdown ─────────────────────────────────────────

    private updateCountdown(dt: number): void {
        this.countdownTimer -= dt;
        const remaining = Math.ceil(this.countdownTimer);
        if (remaining !== this.state.countdownRemaining) {
            this.state.countdownRemaining = remaining;
            this.callbacks.onCountdownTick?.(remaining);
        }
        if (this.countdownTimer <= 0) {
            this.setStatus('playing');
        }
    }

    // ── Playing ───────────────────────────────────────────

    private updatePlaying(dt: number): void {
        this.state.stats.totalPlayTime += dt;

        // Match timer
        if (this.state.matchTimeRemaining !== null) {
            this.state.matchTimeRemaining -= dt;
            if (this.state.matchTimeRemaining <= 0) {
                this.state.matchTimeRemaining = 0;
                this.endGame();
                return;
            }
        }

        // Input → player velocity
        for (const player of this.state.players) {
            // AI controls Player 2 (index 1) in vs-ai mode
            if (this.isVsAI && this.aiController && player.index === 1) {
                const aiVel = this.aiController.update(
                    player,
                    this.state.puck,
                    this.state.rink,
                    dt,
                    performance.now(),
                );
                player.velocity.x = aiVel.x;
                player.velocity.y = aiVel.y;
                continue;
            }
            const touchVel = getPlayerVelocityFromTouch(player, this.input);
            const vel = touchVel ?? getPlayerVelocityFromInput(player, this.input);
            player.velocity.x = vel.x;
            player.velocity.y = vel.y;
        }

        // Integrate player positions
        for (const player of this.state.players) {
            integratePlayer(player, dt);
            clampPlayerPosition(player);
        }

        // Puck physics
        applyFriction(this.state.puck, this.config.friction, dt);
        integratePuck(this.state.puck, dt);

        // Puck ↔ player collisions
        for (const player of this.state.players) {
            collidePuckWithPlayer(this.state.puck, player);
        }

        // Puck ↔ walls
        collidePuckWithWalls(this.state.puck, this.state.rink, this.state.goals, this.config.puckBounce);

        // Puck ↔ goalposts
        for (const goal of this.state.goals) {
            const post = getGoalpostCollision(this.state.puck, goal);
            if (post) {
                collidePuckWithGoalpost(this.state.puck, post, this.config.puckBounce);
            }
        }

        // Trail
        updatePuckTrail(this.state.puck);

        // Possession tracking
        if (this.state.puck.lastTouchedBy !== null) {
            this.state.stats.possession[this.state.puck.lastTouchedBy] += dt;
        }

        // Goal detection
        // Left goal ⇒ Player 2 scores (right player)
        if (isPuckInGoal(this.state.puck, this.state.goals[0])) {
            this.scoreGoal(1);
            return;
        }
        // Right goal ⇒ Player 1 scores (left player)
        if (isPuckInGoal(this.state.puck, this.state.goals[1])) {
            this.scoreGoal(0);
            return;
        }
    }

    // ── Goal Scoring ──────────────────────────────────────

    private scoreGoal(scoringPlayer: number): void {
        this.state.scores[scoringPlayer] += 1;
        this.state.players[scoringPlayer].score = this.state.scores[scoringPlayer];
        this.state.stats.goals[scoringPlayer] += 1;
        this.state.lastGoalBy = scoringPlayer;

        this.callbacks.onGoal?.(scoringPlayer, this.state);

        // Check win condition
        if (this.state.scores[scoringPlayer] >= this.config.scoreToWin) {
            this.state.winner = scoringPlayer;
            this.setStatus('ended');
            this.callbacks.onGameEnd?.(scoringPlayer, this.state);
            return;
        }

        // Enter celebration
        this.celebrationTimer = this.config.celebrationDuration / 1000;
        this.setStatus('goal');
    }

    // ── Celebration ───────────────────────────────────────

    private updateCelebration(dt: number): void {
        this.celebrationTimer -= dt;
        if (this.celebrationTimer <= 0) {
            this.resetPositions();
            this.countdownTimer = this.config.countdownSeconds;
            this.state.countdownRemaining = this.config.countdownSeconds;
            this.setStatus('countdown');
        }
    }

    // ── End Game ──────────────────────────────────────────

    private endGame(): void {
        // Determine winner by score
        if (this.state.scores[0] > this.state.scores[1]) {
            this.state.winner = 0;
        } else if (this.state.scores[1] > this.state.scores[0]) {
            this.state.winner = 1;
        } else {
            this.state.winner = null; // draw
        }
        this.setStatus('ended');
        this.callbacks.onGameEnd?.(this.state.winner ?? -1, this.state);
    }

    // ── Reset Positions ───────────────────────────────────

    private resetPositions(): void {
        resetPuck(this.state.puck, this.state.rink);
        for (const player of this.state.players) {
            resetPlayerPosition(player, this.state.rink);
        }
    }
}
