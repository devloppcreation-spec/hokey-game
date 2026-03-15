/**
 * Puck Renderer
 *
 * Draws the puck/ball with sport-specific patterns, motion trail,
 * shadow, glow, and spin animation.
 */

import type { BrandColors } from '@/types/brand.types';
import type { PuckState } from '@/types/game.types';
import type { SportTheme } from '@/types/sportTheme.types';

export class PuckRenderer {
    private spinAngle = 0;

    draw(
        ctx: CanvasRenderingContext2D,
        puck: PuckState,
        colors: BrandColors,
        dt: number,
        sportTheme?: SportTheme,
    ): void {
        const speed = Math.hypot(puck.velocity.x, puck.velocity.y);
        this.spinAngle += speed * dt * 0.01;

        this.drawTrail(ctx, puck, colors, sportTheme);
        if (sportTheme?.ball.shadow !== false) {
            this.drawShadow(ctx, puck);
        }
        this.drawBody(ctx, puck, colors, sportTheme);
    }

    // ── Trail ───────────────────────────────────────────────

    private drawTrail(
        ctx: CanvasRenderingContext2D,
        puck: PuckState,
        colors: BrandColors,
        sportTheme?: SportTheme,
    ): void {
        if (puck.trail.length < 2) return;

        const trailColor = sportTheme?.ball.trailColor ?? colors.puck.glow;
        const len = puck.trail.length;

        for (let i = 1; i < len; i++) {
            const alpha = (i / len) * 0.4;
            const radius = puck.radius * (i / len) * 0.7;
            ctx.fillStyle = trailColor;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(puck.trail[i].x, puck.trail[i].y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    // ── Shadow ──────────────────────────────────────────────

    private drawShadow(ctx: CanvasRenderingContext2D, puck: PuckState): void {
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.beginPath();
        ctx.ellipse(
            puck.position.x + 2,
            puck.position.y + 3,
            puck.radius * 1.1,
            puck.radius * 0.6,
            0, 0, Math.PI * 2,
        );
        ctx.fill();
    }

    // ── Body ────────────────────────────────────────────────

    private drawBody(
        ctx: CanvasRenderingContext2D,
        puck: PuckState,
        colors: BrandColors,
        sportTheme?: SportTheme,
    ): void {
        const { x, y } = puck.position;
        const r = puck.radius;
        const ballColor = sportTheme?.ball.color ?? colors.puck.fill;
        const strokeColor = sportTheme ? this.darken(ballColor, 0.2) : colors.puck.stroke;
        const glowColor = sportTheme?.ball.glowColor ?? colors.puck.glow;
        const pattern = sportTheme?.ball.pattern ?? 'solid';

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.spinAngle);

        // Glow at speed
        const speed = Math.hypot(puck.velocity.x, puck.velocity.y);
        if (speed > 50) {
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = Math.min(speed / 30, 18);
        }

        // Main circle
        ctx.fillStyle = ballColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Sport-specific patterns
        ctx.shadowBlur = 0;
        this.drawPattern(ctx, r, pattern, strokeColor);

        ctx.restore();
    }

    // ── Patterns ────────────────────────────────────────────

    private drawPattern(
        ctx: CanvasRenderingContext2D,
        r: number,
        pattern: string,
        lineColor: string,
    ): void {
        ctx.strokeStyle = lineColor;
        ctx.globalAlpha = 0.35;

        switch (pattern) {
            case 'soccer':
                this.drawSoccerPattern(ctx, r);
                break;
            case 'basketball':
                this.drawBasketballPattern(ctx, r);
                break;
            case 'tennis':
                this.drawTennisPattern(ctx, r);
                break;
            case 'volleyball':
                this.drawVolleyballPattern(ctx, r);
                break;
            case 'solid':
            default:
                // Simple cross for spin visibility
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(-r * 0.5, 0);
                ctx.lineTo(r * 0.5, 0);
                ctx.moveTo(0, -r * 0.5);
                ctx.lineTo(0, r * 0.5);
                ctx.stroke();
                break;
        }

        ctx.globalAlpha = 1;
    }

    private drawSoccerPattern(ctx: CanvasRenderingContext2D, r: number): void {
        // Pentagon in center + pentagons around edge
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#333';
        const sides = 5;
        const innerR = r * 0.35;

        // Center pentagon
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
            const px = Math.cos(angle) * innerR;
            const py = Math.sin(angle) * innerR;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        // Outer pentagons (just outlines)
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#333';
        for (let j = 0; j < sides; j++) {
            const centerAngle = (Math.PI * 2 * j) / sides - Math.PI / 2;
            const cx = Math.cos(centerAngle) * r * 0.65;
            const cy = Math.sin(centerAngle) * r * 0.65;
            const tiny = r * 0.22;
            ctx.beginPath();
            for (let i = 0; i < sides; i++) {
                const a = (Math.PI * 2 * i) / sides - Math.PI / 2 + centerAngle;
                const px = cx + Math.cos(a) * tiny;
                const py = cy + Math.sin(a) * tiny;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.stroke();
        }
    }

    private drawBasketballPattern(ctx: CanvasRenderingContext2D, r: number): void {
        // Curved lines
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.45;
        ctx.strokeStyle = '#8B4513';

        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(-r, 0);
        ctx.lineTo(r, 0);
        ctx.stroke();

        // Vertical line
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.lineTo(0, r);
        ctx.stroke();

        // Left curve
        ctx.beginPath();
        ctx.arc(-r * 0.1, 0, r * 0.55, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();

        // Right curve
        ctx.beginPath();
        ctx.arc(r * 0.1, 0, r * 0.55, Math.PI / 2, -Math.PI / 2);
        ctx.stroke();
    }

    private drawTennisPattern(ctx: CanvasRenderingContext2D, r: number): void {
        // Fuzzy texture (seam line)
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = '#fff';

        // Curved seam
        ctx.beginPath();
        ctx.arc(-r * 0.3, 0, r * 0.7, -Math.PI * 0.6, Math.PI * 0.6);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(r * 0.3, 0, r * 0.7, Math.PI * 0.4, Math.PI * 1.6);
        ctx.stroke();
    }

    private drawVolleyballPattern(ctx: CanvasRenderingContext2D, r: number): void {
        // Panel lines (three curved arcs)
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = '#666';

        for (let i = 0; i < 3; i++) {
            const angle = (Math.PI * 2 * i) / 3;
            ctx.beginPath();
            ctx.ellipse(
                0, 0,
                r * 0.9, r * 0.4,
                angle,
                0, Math.PI * 2,
            );
            ctx.stroke();
        }
    }

    // ── Utility ─────────────────────────────────────────────

    private darken(hex: string, amount: number): string {
        const n = parseInt(hex.replace('#', ''), 16);
        if (isNaN(n)) return '#000000';
        const red = Math.max(0, ((n >> 16) & 0xff) - Math.floor(255 * amount));
        const green = Math.max(0, ((n >> 8) & 0xff) - Math.floor(255 * amount));
        const blue = Math.max(0, (n & 0xff) - Math.floor(255 * amount));
        return `#${((red << 16) | (green << 8) | blue).toString(16).padStart(6, '0')}`;
    }
}
