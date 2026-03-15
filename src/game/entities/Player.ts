/**
 * Player Entity
 *
 * Creates player state with zone-constrained movement.
 * Player 1 is on the left half, Player 2 on the right half.
 */

import type { PlayerState, PlayerControls, RinkDimensions } from '@/types/game.types';

// ── Default controls ──────────────────────────────────────────

const PLAYER1_CONTROLS: PlayerControls = {
    up: 'KeyW',
    down: 'KeyS',
    left: 'KeyA',
    right: 'KeyD',
};

const PLAYER2_CONTROLS: PlayerControls = {
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight',
};

// ── Factory ───────────────────────────────────────────────────

export function createPlayer(
    index: 0 | 1,
    rink: RinkDimensions,
    stickRadius: number,
    speed: number,
    name?: string,
): PlayerState {
    const padding = stickRadius + rink.borderWidth;
    const halfW = rink.width / 2;
    const cy = rink.height / 2;

    // Zone bounds – each player gets their half plus a small overlap at centre
    const overlap = rink.width * 0.02; // slight centre overlap so sticks can reach
    const zoneBounds =
        index === 0
            ? { minX: padding, maxX: halfW + overlap, minY: padding, maxY: rink.height - padding }
            : { minX: halfW - overlap, maxX: rink.width - padding, minY: padding, maxY: rink.height - padding };

    // Starting positions
    const startX = index === 0 ? halfW * 0.35 : rink.width - halfW * 0.35;

    return {
        index,
        position: { x: startX, y: cy },
        velocity: { x: 0, y: 0 },
        stickRadius,
        speed,
        score: 0,
        name: name ?? (index === 0 ? 'Player 1' : 'Player 2'),
        controls: index === 0 ? { ...PLAYER1_CONTROLS } : { ...PLAYER2_CONTROLS },
        zoneBounds,
    };
}

/** Reset player to their starting position. */
export function resetPlayerPosition(player: PlayerState, rink: RinkDimensions): void {
    const halfW = rink.width / 2;
    const cy = rink.height / 2;
    player.position.x = player.index === 0 ? halfW * 0.35 : rink.width - halfW * 0.35;
    player.position.y = cy;
    player.velocity.x = 0;
    player.velocity.y = 0;
}

/** Clamp a player's position within their zone bounds. */
export function clampPlayerPosition(player: PlayerState): void {
    const { minX, maxX, minY, maxY } = player.zoneBounds;
    player.position.x = Math.max(minX, Math.min(maxX, player.position.x));
    player.position.y = Math.max(minY, Math.min(maxY, player.position.y));
}
