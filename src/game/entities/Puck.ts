/**
 * Puck Entity
 *
 * Creates and manages puck state including position, velocity,
 * trail history for visual effects, and reset logic.
 */

import type { PuckState, Vec2, RinkDimensions } from '@/types/game.types';

const TRAIL_LENGTH = 15;

export function createPuck(rink: RinkDimensions, radius: number, maxSpeed: number): PuckState {
    return {
        position: { x: rink.width / 2, y: rink.height / 2 },
        velocity: { x: 0, y: 0 },
        radius,
        maxSpeed,
        trail: [],
        lastTouchedBy: null,
    };
}

/** Reset puck to centre with zero velocity. */
export function resetPuck(puck: PuckState, rink: RinkDimensions): void {
    puck.position.x = rink.width / 2;
    puck.position.y = rink.height / 2;
    puck.velocity.x = 0;
    puck.velocity.y = 0;
    puck.trail = [];
    puck.lastTouchedBy = null;
}

/** Record current position into the trail buffer. */
export function updatePuckTrail(puck: PuckState): void {
    const speed = Math.hypot(puck.velocity.x, puck.velocity.y);
    // Only record trail when moving meaningfully
    if (speed > 0.5) {
        puck.trail.push({ x: puck.position.x, y: puck.position.y });
        if (puck.trail.length > TRAIL_LENGTH) {
            puck.trail.shift();
        }
    }
}

/** Clamp puck speed to maxSpeed. */
export function clampPuckSpeed(puck: PuckState): void {
    const speed = Math.hypot(puck.velocity.x, puck.velocity.y);
    if (speed > puck.maxSpeed) {
        const scale = puck.maxSpeed / speed;
        puck.velocity.x *= scale;
        puck.velocity.y *= scale;
    }
}

/** Get puck centre as a Vec2. */
export function getPuckCenter(puck: PuckState): Vec2 {
    return { x: puck.position.x, y: puck.position.y };
}
