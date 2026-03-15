/**
 * Input Handler
 *
 * Tracks keyboard state for smooth movement input.
 * Player 1: WASD (KeyW/KeyA/KeyS/KeyD codes)
 * Player 2: Arrow keys
 * Optional touch support for large touchscreens.
 */

import type { InputState, PlayerState, Vec2 } from '@/types/game.types';

// ── Create / Destroy ──────────────────────────────────────────

export function createInputState(): InputState {
    return {
        keys: new Set<string>(),
        touches: new Map(),
    };
}

export function attachInputListeners(state: InputState, canvas?: HTMLElement): () => void {
    const onKeyDown = (e: KeyboardEvent) => {
        state.keys.add(e.code);
        // Prevent default for game keys to avoid scrolling
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
            e.preventDefault();
        }
    };

    const onKeyUp = (e: KeyboardEvent) => {
        state.keys.delete(e.code);
    };

    // Touch handling for large displays
    const onTouchStart = (e: TouchEvent) => {
        e.preventDefault();
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        for (const touch of Array.from(e.changedTouches)) {
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            const halfWidth = rect.width / 2;
            const playerId = x < halfWidth ? 0 : 1;
            state.touches.set(touch.identifier, { x, y, playerId });
        }
    };

    const onTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        for (const touch of Array.from(e.changedTouches)) {
            const existing = state.touches.get(touch.identifier);
            if (existing) {
                existing.x = touch.clientX - rect.left;
                existing.y = touch.clientY - rect.top;
            }
        }
    };

    const onTouchEnd = (e: TouchEvent) => {
        for (const touch of Array.from(e.changedTouches)) {
            state.touches.delete(touch.identifier);
        }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    if (canvas) {
        canvas.addEventListener('touchstart', onTouchStart, { passive: false });
        canvas.addEventListener('touchmove', onTouchMove, { passive: false });
        canvas.addEventListener('touchend', onTouchEnd);
        canvas.addEventListener('touchcancel', onTouchEnd);
    }

    // Return cleanup
    return () => {
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
        if (canvas) {
            canvas.removeEventListener('touchstart', onTouchStart);
            canvas.removeEventListener('touchmove', onTouchMove);
            canvas.removeEventListener('touchend', onTouchEnd);
            canvas.removeEventListener('touchcancel', onTouchEnd);
        }
    };
}

// ── Movement Computation ──────────────────────────────────────

/**
 * Computes a player's desired velocity vector based on currently
 * pressed keys. Returns normalised direction × speed.
 */
export function getPlayerVelocityFromInput(
    player: PlayerState,
    input: InputState,
): Vec2 {
    let dx = 0;
    let dy = 0;

    if (input.keys.has(player.controls.up)) dy -= 1;
    if (input.keys.has(player.controls.down)) dy += 1;
    if (input.keys.has(player.controls.left)) dx -= 1;
    if (input.keys.has(player.controls.right)) dx += 1;

    // Normalise diagonal movement
    const len = Math.hypot(dx, dy);
    if (len > 0) {
        dx = (dx / len) * player.speed;
        dy = (dy / len) * player.speed;
    }

    return { x: dx, y: dy };
}

/**
 * Computes player velocity from touch input. Uses the touch
 * position as a direct target for the player to move toward.
 */
export function getPlayerVelocityFromTouch(
    player: PlayerState,
    input: InputState,
): Vec2 | null {
    for (const touch of input.touches.values()) {
        if (touch.playerId === player.index) {
            const dx = touch.x - player.position.x;
            const dy = touch.y - player.position.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 5) return { x: 0, y: 0 }; // close enough
            const speed = Math.min(player.speed, dist * 4); // smoothed
            return {
                x: (dx / dist) * speed,
                y: (dy / dist) * speed,
            };
        }
    }
    return null;
}

/** Check if a specific key is currently pressed. */
export function isKeyDown(input: InputState, code: string): boolean {
    return input.keys.has(code);
}
