/**
 * Goal Entity
 *
 * Goal detection logic: checks whether the puck has fully
 * crossed the goal line within the goal opening.
 */

import type { GoalState, PuckState } from '@/types/game.types';

/**
 * Returns true when the puck is fully inside the goal opening.
 *
 * Left goal: puck centre.x < opening.x + opening.width
 * Right goal: puck centre.x > opening.x
 *
 * For both: puck centre.y must be within the goal height range.
 */
export function isPuckInGoal(puck: PuckState, goal: GoalState): boolean {
    const px = puck.position.x;
    const py = puck.position.y;
    const r = puck.radius;

    const gy1 = goal.opening.y;
    const gy2 = goal.opening.y + goal.opening.height;

    // Puck must be within the vertical extent of the goal opening
    if (py - r < gy1 || py + r > gy2) return false;

    if (goal.side === 'left') {
        // Puck crossed the left goal line
        return px - r <= goal.opening.x + goal.opening.width;
    } else {
        // Puck crossed the right goal line
        return px + r >= goal.opening.x;
    }
}

/**
 * Check if a position (puck) is near a goalpost for bounce physics.
 * Returns the post centre if close, null otherwise.
 */
export function getGoalpostCollision(
    puck: PuckState,
    goal: GoalState,
): { x: number; y: number } | null {
    const px = puck.position.x;
    const py = puck.position.y;
    const r = puck.radius;

    const postRadius = 4; // goalpost visual radius
    const topPost = { x: goal.side === 'left' ? goal.opening.x : goal.opening.x + goal.opening.width, y: goal.opening.y };
    const bottomPost = { x: topPost.x, y: goal.opening.y + goal.opening.height };

    for (const post of [topPost, bottomPost]) {
        const dx = px - post.x;
        const dy = py - post.y;
        const dist = Math.hypot(dx, dy);
        if (dist < r + postRadius) {
            return post;
        }
    }

    return null;
}
