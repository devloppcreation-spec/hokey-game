/**
 * Rink Renderer
 *
 * Draws the field/stadium surface. When a sport theme is active
 * the field colors, line colors, and goal style adapt to the theme.
 * Falls back to BrandColors when no sport theme is provided.
 */

import type { BrandColors } from '@/types/brand.types';
import type { RinkDimensions, GoalState } from '@/types/game.types';
import type { SportTheme } from '@/types/sportTheme.types';

export class RinkRenderer {
    private cache: HTMLCanvasElement | null = null;
    private cacheKey = '';

    /**
     * Draw the rink / field. Uses an off-screen cache that is only
     * invalidated when colors or dimensions change.
     */
    draw(
        ctx: CanvasRenderingContext2D,
        rink: RinkDimensions,
        goals: [GoalState, GoalState],
        colors: BrandColors,
        watermarkText?: string,
        sportTheme?: SportTheme,
    ): void {
        const themeId = sportTheme?.id ?? 'none';
        const bg = sportTheme?.field.backgroundColor ?? colors.iceColor;
        const key = `${rink.width}:${rink.height}:${bg}:${themeId}:${colors.primary}`;

        if (!this.cache || this.cacheKey !== key) {
            this.rebuildCache(rink, goals, colors, watermarkText, sportTheme);
            this.cacheKey = key;
        }

        ctx.drawImage(this.cache!, 0, 0);
    }

    invalidateCache(): void {
        this.cache = null;
        this.cacheKey = '';
    }

    // ── Build Cache ─────────────────────────────────────────

    private rebuildCache(
        rink: RinkDimensions,
        goals: [GoalState, GoalState],
        colors: BrandColors,
        watermarkText?: string,
        sportTheme?: SportTheme,
    ): void {
        const canvas = document.createElement('canvas');
        canvas.width = rink.width;
        canvas.height = rink.height;
        const ctx = canvas.getContext('2d')!;

        this.drawSurface(ctx, rink, colors, sportTheme);
        this.drawBoards(ctx, rink, colors, sportTheme);
        this.drawCentreLineAndCircle(ctx, rink, colors, sportTheme);
        this.drawFaceoffSpots(ctx, rink, colors, sportTheme);
        this.drawCreases(ctx, rink, goals, colors, sportTheme);
        this.drawGoals(ctx, goals, colors, sportTheme);

        if (watermarkText) {
            this.drawWatermark(ctx, rink, watermarkText, colors);
        }

        this.cache = canvas;
    }

    // ── Surface ─────────────────────────────────────────────

