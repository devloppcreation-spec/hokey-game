/**
 * EmailSignIn Component
 *
 * Per-player sign-in form with email input, terms checkbox,
 * and validation. Optimized for touch on large screens.
 */

import { useState } from 'react';
import { TermsAndConditions } from './TermsAndConditions';

interface EmailSignInProps {
    playerNumber: 1 | 2;
    onComplete: (email: string, displayName: string) => void;
}

export function EmailSignIn({ playerNumber, onComplete }: EmailSignInProps) {
    const [email, setEmail] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [error, setError] = useState('');

    const validateEmail = (e: string): boolean => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    };

    const handleSubmit = () => {
        setError('');

        if (!playerName.trim()) {
            setError('Please enter your name');
            return;
        }

        if (!email.trim()) {
            setError('Please enter your email');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!acceptedTerms) {
            setError('Please accept the Terms and Conditions');
            return;
        }

        onComplete(email, playerName);
    };

    const playerColor = playerNumber === 1 ? '#0066cc' : '#cc0000';
    const playerEmoji = playerNumber === 1 ? '🔵' : '🔴';

    return (
        <div
            style={{
                backgroundColor: '#1a1a2e',
                borderRadius: '20px',
                padding: '30px',
                width: '100%',
                maxWidth: '400px',
                border: `3px solid ${playerColor}`,
                boxShadow: `0 8px 32px ${playerColor}22`,
            }}
        >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px', lineHeight: 1 }}>
                    {playerEmoji}
                </div>
                <h2
                    style={{
                        color: 'white',
                        margin: 0,
                        fontSize: '24px',
                        fontFamily: 'var(--font-display), system-ui, sans-serif',
                    }}
                >
                    Player {playerNumber}
                </h2>
                <p
                    style={{
                        color: '#888',
                        margin: '8px 0 0 0',
                        fontSize: '14px',
                        fontFamily: 'var(--font-primary), system-ui, sans-serif',
                    }}
                >
                    Enter your email to play
                </p>
            </div>

            {/* Name input */}
            <div style={{ marginBottom: '15px' }}>
                <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Your Name"
                    style={{
                        width: '100%',
                        padding: '16px',
                        fontSize: '18px',
                        borderRadius: '12px',
                        border: error ? '2px solid #ff4444' : '2px solid #333',
                        backgroundColor: '#0a0a1a',
                        color: 'white',
                        textAlign: 'center',
                        boxSizing: 'border-box',
                        outline: 'none',
                        fontFamily: 'var(--font-primary), system-ui, sans-serif',
                        transition: 'border-color 0.2s ease',
                    }}
                    onFocus={(e) => {
                        if (!error) e.currentTarget.style.borderColor = playerColor;
                    }}
                    onBlur={(e) => {
                        if (!error) e.currentTarget.style.borderColor = '#333';
                    }}
                />
            </div>

            {/* Email input */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    style={{
                        width: '100%',
                        padding: '16px',
                        fontSize: '18px',
                        borderRadius: '12px',
                        border: error ? '2px solid #ff4444' : '2px solid #333',
                        backgroundColor: '#0a0a1a',
                        color: 'white',
                        textAlign: 'center',
                        boxSizing: 'border-box',
                        outline: 'none',
                        fontFamily: 'var(--font-primary), system-ui, sans-serif',
                        transition: 'border-color 0.2s ease',
                    }}
                    onFocus={(e) => {
                        if (!error) e.currentTarget.style.borderColor = playerColor;
                    }}
                    onBlur={(e) => {
                        if (!error) e.currentTarget.style.borderColor = '#333';
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
            </div>

            {/* Terms checkbox */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '20px',
                }}
            >
                <input
                    type="checkbox"
                    id={`terms-${playerNumber}`}
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    style={{
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        accentColor: playerColor,
                        flexShrink: 0,
                    }}
                />
                <label
                    htmlFor={`terms-${playerNumber}`}
                    style={{
                        color: '#ccc',
                        fontSize: '14px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-primary), system-ui, sans-serif',
                    }}
                >
                    I accept the{' '}
                    <span
                        onClick={(e) => {
                            e.preventDefault();
                            setShowTerms(true);
                        }}
                        style={{
                            color: playerColor,
                            textDecoration: 'underline',
                            cursor: 'pointer',
                        }}
                    >
                        Terms and Conditions
                    </span>
                </label>
            </div>

            {/* Error */}
            {error && (
                <p
                    style={{
                        color: '#ff4444',
                        textAlign: 'center',
                        margin: '0 0 16px 0',
                        fontSize: '14px',
                        fontFamily: 'var(--font-primary), system-ui, sans-serif',
                    }}
                >
                    {error}
                </p>
            )}

            {/* Submit */}
            <button
                onClick={handleSubmit}
                style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '18px',
                    fontWeight: 700,
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: playerColor,
                    color: 'white',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-display), system-ui, sans-serif',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    boxShadow: `0 4px 16px ${playerColor}44`,
                }}
            >
                Ready to Play! 🎮
            </button>

            <TermsAndConditions isOpen={showTerms} onClose={() => setShowTerms(false)} />
        </div>
    );
}
