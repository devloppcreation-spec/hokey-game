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
