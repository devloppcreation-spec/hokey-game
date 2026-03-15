/**
 * GameControls Component
 *
 * Control bar: Start, Pause/Resume, Reset, Sound toggle,
 * Fullscreen toggle. Styled with brand colours.
 */

import type { BrandConfig } from '@/types/brand.types';
import type { GameStatus } from '@/types/game.types';

interface GameControlsProps {
    status: GameStatus;
    muted: boolean;
    brand: BrandConfig;
    onPause: () => void;
    onResume: () => void;
    onReset: () => void;
    onToggleMute: () => void;
    onFullscreen: () => void;
}

export function GameControls({
    status,
    muted,
    brand,
    onPause,
    onResume,
    onReset,
    onToggleMute,
    onFullscreen,
}: GameControlsProps) {
    const c = brand.colors;

    const btnBase: React.CSSProperties = {
        padding: '0.6rem 1.4rem',
        borderRadius: '10px',
        border: `1px solid ${c.scoreboard.border}`,
        background: c.surface,
        color: c.text.primary,
        fontFamily: 'var(--font-primary), sans-serif',
        fontWeight: 600,
        fontSize: '0.85rem',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        userSelect: 'none',
    };

    const primaryBtn: React.CSSProperties = {
        ...btnBase,
        background: c.primary,
        color: c.text.onPrimary,
        border: 'none',
        padding: '0.7rem 2rem',
        fontSize: '0.95rem',
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            flexWrap: 'wrap',
        }}>
            {/* Pause / Resume */}
            {status === 'playing' && (
                <button style={btnBase} onClick={onPause}>
                    ⏸ Pause
                </button>
            )}
            {status === 'paused' && (
                <button style={primaryBtn} onClick={onResume}>
                    ▶ Resume
                </button>
            )}

            {/* Reset */}
            {status !== 'idle' && (
                <button style={btnBase} onClick={onReset}>
                    ↺ Reset
                </button>
            )}

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Sound */}
            <button
                style={{ ...btnBase, fontSize: '1rem', padding: '0.6rem 0.8rem' }}
                onClick={onToggleMute}
                title={muted ? 'Unmute' : 'Mute'}
            >
                {muted ? '🔇' : '🔊'}
            </button>

            {/* Fullscreen */}
            <button
                style={{ ...btnBase, fontSize: '1rem', padding: '0.6rem 0.8rem' }}
                onClick={onFullscreen}
                title="Fullscreen"
            >
                ⛶
            </button>
        </div>
    );
}