    private drawSurface(
        ctx: CanvasRenderingContext2D,
        rink: RinkDimensions,
        colors: BrandColors,
        sportTheme?: SportTheme,
    ): void {
        const r = rink.cornerRadius;
        const bgColor = sportTheme?.field.backgroundColor ?? colors.iceColor;

        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(rink.width - r, 0);
        ctx.arcTo(rink.width, 0, rink.width, r, r);
        ctx.lineTo(rink.width, rink.height - r);
        ctx.arcTo(rink.width, rink.height, rink.width - r, rink.height, r);
        ctx.lineTo(r, rink.height);
        ctx.arcTo(0, rink.height, 0, rink.height - r, r);
        ctx.lineTo(0, r);
        ctx.arcTo(0, 0, r, 0, r);
        ctx.closePath();
        ctx.fill();

        // Surface texture pattern
        const patternColor = sportTheme
            ? this.darken(bgColor, 0.08)
            : colors.icePattern;
        ctx.fillStyle = patternColor;
        ctx.globalAlpha = 0.15;

        if (sportTheme?.id === 'soccer' || sportTheme?.id === 'tennis') {
            // Grass-like horizontal lines
            for (let y = 0; y < rink.height; y += 12) {
                ctx.fillRect(0, y, rink.width, 4);
            }
        } else if (sportTheme?.id === 'basketball') {
            // Wood court grain
            for (let y = 0; y < rink.height; y += 8) {
                ctx.fillRect(0, y, rink.width, 1);
            }
            ctx.globalAlpha = 0.06;
            for (let x = 0; x < rink.width; x += 60) {
                ctx.fillRect(x, 0, 2, rink.height);
            }
        } else if (sportTheme?.id === 'volleyball') {
            // Sand dots
            for (let y = 0; y < rink.height; y += 10) {
                for (let x = 0; x < rink.width; x += 10) {
                    ctx.beginPath();
                    ctx.arc(x + Math.random() * 4, y + Math.random() * 4, 1, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        } else {
            // Ice grain (default / hockey)
            for (let y = 0; y < rink.height; y += 6) {
                ctx.fillRect(0, y, rink.width, 1);
            }
        }

        ctx.globalAlpha = 1;
    }

    // ── Boards ──────────────────────────────────────────────

    private drawBoards(
        ctx: CanvasRenderingContext2D,
        rink: RinkDimensions,
        colors: BrandColors,
        sportTheme?: SportTheme,
    ): void {
        const r = rink.cornerRadius;
        const bw = sportTheme?.field.borderWidth ?? rink.borderWidth;
        const borderColor = sportTheme?.field.borderColor ?? colors.lineColor;

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = bw;
        ctx.beginPath();
        ctx.moveTo(r, bw / 2);
        ctx.lineTo(rink.width - r, bw / 2);
        ctx.arcTo(rink.width - bw / 2, bw / 2, rink.width - bw / 2, r, r);
        ctx.lineTo(rink.width - bw / 2, rink.height - r);
        ctx.arcTo(rink.width - bw / 2, rink.height - bw / 2, rink.width - r, rink.height - bw / 2, r);
        ctx.lineTo(r, rink.height - bw / 2);
        ctx.arcTo(bw / 2, rink.height - bw / 2, bw / 2, rink.height - r, r);
        ctx.lineTo(bw / 2, r);
        ctx.arcTo(bw / 2, bw / 2, r, bw / 2, r);
        ctx.closePath();
        ctx.stroke();

        // Goal openings — coloured border on left/right sides (skip at goals)
        const goalLineColor = sportTheme?.goals.color ?? colors.goalColor;
        ctx.strokeStyle = goalLineColor;
        ctx.lineWidth = bw + 2;

        const lGoal = rink.height / 2 - rink.goalWidth / 2;
        const lGoalEnd = rink.height / 2 + rink.goalWidth / 2;

        // Left side
        ctx.beginPath();
        ctx.moveTo(bw / 2, r);
        ctx.lineTo(bw / 2, lGoal);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(bw / 2, lGoalEnd);
        ctx.lineTo(bw / 2, rink.height - r);
        ctx.stroke();

        // Right side
        ctx.beginPath();
        ctx.moveTo(rink.width - bw / 2, r);
        ctx.lineTo(rink.width - bw / 2, lGoal);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(rink.width - bw / 2, lGoalEnd);
        ctx.lineTo(rink.width - bw / 2, rink.height - r);
        ctx.stroke();
    }

    // ── Centre Line & Circle ────────────────────────────────

    private drawCentreLineAndCircle(
        ctx: CanvasRenderingContext2D,
        rink: RinkDimensions,
        colors: BrandColors,
        sportTheme?: SportTheme,
    ): void {
        const cx = rink.centerLineX;
        const cy = rink.height / 2;
        const lineColor = sportTheme?.field.lineColor ?? colors.lineColor;
        const circleColor = sportTheme?.field.centerCircleColor ?? colors.primary;

        // Centre line
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(cx, rink.borderWidth);
        ctx.lineTo(cx, rink.height - rink.borderWidth);
        ctx.stroke();

        // Centre circle
        if (sportTheme?.field.centerLogoEnabled !== false) {
            ctx.strokeStyle = circleColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, cy, rink.centerCircleRadius, 0, Math.PI * 2);
            ctx.stroke();

            // Centre dot
            ctx.fillStyle = circleColor;
            ctx.beginPath();
            ctx.arc(cx, cy, 6, 0, Math.PI * 2);
            ctx.fill();
        }

        // Zone lines
        const zoneColor = sportTheme?.field.lineColor ?? colors.secondary;
        ctx.strokeStyle = zoneColor;
        ctx.lineWidth = 2;
        const zoneLeft = rink.width * 0.3;
        const zoneRight = rink.width * 0.7;

        ctx.beginPath();
        ctx.moveTo(zoneLeft, rink.borderWidth);
        ctx.lineTo(zoneLeft, rink.height - rink.borderWidth);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(zoneRight, rink.borderWidth);
        ctx.lineTo(zoneRight, rink.height - rink.borderWidth);
        ctx.stroke();
    }

    // ── Faceoff Spots ───────────────────────────────────────

    private drawFaceoffSpots(
        ctx: CanvasRenderingContext2D,
        rink: RinkDimensions,
        colors: BrandColors,
        sportTheme?: SportTheme,
    ): void {
        const lineColor = sportTheme?.field.lineColor ?? colors.lineColor;

        for (const spot of rink.faceoffSpots) {
            const isCentre = Math.abs(spot.x - rink.centerLineX) < 1;
            if (!isCentre) {
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(spot.x, spot.y, rink.faceoffCircleRadius, 0, Math.PI * 2);
                ctx.stroke();
            }

            ctx.fillStyle = lineColor;
            ctx.beginPath();
            ctx.arc(spot.x, spot.y, isCentre ? 6 : 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // ── Creases ─────────────────────────────────────────────

    private drawCreases(
        ctx: CanvasRenderingContext2D,
        _rink: RinkDimensions,
        goals: [GoalState, GoalState],
        colors: BrandColors,
        sportTheme?: SportTheme,
    ): void {
        const creaseColor = sportTheme?.goals.glowColor ?? colors.secondary;

        for (const goal of goals) {
            ctx.fillStyle = creaseColor;
            ctx.globalAlpha = 0.18;
            ctx.beginPath();

            if (goal.side === 'left') {
                ctx.arc(goal.creaseCenter.x, goal.creaseCenter.y, goal.creaseRadius, -Math.PI / 2, Math.PI / 2);
            } else {
                ctx.arc(goal.creaseCenter.x, goal.creaseCenter.y, goal.creaseRadius, Math.PI / 2, -Math.PI / 2);
            }

            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;

            // Crease border
            ctx.strokeStyle = creaseColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            if (goal.side === 'left') {
                ctx.arc(goal.creaseCenter.x, goal.creaseCenter.y, goal.creaseRadius, -Math.PI / 2, Math.PI / 2);
            } else {
                ctx.arc(goal.creaseCenter.x, goal.creaseCenter.y, goal.creaseRadius, Math.PI / 2, -Math.PI / 2);
            }
            ctx.stroke();
        }
    }

    // ── Goals ────────────────────────────────────────────────

    private drawGoals(
        ctx: CanvasRenderingContext2D,
        goals: [GoalState, GoalState],
        colors: BrandColors,
        sportTheme?: SportTheme,
    ): void {
        const style = sportTheme?.goals.style ?? 'net';
        const goalColor = sportTheme?.goals.color ?? colors.goalColor;

        for (const goal of goals) {
            const n = goal.net;

            if (style === 'net') {
                // Traditional net (hockey / soccer)
                ctx.fillStyle = 'rgba(0,0,0,0.35)';
                ctx.fillRect(n.x, n.y, n.width, n.height);

                ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                ctx.lineWidth = 0.5;
                const spacing = 6;
                for (let x = n.x; x <= n.x + n.width; x += spacing) {
                    ctx.beginPath();
                    ctx.moveTo(x, n.y);
                    ctx.lineTo(x, n.y + n.height);
                    ctx.stroke();
                }
                for (let y = n.y; y <= n.y + n.height; y += spacing) {
                    ctx.beginPath();
                    ctx.moveTo(n.x, y);
                    ctx.lineTo(n.x + n.width, y);
                    ctx.stroke();
                }
            } else if (style === 'hoop') {
                // Basketball hoop
                const hoopCx = goal.side === 'left'
                    ? goal.opening.x + 6
                    : goal.opening.x + goal.opening.width - 6;
                const hoopCy = goal.opening.y + goal.opening.height / 2;
                const hoopR = 18;

                // Backboard
                ctx.fillStyle = 'rgba(255,255,255,0.6)';
                const bx = goal.side === 'left' ? n.x : n.x + n.width - 4;
                ctx.fillRect(bx, n.y + 4, 4, n.height - 8);

                // Rim
                ctx.strokeStyle = goalColor;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(hoopCx, hoopCy, hoopR, 0, Math.PI * 2);
                ctx.stroke();

                // Net threads
                ctx.strokeStyle = 'rgba(255,255,255,0.25)';
                ctx.lineWidth = 0.5;
                for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
                    ctx.beginPath();
                    ctx.moveTo(hoopCx + Math.cos(a) * hoopR, hoopCy + Math.sin(a) * hoopR);
                    ctx.lineTo(hoopCx + Math.cos(a) * (hoopR - 8), hoopCy + Math.sin(a) * (hoopR - 8) + 14);
                    ctx.stroke();
                }
            } else {
                // Zone (tennis / volleyball) — simple highlighted area
                ctx.fillStyle = goalColor;
                ctx.globalAlpha = 0.12;
                ctx.fillRect(n.x, n.y, n.width, n.height);
                ctx.globalAlpha = 1;

                ctx.strokeStyle = goalColor;
                ctx.lineWidth = 2;
                ctx.setLineDash([6, 4]);
                ctx.strokeRect(n.x, n.y, n.width, n.height);
                ctx.setLineDash([]);
            }

            // Goalposts
            ctx.fillStyle = goalColor;
            const postWidth = 4;
            ctx.fillRect(
                goal.opening.x - (goal.side === 'left' ? 0 : postWidth),
                goal.opening.y - postWidth / 2,
                postWidth,
                postWidth,
            );
            ctx.fillRect(
                goal.opening.x - (goal.side === 'left' ? 0 : postWidth),
                goal.opening.y + goal.opening.height - postWidth / 2,
                postWidth,
                postWidth,
            );

            // Crossbar
            ctx.strokeStyle = goalColor;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(
                goal.opening.x + (goal.side === 'left' ? 0 : goal.opening.width),
                goal.opening.y,
            );
            ctx.lineTo(
                goal.opening.x + (goal.side === 'left' ? 0 : goal.opening.width),
                goal.opening.y + goal.opening.height,
            );
            ctx.stroke();
        }
    }

    // ── Watermark ───────────────────────────────────────────

    private drawWatermark(
        ctx: CanvasRenderingContext2D,
        rink: RinkDimensions,
        text: string,
        colors: BrandColors,
    ): void {
        ctx.save();
        ctx.globalAlpha = 0.06;
        ctx.fillStyle = colors.text.secondary;
        ctx.font = `bold ${rink.width * 0.06}px var(--font-display), sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, rink.width / 2, rink.height / 2);
        ctx.restore();
    }

    // ── Utility ─────────────────────────────────────────────

    private darken(hex: string, amount: number): string {
        const n = parseInt(hex.replace('#', ''), 16);
        const r = Math.max(0, ((n >> 16) & 0xff) - Math.floor(255 * amount));
        const g = Math.max(0, ((n >> 8) & 0xff) - Math.floor(255 * amount));
        const b = Math.max(0, (n & 0xff) - Math.floor(255 * amount));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }
}
