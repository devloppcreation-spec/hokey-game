/**
 * Physics System
 *
 * Handles all physics simulation for the hockey game:
 * - Ice friction (low coefficient ~0.02)
 * - Circle-circle collision (puck ↔ stick)
 * - Wall/boundary collisions with bounce + energy loss
 * - Goalpost bounce
 * - Momentum transfer on hits
 */

import type { PuckState, PlayerState, RinkDimensions, GoalState, Vec2 } from '@/types/game.types';
import { clampPuckSpeed } from './entities/Puck';

// ── Friction ──────────────────────────────────────────────────

/**
 * Apply ice friction to the puck. Decelerates velocity each frame.
 * frictionCoeff ≈ 0.02 for realistic ice.
 */
export function applyFriction(puck: PuckState, friction: number, dt: number): void {
    const speed = Math.hypot(puck.velocity.x, puck.velocity.y);
    if (speed < 0.1) {
        puck.velocity.x = 0;
        puck.velocity.y = 0;
        return;
    }
    // friction force = μ * g  (simplified: just reduce speed by a factor)
    const decel = friction * 1000 * dt; // scaled for pixel-space
    const newSpeed = Math.max(0, speed - decel);
    const scale = newSpeed / speed;
    puck.velocity.x *= scale;
    puck.velocity.y *= scale;
}

// ── Movement Integration ──────────────────────────────────────

export function integratePuck(puck: PuckState, dt: number): void {
    puck.position.x += puck.velocity.x * dt;
    puck.position.y += puck.velocity.y * dt;
}

export function integratePlayer(player: PlayerState, dt: number): void {
    player.position.x += player.velocity.x * dt;
    player.position.y += player.velocity.y * dt;
}

// ── Circle-Circle Collision (Puck ↔ Stick) ────────────────────

/**
 * Checks and resolves collision between puck and a player's stick.
 * Uses elastic-ish collision with momentum transfer.
 */
export function collidePuckWithPlayer(
    puck: PuckState,
    player: PlayerState,
): boolean {
    const dx = puck.position.x - player.position.x;
    const dy = puck.position.y - player.position.y;
    const dist = Math.hypot(dx, dy);
    const minDist = puck.radius + player.stickRadius;

    if (dist >= minDist || dist === 0) return false;

    // Normalised collision axis
    const nx = dx / dist;
    const ny = dy / dist;

    // Separate overlapping objects
    const overlap = minDist - dist;
    puck.position.x += nx * overlap;
    puck.position.y += ny * overlap;

    // Relative velocity along collision normal
    const dvx = puck.velocity.x - player.velocity.x;
    const dvy = puck.velocity.y - player.velocity.y;
    const relVelAlongNormal = dvx * nx + dvy * ny;

    // Only resolve if objects are moving toward each other
    if (relVelAlongNormal > 0) return false;

    // Coefficient of restitution (how bouncy)
    const restitution = 0.85;

    // Impulse magnitude (puck is light, stick is "infinite mass")
    const impulse = -(1 + restitution) * relVelAlongNormal;

    puck.velocity.x += impulse * nx + player.velocity.x * 0.3;
    puck.velocity.y += impulse * ny + player.velocity.y * 0.3;

    puck.lastTouchedBy = player.index;

    clampPuckSpeed(puck);
    return true;
}

// ── Wall Collisions ───────────────────────────────────────────

/**
 * Bounce the puck off rink walls. Accounts for goal openings
 * so the puck can enter goals instead of bouncing.
 */
export function collidePuckWithWalls(
    puck: PuckState,
    rink: RinkDimensions,
    goals: [GoalState, GoalState],
    bounceCoeff: number,
): void {
    const r = puck.radius;

    // Top wall
    if (puck.position.y - r <= rink.borderWidth) {
        puck.position.y = rink.borderWidth + r;
        puck.velocity.y = Math.abs(puck.velocity.y) * bounceCoeff;
    }

    // Bottom wall
    if (puck.position.y + r >= rink.height - rink.borderWidth) {
        puck.position.y = rink.height - rink.borderWidth - r;
        puck.velocity.y = -Math.abs(puck.velocity.y) * bounceCoeff;
    }

    // Left wall (except goal opening)
    if (puck.position.x - r <= rink.borderWidth) {
        const inGoalY = puck.position.y >= goals[0].opening.y && puck.position.y <= goals[0].opening.y + goals[0].opening.height;
        if (!inGoalY) {
            puck.position.x = rink.borderWidth + r;
            puck.velocity.x = Math.abs(puck.velocity.x) * bounceCoeff;
        }
    }

    // Right wall (except goal opening)
    if (puck.position.x + r >= rink.width - rink.borderWidth) {
        const inGoalY = puck.position.y >= goals[1].opening.y && puck.position.y <= goals[1].opening.y + goals[1].opening.height;
        if (!inGoalY) {
            puck.position.x = rink.width - rink.borderWidth - r;
            puck.velocity.x = -Math.abs(puck.velocity.x) * bounceCoeff;
        }
    }
}

// ── Goalpost Bounce ───────────────────────────────────────────

export function collidePuckWithGoalpost(
    puck: PuckState,
    postCenter: Vec2,
    bounceCoeff: number,
): void {
    const dx = puck.position.x - postCenter.x;
    const dy = puck.position.y - postCenter.y;
    const dist = Math.hypot(dx, dy);
    const postRadius = 4;
    const minDist = puck.radius + postRadius;

    if (dist >= minDist || dist === 0) return;

    const nx = dx / dist;
    const ny = dy / dist;

    // Separate
    const overlap = minDist - dist;
    puck.position.x += nx * overlap;
    puck.position.y += ny * overlap;

    // Reflect velocity
    const dot = puck.velocity.x * nx + puck.velocity.y * ny;
    puck.velocity.x -= 2 * dot * nx;
    puck.velocity.y -= 2 * dot * ny;
    puck.velocity.x *= bounceCoeff;
    puck.velocity.y *= bounceCoeff;
}

// ── Utility ───────────────────────────────────────────────────

export function distance(a: Vec2, b: Vec2): number {
    return Math.hypot(a.x - b.x, a.y - b.y);
}
