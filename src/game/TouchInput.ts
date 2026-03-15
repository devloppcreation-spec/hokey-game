/**
 * TouchInput
 *
 * Robust touch/drag control system for large tactile table screens
 * where two players stand on opposite sides.
 *
 * - Screen is split into LEFT (Player 1) and RIGHT (Player 2) zones
 * - Multi-touch: both players can play simultaneously
 * - HiDPI-aware coordinate mapping
 * - Mouse fallback for desktop testing
 * - Integrates with standard InputState.touches so the existing
 *   engine velocity pipeline works unchanged
 */

import type { InputState } from '@/types/game.types';

export interface TouchZone {
    id: 'player1' | 'player2';
    playerId: number;
    bounds: { left: number; right: number; top: number; bottom: number };
    activeTouchId: number | null;
    currentPosition: { x: number; y: number } | null;
}

export class TouchInput {
    private canvas: HTMLCanvasElement;
    private input: InputState;
    private zones: TouchZone[] = [];

    // Bound listeners (for proper removal)
    private boundTouchStart: (e: TouchEvent) => void;
    private boundTouchMove: (e: TouchEvent) => void;
    private boundTouchEnd: (e: TouchEvent) => void;
    private boundMouseDown: (e: MouseEvent) => void;
    private boundMouseMove: (e: MouseEvent) => void;
    private boundMouseUp: (e: MouseEvent) => void;

    // Mouse state
    private mouseZone: TouchZone | null = null;
    private isMouseDown = false;

    constructor(canvas: HTMLCanvasElement, input: InputState) {
        this.canvas = canvas;
        this.input = input;

        // Bind listeners
        this.boundTouchStart = this.handleTouchStart.bind(this);
        this.boundTouchMove = this.handleTouchMove.bind(this);
        this.boundTouchEnd = this.handleTouchEnd.bind(this);
        this.boundMouseDown = this.handleMouseDown.bind(this);
        this.boundMouseMove = this.handleMouseMove.bind(this);
        this.boundMouseUp = this.handleMouseUp.bind(this);

        this.setupZones();
        this.attachListeners();
    }

    // ── Zone Setup ──────────────────────────────────────────

    private setupZones(): void {
        const rect = this.canvas.getBoundingClientRect();
        const centerX = rect.width / 2;

        this.zones = [
            {
                id: 'player1',
                playerId: 0,
                bounds: { left: 0, right: centerX - 10, top: 0, bottom: rect.height },
                activeTouchId: null,
                currentPosition: null,
            },
            {
                id: 'player2',
                playerId: 1,
                bounds: { left: centerX + 10, right: rect.width, top: 0, bottom: rect.height },
                activeTouchId: null,
                currentPosition: null,
            },
        ];
    }

    /** Call when the canvas resizes. */
    updateZones(): void {
        // Keep existing touch state
        const existingTouches = this.zones.map((z) => ({
            id: z.id,
            activeTouchId: z.activeTouchId,
            currentPosition: z.currentPosition,
        }));

        this.setupZones();

        // Restore active touches
        for (const existing of existingTouches) {
            const zone = this.zones.find((z) => z.id === existing.id);
            if (zone) {
                zone.activeTouchId = existing.activeTouchId;
                zone.currentPosition = existing.currentPosition;
            }
        }
    }

    // ── Coordinate Mapping ──────────────────────────────────

    /**
     * Map client (CSS) coordinates to game-world (canvas logical)
     * coordinates, accounting for HiDPI scaling.
     */
    private clientToCanvas(clientX: number, clientY: number): { x: number; y: number } {
        const rect = this.canvas.getBoundingClientRect();
        // CSS pixel position within the element
        const cssX = clientX - rect.left;
        const cssY = clientY - rect.top;

        // Scale to canvas logical size (before DPR scaling)
        const dpr = window.devicePixelRatio || 1;
        const logicalW = this.canvas.width / dpr;
        const logicalH = this.canvas.height / dpr;
        const scaleX = logicalW / rect.width;
        const scaleY = logicalH / rect.height;

        return { x: cssX * scaleX, y: cssY * scaleY };
    }

    /** Returns CSS-relative position for overlay rendering. */
    private clientToCSS(clientX: number, clientY: number): { x: number; y: number } {
        const rect = this.canvas.getBoundingClientRect();
        return { x: clientX - rect.left, y: clientY - rect.top };
    }

