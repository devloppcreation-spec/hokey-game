/**
 * DualPlayerSignIn Component
 *
 * Side-by-side sign-in for 1v1 mode on large tactile tables.
 * Both players must enter emails and accept terms before playing.
 */

import { useState } from 'react';
import { EmailSignIn } from './EmailSignIn';
import { useGameStore } from '@/store/gameStore';
import type { PlayerInfo } from '@/types/user.types';

interface DualPlayerSignInProps {
    onBothPlayersReady: (player1: PlayerInfo, player2: PlayerInfo) => void;
}

export function DualPlayerSignIn({ onBothPlayersReady }: DualPlayerSignInProps) {
    const [player1, setPlayer1] = useState<PlayerInfo | null>(null);
    const [player2, setPlayer2] = useState<PlayerInfo | null>(null);

    const handlePlayer1Complete = (email: string, displayName: string) => {
        const info: PlayerInfo = { email, displayName, playerNumber: 1 };
        setPlayer1(info);
        if (player2) {
            onBothPlayersReady(info, player2);
        }
        useGameStore.getState().setPlayer1Ready(true);
    };

    const handlePlayer2Complete = (email: string, displayName: string) => {
        const info: PlayerInfo = { email, displayName, playerNumber: 2 };
        setPlayer2(info);
        if (player1) {
            onBothPlayersReady(player1, info);
        }
        useGameStore.getState().setPlayer2Ready(true);
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: '#0a0a1a',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
            }}
        >
            {/* Title */}
            <h1
                style={{
                    color: 'white',
                    fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                    marginBottom: '40px',
                    textAlign: 'center',
                    fontFamily: 'var(--font-display), system-ui, sans-serif',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                }}
            >
                🏒 Enter Your Details to Play
            </h1>

            {/* Back Button */}
            <button 
                onClick={() => useGameStore.getState().goBack()}
                style={{
                    position: 'absolute',
                    top: '30px',
                    left: '30px',
                    padding: '12px 24px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '30px',
                    color: 'white',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                }}
            >
                ← Back
            </button>

            {/* Player Forms */}
            <div
                style={{
                    display: 'flex',
                    gap: '40px',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    width: '100%',
                    maxWidth: '900px',
                }}
            >
                {/* Player 1 */}
                <div
                    style={{
                        flex: 1,
                        minWidth: '300px',
                        maxWidth: '400px',
                        opacity: player1 ? 0.6 : 1,
                        transition: 'opacity 0.3s ease',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    {player1 ? (
                        <ReadyCard displayName={player1.displayName} color="#0066cc" />
                    ) : (
                        <EmailSignIn playerNumber={1} onComplete={handlePlayer1Complete} />
                    )}
                </div>

                {/* Player 2 */}
                <div
                    style={{
                        flex: 1,
                        minWidth: '300px',
                        maxWidth: '400px',
                        opacity: player2 ? 0.6 : 1,
                        transition: 'opacity 0.3s ease',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    {player2 ? (
                        <ReadyCard displayName={player2.displayName} color="#cc0000" />
                    ) : (
                        <EmailSignIn playerNumber={2} onComplete={handlePlayer2Complete} />
                    )}
                </div>
            </div>

            {/* Both ready message */}
            {player1 && player2 && (
                <div
                    style={{
                        marginTop: '40px',
                        textAlign: 'center',
                        animation: 'fadeIn 0.5s ease',
                    }}
                >
                    <p
                        style={{
                            color: '#4ade80',
                            fontSize: '24px',
                            fontFamily: 'var(--font-display), system-ui, sans-serif',
                            fontWeight: 700,
                        }}
                    >
                        ✨ Both players ready! Starting game...
                    </p>
                </div>
            )}
        </div>
    );
}

// ── Ready Card ────────────────────────────────────────────────

function ReadyCard({ displayName, color }: { displayName: string; color: string }) {
    return (
        <div
            style={{
                backgroundColor: '#1a1a2e',
                borderRadius: '20px',
                padding: '30px',
                border: `3px solid ${color}`,
                textAlign: 'center',
                width: '100%',
                maxWidth: '400px',
            }}
        >
            <div style={{ fontSize: '48px', marginBottom: '12px', lineHeight: 1 }}>✅</div>
            <h3
                style={{
                    color: 'white',
                    margin: '0 0 8px 0',
                    fontSize: '1.2rem',
                    fontFamily: 'var(--font-display), system-ui, sans-serif',
                }}
            >
                {displayName}
            </h3>
            <p
                style={{
                    color: '#888',
                    margin: 0,
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-primary), system-ui, sans-serif',
                }}
            >
                Ready!
            </p>
        </div>
    );
}
