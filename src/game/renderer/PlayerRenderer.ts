/**
 * Player Renderer
 *
 * Draws player paddles with sport-specific styles:
 *   stick (hockey), foot (soccer), hand (basketball/volleyball), racket (tennis).
 * Name labels and movement trails are drawn for all sports.
 */

import type { BrandColors } from '@/types/brand.types';
import type { PlayerState } from '@/types/game.types';
import type { SportTheme } from '@/types/sportTheme.types';

export class PlayerRenderer {
    private trailHistory: Map<number, { x: number; y: number }[]> = new Map();
    private readonly TRAIL_LENGTH = 12;

    draw(
        ctx: CanvasRenderingContext2D,
        player: PlayerState,
        colors: BrandColors,
        showTrails: boolean,
        sportTheme?: SportTheme,
    ): void {
        this.updateTrail(player);

        if (showTrails) {
            this.drawTrail(ctx, player, colors, sportTheme);
        }

        this.drawPaddle(ctx, player, colors, sportTheme);
        this.drawLabel(ctx, player, colors);
    }

    // ── Trail ───────────────────────────────────────────────

    private updateTrail(player: PlayerState): void {
        const trail = this.trailHistory.get(player.index) ?? [];
        const speed = Math.hypot(player.velocity.x, player.velocity.y);

        if (speed > 10) {
            trail.push({ x: player.position.x, y: player.position.y });
            if (trail.length > this.TRAIL_LENGTH) trail.shift();
        } else if (trail.length > 0) {
            trail.shift();
        }

        this.trailHistory.set(player.index, trail);
    }