    private getZoneForCSS(cssX: number, _cssY: number): TouchZone | null {
        return this.zones.find(
            (z) => cssX >= z.bounds.left && cssX <= z.bounds.right,
        ) ?? null;
    }

    // ── Touch Handlers ──────────────────────────────────────

    private attachListeners(): void {
        this.canvas.style.touchAction = 'none';

        this.canvas.addEventListener('touchstart', this.boundTouchStart, { passive: false });
        this.canvas.addEventListener('touchmove', this.boundTouchMove, { passive: false });
        this.canvas.addEventListener('touchend', this.boundTouchEnd, { passive: false });
        this.canvas.addEventListener('touchcancel', this.boundTouchEnd, { passive: false });

        // Mouse fallback for desktop testing
        this.canvas.addEventListener('mousedown', this.boundMouseDown);
        this.canvas.addEventListener('mousemove', this.boundMouseMove);
        this.canvas.addEventListener('mouseup', this.boundMouseUp);
    }

    private handleTouchStart(e: TouchEvent): void {
        e.preventDefault();

        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const css = this.clientToCSS(touch.clientX, touch.clientY);
            const zone = this.getZoneForCSS(css.x, css.y);

            if (zone && zone.activeTouchId === null) {
                zone.activeTouchId = touch.identifier;
                const pos = this.clientToCanvas(touch.clientX, touch.clientY);
                zone.currentPosition = pos;

                // Write into InputState so the engine sees it
                this.input.touches.set(touch.identifier, {
                    x: pos.x,
                    y: pos.y,
                    playerId: zone.playerId,
                });
            }
        }
    }

    private handleTouchMove(e: TouchEvent): void {
        e.preventDefault();

        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const zone = this.zones.find((z) => z.activeTouchId === touch.identifier);

            if (zone) {
                const pos = this.clientToCanvas(touch.clientX, touch.clientY);
                zone.currentPosition = pos;

                const existing = this.input.touches.get(touch.identifier);
                if (existing) {
                    existing.x = pos.x;
                    existing.y = pos.y;
                }
            }
        }
    }

    private handleTouchEnd(e: TouchEvent): void {
        e.preventDefault();

        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const zone = this.zones.find((z) => z.activeTouchId === touch.identifier);

            if (zone) {
                zone.activeTouchId = null;
                // Keep currentPosition so paddle doesn't jump
                this.input.touches.delete(touch.identifier);
            }
        }
    }

    // ── Mouse Handlers (desktop testing) ────────────────────

    private handleMouseDown(e: MouseEvent): void {
        const css = this.clientToCSS(e.clientX, e.clientY);
        this.mouseZone = this.getZoneForCSS(css.x, css.y);
        this.isMouseDown = true;

        if (this.mouseZone) {
            const pos = this.clientToCanvas(e.clientX, e.clientY);
            this.mouseZone.currentPosition = pos;
            this.input.touches.set(-1, {
                x: pos.x,
                y: pos.y,
                playerId: this.mouseZone.playerId,
            });
        }
    }

    private handleMouseMove(e: MouseEvent): void {
        if (!this.isMouseDown || !this.mouseZone) return;

        const pos = this.clientToCanvas(e.clientX, e.clientY);
        this.mouseZone.currentPosition = pos;

        const existing = this.input.touches.get(-1);
        if (existing) {
            existing.x = pos.x;
            existing.y = pos.y;
        }
    }

    private handleMouseUp(): void {
        this.isMouseDown = false;
        this.mouseZone = null;
        this.input.touches.delete(-1);
    }

    // ── Public Getters ──────────────────────────────────────

    getZones(): ReadonlyArray<TouchZone> {
        return this.zones;
    }

    hasActiveTouch(): boolean {
        return this.zones.some((z) => z.activeTouchId !== null) || this.isMouseDown;
    }

    // ── Cleanup ─────────────────────────────────────────────

    destroy(): void {
        this.canvas.removeEventListener('touchstart', this.boundTouchStart);
        this.canvas.removeEventListener('touchmove', this.boundTouchMove);
        this.canvas.removeEventListener('touchend', this.boundTouchEnd);
        this.canvas.removeEventListener('touchcancel', this.boundTouchEnd);
        this.canvas.removeEventListener('mousedown', this.boundMouseDown);
        this.canvas.removeEventListener('mousemove', this.boundMouseMove);
        this.canvas.removeEventListener('mouseup', this.boundMouseUp);
    }
}
