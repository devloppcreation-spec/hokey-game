/**
 * GameOverlay Component
 *
 * Renders transparent overlays on top of the game canvas:
 * - Goal celebration
 * - Game over screen with stats + play-again
 */

import type { BrandConfig } from '@/types/brand.types';
import type { GameState } from '@/types/game.types';
import { useGameStore } from '@/store/gameStore';

interface GameOverlayProps {
    state: GameState | null;
    brand: BrandConfig;
    onPlayAgain: () => void;
}

export function GameOverlay({ state, brand, onPlayAgain }: GameOverlayProps) {
    if (!state) return null;

    const c = brand.colors;

    // Goal celebration
    if (state.status === 'goal' && state.lastGoalBy !== null) {
        const scorer = state.players[state.lastGoalBy];
        const pc = state.lastGoalBy === 0 ? c.player1 : c.player2;

        return (
            <div style={overlayBase()}>
                <div style={{
                    fontSize: '4rem',
                    fontWeight: 900,
                    fontFamily: 'var(--font-display), sans-serif',
                    color: pc.primary,
                    textShadow: `0 0 40px ${pc.primary}`,
                    animation: 'goalPulse 0.6s ease-in-out infinite alternate',
                }}>
                    GOAL!
                </div>
                <div style={{
                    fontSize: '1.3rem',
                    color: c.text.primary,
                    marginTop: '0.5rem',
                    opacity: 0.8,
                }}>
                    {scorer.name}
                </div>
                <style>{`
          @keyframes goalPulse {
            from { transform: scale(1); }
            to { transform: scale(1.08); }
          }
        `}</style>
            </div>
        );
    }

    // Game over
    if (state.status === 'ended') {
        const winnerName = state.winner !== null ? state.players[state.winner].name : null;
        const winnerColor = state.winner === 0 ? c.player1.primary
            : state.winner === 1 ? c.player2.primary
                : c.text.primary;

        const handleReturnHome = () => {
            useGameStore.getState().disposeEngine();
            useGameStore.getState().returnToMenu();
        };

        return (
            <div style={overlayBase()}>
                <div style={{
                    background: c.surface,
                    borderRadius: '20px',
                    padding: '2.5rem 3rem',
                    textAlign: 'center',
                    border: `1px solid ${c.scoreboard.border}`,
                    boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
                    maxWidth: '420px',
                    width: '90%',
                }}>
                    <div style={{
                        fontSize: '2.5rem',
                        fontWeight: 900,
                        fontFamily: 'var(--font-display), sans-serif',
                        color: winnerColor,
                        marginBottom: '0.5rem',
                    }}>
                        {winnerName ? `${winnerName} Wins!` : 'Draw!'}
                    </div>

                    {/* Final Score */}
                    <div style={{
                        fontSize: '3rem',
                        fontWeight: 900,
                        fontFamily: 'var(--font-display), sans-serif',
                        color: c.text.primary,
                        margin: '0.5rem 0 1.5rem',
                    }}>
                        <span style={{ color: c.player1.primary }}>{state.scores[0]}</span>
                        <span style={{ opacity: 0.3, margin: '0 0.5rem' }}>–</span>
                        <span style={{ color: c.player2.primary }}>{state.scores[1]}</span>
                    </div>

                    {/* Stats */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto 1fr',
                        gap: '0.4rem 1rem',
                        fontSize: '0.8rem',
                        color: c.text.secondary,
                        marginBottom: '1.5rem',
                    }}>
                        <StatRow label="Goals" v1={state.stats.goals[0]} v2={state.stats.goals[1]} />
                        <StatRow label="Possession" v1={`${Math.round(poss(state, 0))}%`} v2={`${Math.round(poss(state, 1))}%`} />
                        <StatRow label="Play Time" v1={formatTime(state.stats.totalPlayTime)} v2="" />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
                        <button
                            onClick={onPlayAgain}
                            style={{
                                padding: '0.8rem 2.5rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: c.primary,
                                color: c.text.onPrimary,
                                fontWeight: 700,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-primary), sans-serif',
                                width: '100%',
                            }}
                        >
                            Play Again
                        </button>
                        <button
                            onClick={handleReturnHome}
                            style={{
                                padding: '0.7rem 2.5rem',
                                borderRadius: '12px',
                                border: `1px solid ${c.scoreboard.border}`,
                                background: 'transparent',
                                color: c.text.secondary,
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-primary), sans-serif',
                                width: '100%',
                                transition: 'background 0.2s, color 0.2s',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = c.surface;
                                e.currentTarget.style.color = c.text.primary;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = c.text.secondary;
                            }}
                        >
                            Return to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

// ── Helpers ───────────────────────────────────────────────────

function overlayBase(): React.CSSProperties {
    return {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.45)',
        zIndex: 10,
        pointerEvents: 'auto',
    };
}

function StatRow({ label, v1, v2 }: { label: string; v1: string | number; v2: string | number }) {
    return (
        <>
            <div style={{ textAlign: 'right' }}>{v1}</div>
            <div style={{ textAlign: 'center', opacity: 0.5, fontSize: '0.7rem' }}>{label}</div>
            <div style={{ textAlign: 'left' }}>{v2}</div>
        </>
    );
}

function poss(state: GameState, player: number): number {
    const total = state.stats.possession[0] + state.stats.possession[1];
    if (total === 0) return 50;
    return (state.stats.possession[player] / total) * 100;
}

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}
