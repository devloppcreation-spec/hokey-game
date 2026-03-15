/**
 * AIController
 *
 * Computer-controlled opponent with 4 difficulty levels.
 * Returns a velocity vector each frame to feed into the engine
 * in place of human keyboard/touch input for Player 2.
 *
 * The AI reads the puck position/velocity every frame and decides
 * where to move. Difficulty affects how quickly it reacts, how
 * accurately it predicts trajectories, and how fast it moves.
 */

import type { AIDifficulty } from '@/types/gameMode.types';
import type { Vec2, PlayerState, PuckState, RinkDimensions } from '@/types/game.types';

// ── Difficulty Configs ────────────────────────────────────────

interface AIConfig {
    /** How often (ms) the AI recalculates its target. Lower = smarter. */
    recalcInterval: number;
    /** 0-1, how accurately the AI predicts puck trajectory. */
    predictionAccuracy: number;
    /** Speed multiplier applied to movement (1.0 = full player speed). */
    moveSpeed: number;
    /** 0-1, per-recalculation chance of moving to the wrong spot. */
    mistakeChance: number;
    /** 0-1, how willingly the AI pushes forward into its opponent's half-zone. */
    aggressiveness: number;
    /** How many simulation steps to predict the puck ahead. More = better. */
    predictionSteps: number;
}

const DIFFICULTY_CONFIGS: Record<AIDifficulty, AIConfig> = {
    easy: {
        recalcInterval: 180,
        predictionAccuracy: 0.5,
        moveSpeed: 0.75,
        mistakeChance: 0.15,
        aggressiveness: 0.25,
        predictionSteps: 20,
    },
    medium: {
        recalcInterval: 80,
        predictionAccuracy: 0.78,
        moveSpeed: 0.95,
        mistakeChance: 0.06,
        aggressiveness: 0.5,
        predictionSteps: 40,
    },
    hard: {
        recalcInterval: 35,
        predictionAccuracy: 0.92,
        moveSpeed: 1.05,
        mistakeChance: 0.015,
        aggressiveness: 0.7,
        predictionSteps: 60,
    },
    nightmare: {
        recalcInterval: 16,       // every frame
        predictionAccuracy: 0.99,
        moveSpeed: 1.15,
        mistakeChance: 0.0,
        aggressiveness: 0.85,
        predictionSteps: 90,
    },
};

// ── AIController Class ───────────────────────────────────────

export class AIController {
    private config: AIConfig;
    private difficulty: AIDifficulty;
    private lastRecalcTime: number = 0;
    private targetPosition: Vec2 | null = null;

    constructor(difficulty: AIDifficulty) {
        this.difficulty = difficulty;
        this.config = DIFFICULTY_CONFIGS[difficulty];
    }

    setDifficulty(difficulty: AIDifficulty): void {
        this.difficulty = difficulty;
        this.config = DIFFICULTY_CONFIGS[difficulty];
    }

    /**
     * Called every frame from the engine update loop.
     * Reads the REAL player position from the engine state (not an internal copy).
     * Returns a velocity vector to apply to the AI player.
     */
    update(
        aiPlayer: PlayerState,
        puck: PuckState,
        rink: RinkDimensions,
        _dt: number,
        currentTime: number,
    ): Vec2 {
        // Recalculate target at the configured interval
        if (currentTime - this.lastRecalcTime >= this.config.recalcInterval) {
            this.lastRecalcTime = currentTime;
            this.targetPosition = this.pickTarget(aiPlayer, puck, rink);

            // Intentional mistake: offset target randomly
            if (Math.random() < this.config.mistakeChance) {
                this.targetPosition = this.addMistake(this.targetPosition, rink);
            }
        }

        // If we have no target yet, go to defensive home position
        if (!this.targetPosition) {
            this.targetPosition = this.getHomePosition(aiPlayer, rink);
        }

        return this.computeVelocity(aiPlayer, this.config.moveSpeed * aiPlayer.speed);
    }

    getDebugInfo(): object {
        return {
            difficulty: this.difficulty,
            target: this.targetPosition,
        };
    }

    // ── Private ──────────────────────────────────────────────

