/**
 * Effects Renderer
 *
 * Visual effects: goal celebration (flash + particles),
 * puck hit sparks, and countdown overlay.
 */

import type { BrandColors } from '@/types/brand.types';
import type { RinkDimensions } from '@/types/game.types';

// ── Particle ──────────────────────────────────────────────

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    radius: number;
    color: string;
}

export class EffectsRenderer {
    private particles: Particle[] = [];
    private goalFlashAlpha = 0;
    private countdownValue = 0;
    private countdownAlpha = 0;

    // ── Goal Celebration ────────────────────────────────────

    triggerGoalEffect(x: number, y: number, colors: BrandColors, scoringPlayer: number): void {
        this.goalFlashAlpha = 0.6;
        const pc = scoringPlayer === 0 ? colors.player1 : colors.player2;
        const particleColors = [pc.primary, pc.secondary, colors.accent, '#FFFFFF'];

        for (let i = 0; i < 50; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 100 + Math.random() * 300;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                maxLife: 0.6 + Math.random() * 0.8,
                radius: 2 + Math.random() * 5,
                color: particleColors[Math.floor(Math.random() * particleColors.length)],
            });
        }
    }

    // ── Hit Sparks ──────────────────────────────────────────

    triggerHitSpark(x: number, y: number, colors: BrandColors): void {
        for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 80 + Math.random() * 150;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                maxLife: 0.2 + Math.random() * 0.2,
                radius: 1 + Math.random() * 2.5,
                color: colors.accent,
            });
        }
    }

    // ── Countdown ───────────────────────────────────────────

    setCountdown(value: number): void {
        if (value !== this.countdownValue && value > 0) {
            this.countdownAlpha = 1;
        }
        this.countdownValue = value;
    }

    // ── Update & Draw ───────────────────────────────────────

    update(dt: number): void {
        // Update particles
        this.particles = this.particles.filter((p) => {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += 200 * dt; // gravity
            p.life -= dt / p.maxLife;
            return p.life > 0;
        });

        // Fade out goal flash
        if (this.goalFlashAlpha > 0) {
            this.goalFlashAlpha = Math.max(0, this.goalFlashAlpha - dt * 1.5);
        }

        // Fade countdown
        if (this.countdownAlpha > 0) {
            this.countdownAlpha = Math.max(0, this.countdownAlpha - dt * 0.8);
        }
    }

    draw(ctx: CanvasRenderingContext2D, rink: RinkDimensions, colors: BrandColors): void {
        // Goal flash overlay
        if (this.goalFlashAlpha > 0) {
            ctx.fillStyle = colors.accent;
            ctx.globalAlpha = this.goalFlashAlpha * 0.15;
            ctx.fillRect(0, 0, rink.width, rink.height);
            ctx.globalAlpha = 1;
        }

        // Particles
        for (const p of this.particles) {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Countdown number
        if (this.countdownValue > 0 && this.countdownAlpha > 0) {
            this.drawCountdown(ctx, rink, colors);
        }
    }

    private drawCountdown(ctx: CanvasRenderingContext2D, rink: RinkDimensions, colors: BrandColors): void {
        const cx = rink.width / 2;
        const cy = rink.height / 2;
        const text = this.countdownValue <= 0 ? 'GO!' : String(this.countdownValue);
        const scale = 1 + (1 - this.countdownAlpha) * 0.5; // pop-in effect

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);

        ctx.font = `900 ${rink.width * 0.12}px var(--font-display), sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.globalAlpha = this.countdownAlpha;
        ctx.fillText(text, 3, 3);

        // Text
        ctx.fillStyle = colors.accent;
        ctx.fillText(text, 0, 0);

        ctx.restore();
        ctx.globalAlpha = 1;
    }

    /** Show "GO!" text briefly. */
    triggerGo(): void {
        this.countdownValue = 0;
        this.countdownAlpha = 1.2;
    }
}
