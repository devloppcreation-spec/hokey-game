/**
 * Rink Entity
 *
 * Defines the full hockey rink layout with scalable proportions.
 * All measurements are computed from a base width/height so the
 * rink can be rendered at any resolution.
 */

import type { RinkDimensions, GoalState, Vec2 } from '@/types/game.types';

// ── Default proportions (relative to rink width) ──────────────

const ASPECT_RATIO = 0.5; // height = width * 0.5  (wide rink)
const CORNER_RADIUS_RATIO = 0.06;
const BORDER_WIDTH = 4;
const CENTER_CIRCLE_RATIO = 0.09;
const FACEOFF_CIRCLE_RATIO = 0.07;
const GOAL_WIDTH_RATIO = 0.20;
const GOAL_DEPTH_RATIO = 0.04;
const CREASE_RADIUS_RATIO = 0.06;
const FACEOFF_X_RATIO = 0.25; // distance from centre
const FACEOFF_Y_RATIO = 0.28; // distance from centre vertically

// ── Create Rink ───────────────────────────────────────────────

export function createRink(width: number): RinkDimensions {
    const height = width * ASPECT_RATIO;
    const cx = width / 2;
    const cy = height / 2;

    const faceoffSpots: Vec2[] = [
        // top-left & bottom-left
        { x: cx - width * FACEOFF_X_RATIO, y: cy - height * FACEOFF_Y_RATIO },
        { x: cx - width * FACEOFF_X_RATIO, y: cy + height * FACEOFF_Y_RATIO },
        // top-right & bottom-right
        { x: cx + width * FACEOFF_X_RATIO, y: cy - height * FACEOFF_Y_RATIO },
        { x: cx + width * FACEOFF_X_RATIO, y: cy + height * FACEOFF_Y_RATIO },
        // centre
        { x: cx, y: cy },
    ];

    return {
        width,
        height,
        cornerRadius: width * CORNER_RADIUS_RATIO,
        borderWidth: BORDER_WIDTH,
        centerCircleRadius: width * CENTER_CIRCLE_RATIO,
        centerLineX: cx,
        faceoffCircleRadius: width * FACEOFF_CIRCLE_RATIO,
        faceoffSpots,
        goalWidth: height * GOAL_WIDTH_RATIO,
        goalDepth: width * GOAL_DEPTH_RATIO,
        creaseRadius: width * CREASE_RADIUS_RATIO,
    };
}

// ── Create Goals ──────────────────────────────────────────────

export function createGoals(rink: RinkDimensions): [GoalState, GoalState] {
    const goalHalfH = rink.goalWidth / 2;
    const cy = rink.height / 2;

    const leftGoal: GoalState = {
        side: 'left',
        opening: {
            x: 0,
            y: cy - goalHalfH,
            width: rink.borderWidth,
            height: rink.goalWidth,
        },
        net: {
            x: -rink.goalDepth,
            y: cy - goalHalfH,
            width: rink.goalDepth,
            height: rink.goalWidth,
        },
        creaseCenter: { x: 0, y: cy },
        creaseRadius: rink.creaseRadius,
    };

    const rightGoal: GoalState = {
        side: 'right',
        opening: {
            x: rink.width - rink.borderWidth,
            y: cy - goalHalfH,
            width: rink.borderWidth,
            height: rink.goalWidth,
        },
        net: {
            x: rink.width,
            y: cy - goalHalfH,
            width: rink.goalDepth,
            height: rink.goalWidth,
        },
        creaseCenter: { x: rink.width, y: cy },
        creaseRadius: rink.creaseRadius,
    };

    return [leftGoal, rightGoal];
}