    /**
     * Decide where the AI should move this tick.
     *
     * Strategy:
     * - If puck is heading toward AI's side → predict intercept point
     * - If puck is on AI's side → chase puck directly
     * - If puck is on opponent's side → return to defensive position
     */
    private pickTarget(
        aiPlayer: PlayerState,
        puck: PuckState,
        rink: RinkDimensions,
    ): Vec2 {
        const zone = aiPlayer.zoneBounds;
        const puckHeadingTowardAI = puck.velocity.x > 0; // AI is on the right side (index 1)
        const puckOnAISide = puck.position.x > rink.width * 0.45;

        if (puckOnAISide) {
            // Puck is in our half — go directly to the puck to hit it back
            return this.clampToZone({
                x: puck.position.x - aiPlayer.stickRadius * 0.5,
                y: puck.position.y,
            }, zone);
        }

        if (puckHeadingTowardAI) {
            // Puck is coming toward us — predict where it will arrive
            const predicted = this.predictPuckArrival(puck, rink, zone);
            return this.applyAccuracyNoise(predicted, zone);
        }

        // Puck is heading away — return to defensive position with slight Y tracking
        const homeX = zone.minX + (zone.maxX - zone.minX) * 0.35;
        const trackY = this.lerp(rink.height / 2, puck.position.y, this.config.aggressiveness * 0.5);
        return this.clampToZone({ x: homeX, y: trackY }, zone);
    }

    /**
     * Predict where the puck will cross into the AI's zone boundary.
     * Simulates puck movement with wall bounces.
     */
    private predictPuckArrival(
        puck: PuckState,
        rink: RinkDimensions,
        zone: PlayerState['zoneBounds'],
    ): Vec2 {
        const steps = this.config.predictionSteps;
        const stepDt = 1 / 60;

        let px = puck.position.x;
        let py = puck.position.y;
        let vx = puck.velocity.x;
        let vy = puck.velocity.y;

        const wallTop = rink.borderWidth + 10;
        const wallBottom = rink.height - rink.borderWidth - 10;

        for (let i = 0; i < steps; i++) {
            px += vx * stepDt;
            py += vy * stepDt;

            // Wall bounce
            if (py <= wallTop) { py = wallTop; vy = Math.abs(vy); }
            if (py >= wallBottom) { py = wallBottom; vy = -Math.abs(vy); }

            // Reached AI's zone entrance
            if (px >= zone.minX) {
                return this.clampToZone({ x: px, y: py }, zone);
            }
        }

        // Puck didn't reach us in time — go to where it's predicted to be Y-wise
        return this.clampToZone({ x: zone.minX + (zone.maxX - zone.minX) * 0.3, y: py }, zone);
    }

    /** Add accuracy-based noise to a predicted position. */
    private applyAccuracyNoise(pos: Vec2, zone: PlayerState['zoneBounds']): Vec2 {
        const noise = 1 - this.config.predictionAccuracy;
        const zoneHeight = zone.maxY - zone.minY;
        return this.clampToZone({
            x: pos.x + (Math.random() - 0.5) * 40 * noise,
            y: pos.y + (Math.random() - 0.5) * zoneHeight * 0.4 * noise,
        }, zone);
    }

    /** Get a safe defensive home position. */
    private getHomePosition(aiPlayer: PlayerState, rink: RinkDimensions): Vec2 {
        const zone = aiPlayer.zoneBounds;
        return {
            x: zone.minX + (zone.maxX - zone.minX) * 0.4,
            y: rink.height / 2,
        };
    }

    /** Intentional mistake: big random offset. */
    private addMistake(target: Vec2, rink: RinkDimensions): Vec2 {
        const offset = 40 + Math.random() * 80;
        const dir = Math.random() > 0.5 ? 1 : -1;
        return {
            x: target.x,
            y: Math.max(30, Math.min(rink.height - 30, target.y + offset * dir)),
        };
    }

    /** Compute velocity toward the current target. */
    private computeVelocity(aiPlayer: PlayerState, speed: number): Vec2 {
        if (!this.targetPosition) return { x: 0, y: 0 };

        const dx = this.targetPosition.x - aiPlayer.position.x;
        const dy = this.targetPosition.y - aiPlayer.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Close enough — stop jittering
        if (dist < 2) return { x: 0, y: 0 };

        // Normalise direction and scale by speed
        return {
            x: (dx / dist) * speed,
            y: (dy / dist) * speed,
        };
    }

    private clampToZone(pos: Vec2, zone: PlayerState['zoneBounds']): Vec2 {
        return {
            x: Math.max(zone.minX, Math.min(zone.maxX, pos.x)),
            y: Math.max(zone.minY, Math.min(zone.maxY, pos.y)),
        };
    }

    private lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }
}
