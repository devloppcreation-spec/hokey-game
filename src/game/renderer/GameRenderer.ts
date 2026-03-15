/**
 * Game Renderer – Main Orchestrator
 *
 * Manages the canvas, HiDPI scaling, and draws every frame
 * by delegating to sub-renderers in layer order:
 *   background → rink → entities → effects → UI
 *
 * Reads visual properties from BrandConfig and SportTheme,
 * and invalidates caches when either changes.
 */

import type { BrandConfig } from '@/types/brand.types';
import type { GameState } from '@/types/game.types';
import type { SportTheme } from '@/types/sportTheme.types';

import { RinkRenderer } from './RinkRenderer';
// import { PuckRenderer } from './PuckRenderer'; // Disabled: using React GameBall
// import { PlayerRenderer } from './PlayerRenderer'; // Disabled: using React PlayerPaddle
import { EffectsRenderer } from './EffectsRenderer';
import { UIRenderer } from './UIRenderer';

export class GameRenderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private dpr: number;

    // Sub-renderers
    private rinkRenderer = new RinkRenderer();
    // Disabled: using React-based GameBall component instead of canvas puck rendering
    // private puckRenderer = new PuckRenderer();
    // Disabled: using React-based PlayerPaddle component instead of canvas player rendering
    // private playerRenderer = new PlayerRenderer();
    readonly effects = new EffectsRenderer();
    private uiRenderer = new UIRenderer();

    // Tracking for cache invalidation
    private lastBrandId = '';
    private lastSportId = '';

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.dpr = window.devicePixelRatio || 1;
    }

    // ── Public API ──────────────────────────────────────────

    /**
     * Resize the canvas to fill its container (or explicit size).
     * Handles HiDPI scaling so everything remains sharp.
     */
    resize(width: number, height: number): void {
        this.dpr = window.devicePixelRatio || 1;
        this.canvas.width = width * this.dpr;
        this.canvas.height = height * this.dpr;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

        // Force rink cache rebuild at new resolution
        this.rinkRenderer.invalidateCache();
    }

    /**
     * Draw a single frame. Called from the game loop each tick.
     */
    render(state: GameState, brand: BrandConfig, dt: number, sportTheme?: SportTheme): void {
        const { ctx } = this;
        const { rink } = state;
        const colors = brand.colors;

        // Invalidate caches if brand or sport changed
        const sportId = sportTheme?.id ?? '';
        if (brand.id !== this.lastBrandId || sportId !== this.lastSportId) {
            this.rinkRenderer.invalidateCache();
            this.lastBrandId = brand.id;
            this.lastSportId = sportId;
        }

        // Clear
        ctx.clearRect(0, 0, rink.width, rink.height);

        // Layer 1: Rink / Field (cached) - DISABLED to allow Premium CSS 3D Field to show through
        // this.rinkRenderer.draw(ctx, rink, goals, colors, brand.metadata.companyName, sportTheme);

        // Layer 2: Entities
        // Disabled: using React-based PlayerPaddle component instead of canvas player rendering
        // this.playerRenderer.draw(ctx, state.players[0], colors, brand.gameCustomization.showPlayerTrails, sportTheme);
        // this.playerRenderer.draw(ctx, state.players[1], colors, brand.gameCustomization.showPlayerTrails, sportTheme);

        // Puck / Ball - DISABLED to allow React SVG GameBall to render instead
        // this.puckRenderer.draw(ctx, state.puck, colors, dt, sportTheme);

        // Layer 3: Effects (particles, countdown, flash)
        this.effects.update(dt);
        this.effects.draw(ctx, rink, colors);

        // Layer 4: UI overlay (scoreboard, timer, pause, game over)
        this.uiRenderer.draw(ctx, state, rink, colors, brand.typography);
    }

    /** Force-invalidate all caches (e.g. on brand/sport switch). */
    invalidateAll(): void {
        this.rinkRenderer.invalidateCache();
        this.lastBrandId = '';
        this.lastSportId = '';
    }
}
