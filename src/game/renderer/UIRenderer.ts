/**
 * UI Renderer
 *
 * Draws in-game HUD elements: scoreboard, player names,
 * timer, pause overlay, and game-over screen.
 * All styled with brand configuration.
 */

import type { BrandColors, BrandTypography } from '@/types/brand.types';
import type { GameState, RinkDimensions } from '@/types/game.types';

export class UIRenderer {
    draw(
        ctx: CanvasRenderingContext2D,
        state: GameState,
        rink: RinkDimensions,
        colors: BrandColors,
        _typography: BrandTypography,
    ): void {
        // Disabled canvas-based scoreboard and timer — now handled by PremiumScoreboard (HTML)
        // this.drawScoreboard(ctx, state, rink, colors);
        // if (state.matchTimeRemaining !== null && state.status === 'playing') {
        //     this.drawTimer(ctx, state, rink, colors);
        // }

        if (state.status === 'paused') {
            this.drawPauseOverlay(ctx, rink, colors);
        }

        if (state.status === 'ended') {
            this.drawGameOver(ctx, state, rink, colors);
        }
    }

    // ── Scoreboard ──────────────────────────────────────────

    private drawScoreboard(
        ctx: CanvasRenderingContext2D,
        state: GameState,
        rink: RinkDimensions,
        colors: BrandColors,
    ): void {
        const cx = rink.width / 2;
        const sbW = rink.width * 0.32;
        const sbH = rink.height * 0.10;
        const sbY = 12;

        // Background pill
        ctx.fillStyle = colors.scoreboard.background;
        ctx.globalAlpha = 0.88;
        const r = sbH / 2;
        ctx.beginPath();
        ctx.moveTo(cx - sbW / 2 + r, sbY);
        ctx.lineTo(cx + sbW / 2 - r, sbY);
        ctx.arcTo(cx + sbW / 2, sbY, cx + sbW / 2, sbY + r, r);
        ctx.arcTo(cx + sbW / 2, sbY + sbH, cx + sbW / 2 - r, sbY + sbH, r);
        ctx.lineTo(cx - sbW / 2 + r, sbY + sbH);
        ctx.arcTo(cx - sbW / 2, sbY + sbH, cx - sbW / 2, sbY + sbH - r, r);
        ctx.arcTo(cx - sbW / 2, sbY, cx - sbW / 2 + r, sbY, r);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;

        // Border
        ctx.strokeStyle = colors.scoreboard.border;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Centre divider
        ctx.strokeStyle = colors.scoreboard.border;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, sbY + 6);
        ctx.lineTo(cx, sbY + sbH - 6);
        ctx.stroke();

        // Scores
        const scoreFontSize = Math.max(18, sbH * 0.55);
        ctx.font = `900 ${scoreFontSize}px var(--font-display), sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Player 1 score (left)
        ctx.fillStyle = colors.player1.primary;
        ctx.fillText(String(state.scores[0]), cx - sbW * 0.18, sbY + sbH / 2);

        // Player 2 score (right)
        ctx.fillStyle = colors.player2.primary;
        ctx.fillText(String(state.scores[1]), cx + sbW * 0.18, sbY + sbH / 2);

        // Player names
        const nameFontSize = Math.max(9, sbH * 0.22);
        ctx.font = `600 ${nameFontSize}px var(--font-primary), sans-serif`;
        ctx.fillStyle = colors.scoreboard.text;
        ctx.globalAlpha = 0.7;

        ctx.textAlign = 'right';
        ctx.fillText(state.players[0].name, cx - sbW * 0.06, sbY + sbH / 2);

        ctx.textAlign = 'left';
        ctx.fillText(state.players[1].name, cx + sbW * 0.06, sbY + sbH / 2);

        ctx.globalAlpha = 1;
    }

    // ── Timer ───────────────────────────────────────────────

    private drawTimer(
        ctx: CanvasRenderingContext2D,
        state: GameState,
        rink: RinkDimensions,
        colors: BrandColors,
    ): void {
        if (state.matchTimeRemaining === null) return;

        const remaining = Math.max(0, Math.ceil(state.matchTimeRemaining));
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        const text = `${mins}:${secs.toString().padStart(2, '0')}`;

        const cx = rink.width / 2;
        const y = rink.height * 0.10 + 30;

        ctx.font = `700 14px var(--font-monospace), monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = colors.scoreboard.text;
        ctx.globalAlpha = 0.6;
        ctx.fillText(text, cx, y);
        ctx.globalAlpha = 1;
    }

    // ── Pause Overlay ───────────────────────────────────────

    private drawPauseOverlay(
        ctx: CanvasRenderingContext2D,
        rink: RinkDimensions,
        colors: BrandColors,
    ): void {
        // Dim background
        ctx.fillStyle = colors.background;
        ctx.globalAlpha = 0.55;
        ctx.fillRect(0, 0, rink.width, rink.height);
        ctx.globalAlpha = 1;

        const cx = rink.width / 2;
        const cy = rink.height / 2;

        // Pause icon (two bars)
        const barW = rink.width * 0.02;
        const barH = rink.height * 0.12;
        const gap = barW * 1.2;

        ctx.fillStyle = colors.text.primary;
        ctx.globalAlpha = 0.8;
        ctx.fillRect(cx - gap - barW, cy - barH / 2, barW, barH);
        ctx.fillRect(cx + gap, cy - barH / 2, barW, barH);
        ctx.globalAlpha = 1;

        // "PAUSED" text
        ctx.font = `900 ${rink.width * 0.04}px var(--font-display), sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = colors.text.primary;
        ctx.fillText('PAUSED', cx, cy + barH / 2 + 16);

        // Hint
        ctx.font = `400 ${rink.width * 0.015}px var(--font-primary), sans-serif`;
        ctx.fillStyle = colors.text.secondary;
        ctx.fillText('Press Space or Escape to resume', cx, cy + barH / 2 + 16 + rink.width * 0.05);
    }

    // ── Game Over ───────────────────────────────────────────

    private drawGameOver(
        ctx: CanvasRenderingContext2D,
        state: GameState,
        rink: RinkDimensions,
        colors: BrandColors,
    ): void {
        // Dim background
        ctx.fillStyle = colors.background;
        ctx.globalAlpha = 0.65;
        ctx.fillRect(0, 0, rink.width, rink.height);
        ctx.globalAlpha = 1;

        const cx = rink.width / 2;
        const cy = rink.height / 2;

        // Winner text
        const winnerName =
            state.winner !== null ? state.players[state.winner].name : 'Nobody';
        const winnerColor =
            state.winner === 0
                ? colors.player1.primary
                : state.winner === 1
                    ? colors.player2.primary
                    : colors.text.primary;

        ctx.font = `900 ${rink.width * 0.06}px var(--font-display), sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = winnerColor;
        ctx.fillText(`${winnerName} Wins!`, cx, cy - rink.height * 0.06);

        // Final score
        ctx.font = `700 ${rink.width * 0.035}px var(--font-display), sans-serif`;
        ctx.fillStyle = colors.text.primary;
        ctx.fillText(
            `${state.scores[0]} – ${state.scores[1]}`,
            cx,
            cy + rink.height * 0.03,
        );

        // Restart hint
        ctx.font = `400 ${rink.width * 0.018}px var(--font-primary), sans-serif`;
        ctx.fillStyle = colors.text.secondary;
        ctx.fillText('Press Space to play again', cx, cy + rink.height * 0.1);
    }
}
