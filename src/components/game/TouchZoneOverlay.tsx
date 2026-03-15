/**
 * TouchZoneOverlay
 *
 * Visual overlay showing left/right zone boundaries.
 * Useful for setup and debugging on tactile tables.
 * Rendered as an HTML overlay above the canvas so it
 * doesn't interfere with the canvas rendering.
 */

interface TouchZoneOverlayProps {
    showZones: boolean;
    colors?: {
        player1: string;
        player2: string;
    };
}

export function TouchZoneOverlay({ showZones, colors }: TouchZoneOverlayProps) {
    if (!showZones) return null;

    const p1Color = colors?.player1 ?? 'rgba(0, 100, 255, 0.5)';
    const p2Color = colors?.player2 ?? 'rgba(255, 50, 50, 0.5)';

    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                display: 'flex',
                zIndex: 10,
            }}
        >
            {/* Player 1 Zone */}
            <div
                style={{
                    flex: 1,
                    border: `3px dashed ${p1Color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '10px',
                    borderRadius: '20px',
                    transition: 'border-color 0.3s ease',
                }}
            >
                <span
                    style={{
                        color: p1Color,
                        fontSize: '24px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontFamily: 'var(--font-display), system-ui, sans-serif',
                        textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        userSelect: 'none',
                    }}
                >
                    Player 1 Zone
                </span>
            </div>

            {/* Centre Divider */}
            <div
                style={{
                    width: '4px',
                    background: 'linear-gradient(to bottom, transparent 10%, rgba(255,255,255,0.25) 50%, transparent 90%)',
                    borderRadius: '2px',
                }}
            />

            {/* Player 2 Zone */}
            <div
                style={{
                    flex: 1,
                    border: `3px dashed ${p2Color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '10px',
                    borderRadius: '20px',
                    transition: 'border-color 0.3s ease',
                }}
            >
                <span
                    style={{
                        color: p2Color,
                        fontSize: '24px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontFamily: 'var(--font-display), system-ui, sans-serif',
                        textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        userSelect: 'none',
                    }}
                >
                    Player 2 Zone
                </span>
            </div>
        </div>
    );
}