    private drawTrail(
        ctx: CanvasRenderingContext2D,
        player: PlayerState,
        colors: BrandColors,
        sportTheme?: SportTheme,
    ): void {
        const trail = this.trailHistory.get(player.index);
        if (!trail || trail.length < 2) return;

        const pc = player.index === 0 ? colors.player1 : colors.player2;
        const trailColor = sportTheme
            ? (player.index === 0 ? sportTheme.paddle.color1 : sportTheme.paddle.color2)
            : pc.trail;
        const len = trail.length;

        for (let i = 1; i < len; i++) {
            const alpha = (i / len) * 0.3;
            const radius = player.stickRadius * (i / len) * 0.5;
            ctx.fillStyle = trailColor;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(trail[i].x, trail[i].y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    // ── Paddle ──────────────────────────────────────────────

    private drawPaddle(
        ctx: CanvasRenderingContext2D,
        player: PlayerState,
        colors: BrandColors,
        sportTheme?: SportTheme,
    ): void {
        const style = sportTheme?.paddle.style ?? 'stick';

        switch (style) {
            case 'foot':
                this.drawFoot(ctx, player, colors, sportTheme);
                break;
            case 'hand':
                this.drawHand(ctx, player, colors, sportTheme);
                break;
            case 'racket':
                this.drawRacket(ctx, player, colors, sportTheme);
                break;
            case 'stick':
            default:
                this.drawStick(ctx, player, colors, sportTheme);
                break;
        }
    }

    // ── Stick (Hockey) ──────────────────────────────────────

    private drawStick(
        ctx: CanvasRenderingContext2D,
        player: PlayerState,
        colors: BrandColors,
        sportTheme?: SportTheme,
    ): void {
        const { x, y } = player.position;
        const r = player.stickRadius;
        const pc = player.index === 0 ? colors.player1 : colors.player2;
        const primaryColor = sportTheme
            ? (player.index === 0 ? sportTheme.paddle.color1 : sportTheme.paddle.color2)
            : pc.primary;

        // Outer ring
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        // Inner ring
        ctx.fillStyle = pc.secondary;
        ctx.beginPath();
        ctx.arc(x, y, r * 0.65, 0, Math.PI * 2);
        ctx.fill();

        // Stick handle accent
        ctx.fillStyle = pc.stick;
        ctx.beginPath();
        ctx.arc(x, y, r * 0.3, 0, Math.PI * 2);
        ctx.fill();

        this.drawOutline(ctx, x, y, r);
        this.drawHighlight(ctx, x, y, r);
    }

    // ── Foot (Soccer) ───────────────────────────────────────

    private drawFoot(
        ctx: CanvasRenderingContext2D,
        player: PlayerState,
        colors: BrandColors,
        sportTheme?: SportTheme,
    ): void {
        const { x, y } = player.position;
        const r = player.stickRadius;
        const pc = player.index === 0 ? colors.player1 : colors.player2;
        const primaryColor = sportTheme
            ? (player.index === 0 ? sportTheme.paddle.color1 : sportTheme.paddle.color2)
            : pc.primary;

        // Boot shape (slightly elongated circle)
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.ellipse(x, y, r * 1.1, r * 0.85, 0, 0, Math.PI * 2);
        ctx.fill();

        // Sole
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.ellipse(x, y + r * 0.3, r * 0.9, r * 0.2, 0, 0, Math.PI);
        ctx.fill();

        // Laces accent
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        for (let i = -2; i <= 2; i++) {
            ctx.beginPath();
            ctx.moveTo(x + i * 3, y - r * 0.3);
            ctx.lineTo(x + i * 3, y + r * 0.1);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;

        this.drawOutline(ctx, x, y, r);
        this.drawHighlight(ctx, x, y, r);
    }

    // ── Hand (Basketball / Volleyball) ──────────────────────

    private drawHand(
        ctx: CanvasRenderingContext2D,
        player: PlayerState,
        colors: BrandColors,
        sportTheme?: SportTheme,
    ): void {
        const { x, y } = player.position;
        const r = player.stickRadius;
        const pc = player.index === 0 ? colors.player1 : colors.player2;
        const primaryColor = sportTheme
            ? (player.index === 0 ? sportTheme.paddle.color1 : sportTheme.paddle.color2)
            : pc.primary;

        // Palm
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.arc(x, y, r * 0.9, 0, Math.PI * 2);
        ctx.fill();

        // Fingers
        const fingerAngles = [-0.5, -0.25, 0, 0.25, 0.5];
        ctx.fillStyle = primaryColor;
        for (const angle of fingerAngles) {
            const fx = x + Math.sin(angle) * r * 0.5;
            const fy = y - r * 0.7;
            ctx.beginPath();
            ctx.ellipse(fx, fy, r * 0.15, r * 0.35, angle, 0, Math.PI * 2);
            ctx.fill();
        }

        // Wristband
        ctx.fillStyle = pc.secondary;
        ctx.beginPath();
        ctx.ellipse(x, y + r * 0.7, r * 0.5, r * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();

        this.drawOutline(ctx, x, y, r);
        this.drawHighlight(ctx, x, y, r);
    }

    // ── Racket (Tennis) ─────────────────────────────────────

    private drawRacket(
        ctx: CanvasRenderingContext2D,
        player: PlayerState,
        colors: BrandColors,
        sportTheme?: SportTheme,
    ): void {
        const { x, y } = player.position;
        const r = player.stickRadius;
        const pc = player.index === 0 ? colors.player1 : colors.player2;
        const primaryColor = sportTheme
            ? (player.index === 0 ? sportTheme.paddle.color1 : sportTheme.paddle.color2)
            : pc.primary;

        // Head (oval)
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.ellipse(x, y - r * 0.15, r * 0.9, r * 1.1, 0, 0, Math.PI * 2);
        ctx.fill();

        // Strings
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.3;
        const stringR = r * 0.7;
        for (let i = -4; i <= 4; i++) {
            // Vertical
            ctx.beginPath();
            ctx.moveTo(x + i * (stringR / 4), y - r * 0.9);
            ctx.lineTo(x + i * (stringR / 4), y + r * 0.5);
            ctx.stroke();
            // Horizontal
            ctx.beginPath();
            ctx.moveTo(x - stringR, y - r * 0.15 + i * (stringR / 4));
            ctx.lineTo(x + stringR, y - r * 0.15 + i * (stringR / 4));
            ctx.stroke();
        }
        ctx.globalAlpha = 1;

        // Handle
        ctx.fillStyle = pc.stick ?? '#8B4513';
        ctx.fillRect(x - 3, y + r * 0.7, 6, r * 0.5);

        this.drawOutline(ctx, x, y, r);
        this.drawHighlight(ctx, x, y, r);
    }

    // ── Shared drawing helpers ──────────────────────────────

    private drawOutline(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
    }

    private drawHighlight(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        ctx.arc(x - r * 0.2, y - r * 0.2, r * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }

    // ── Label ───────────────────────────────────────────────

    private drawLabel(ctx: CanvasRenderingContext2D, player: PlayerState, colors: BrandColors): void {
        const { x, y } = player.position;
        const r = player.stickRadius;

        ctx.font = `bold 11px var(--font-primary), sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillText(player.name, x + 1, y - r - 5);

        // Text
        ctx.fillStyle = colors.text.primary;
        ctx.fillText(player.name, x, y - r - 6);
    }
}
