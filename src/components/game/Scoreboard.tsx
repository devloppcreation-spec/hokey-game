/**
 * Scoreboard Component
 *
 * Large, readable HTML score display with animated updates.
 * Uses brand colours and typography via CSS variables.
 */

import { useEffect, useRef } from 'react';
import type { BrandConfig } from '@/types/brand.types';
import type { GameState } from '@/types/game.types';

interface ScoreboardProps {
    state: GameState | null;
    brand: BrandConfig;
}

export function Scoreboard({ state, brand }: ScoreboardProps) {
    const p1Ref = useRef<HTMLSpanElement>(null);
    const p2Ref = useRef<HTMLSpanElement>(null);
    const prevScores = useRef<[number, number]>([0, 0]);

    // Animate score change
    useEffect(() => {
        if (!state) return;
        const [s1, s2] = state.scores;
        if (s1 !== prevScores.current[0] && p1Ref.current) {
            p1Ref.current.classList.remove('score-pop');
            void p1Ref.current.offsetWidth; // reflow
            p1Ref.current.classList.add('score-pop');
        }
        if (s2 !== prevScores.current[1] && p2Ref.current) {
            p2Ref.current.classList.remove('score-pop');
            void p2Ref.current.offsetWidth;
            p2Ref.current.classList.add('score-pop');
        }
        prevScores.current = [s1, s2];
    }, [state?.scores[0], state?.scores[1], state]);

    if (!state) return null;

    const c = brand.colors;
    const timer = state.matchTimeRemaining !== null
        ? formatTime(Math.max(0, Math.ceil(state.matchTimeRemaining)))
        : null;

    return (
        <div className="scoreboard" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            padding: '0.75rem 2rem',
            background: c.scoreboard.background,
            borderRadius: '16px',
            border: `1px solid ${c.scoreboard.border}`,
            fontFamily: 'var(--font-display), sans-serif',
            color: c.scoreboard.text,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            userSelect: 'none',
        }}>
            {/* Player 1 */}
            <div style={{ textAlign: 'right', minWidth: '120px' }}>
                <div style={{ fontSize: '0.75rem', opacity: 0.6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {state.players[0].name}
                </div>
                <span
                    ref={p1Ref}
                    style={{
                        fontSize: brand.typography.sizes.score,
                        fontWeight: brand.typography.weights.black,
                        color: c.player1.primary,
                        display: 'inline-block',
                    }}
                >
                    {state.scores[0]}
                </span>
            </div>

            {/* Divider + Timer */}
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 300,
                    opacity: 0.3,
                    lineHeight: 1,
                }}>
                    –
                </div>
                {timer && (
                    <div style={{
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-monospace), monospace',
                        opacity: 0.5,
                        marginTop: '4px',
                    }}>
                        {timer}
                    </div>
                )}
            </div>

            {/* Player 2 */}
            <div style={{ textAlign: 'left', minWidth: '120px' }}>
                <div style={{ fontSize: '0.75rem', opacity: 0.6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {state.players[1].name}
                </div>
                <span
                    ref={p2Ref}
                    style={{
                        fontSize: brand.typography.sizes.score,
                        fontWeight: brand.typography.weights.black,
                        color: c.player2.primary,
                        display: 'inline-block',
                    }}
                >
                    {state.scores[1]}
                </span>
            </div>

            <style>{`
        .score-pop {
          animation: scorePop 0.4s ease-out;
        }
        @keyframes scorePop {
          0% { transform: scale(1); }
          30% { transform: scale(1.35); }
          100% { transform: scale(1); }
        }
      `}</style>
        </div>
    );
}

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}
