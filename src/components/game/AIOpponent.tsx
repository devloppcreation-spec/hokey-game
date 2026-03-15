/**
 * AIOpponent Component
 *
 * Visual indicator showing the AI opponent's personality,
 * difficulty badge, and speech-bubble taunts after goals.
 */

import { useState, useEffect } from 'react';
import type { AIDifficulty } from '@/types/gameMode.types';
import { getAIPersonality, getRandomTaunt } from '@/game/ai/AIPersonality';

interface AIOpponentProps {
    difficulty: AIDifficulty;
    lastEvent: 'score' | 'concede' | null;
    /** Pass a value that changes each time an event fires (e.g. score count). */
    eventKey: number;
}

export function AIOpponent({ difficulty, lastEvent, eventKey }: AIOpponentProps) {
    const personality = getAIPersonality(difficulty);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (lastEvent) {
            const taunt = getRandomTaunt(difficulty, lastEvent);
            setMessage(taunt);
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [lastEvent, eventKey, difficulty]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px',
            }}
        >
            {/* AI Avatar */}
            <div style={{ fontSize: '48px', marginBottom: '8px', lineHeight: 1 }}>
                {personality.avatar}
            </div>

            {/* AI Name */}
            <div
                style={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '18px',
                    fontFamily: 'var(--font-display), system-ui, sans-serif',
                }}
            >
                {personality.name}
            </div>

            {/* Difficulty badge */}
            <div
                style={{
                    backgroundColor: getDifficultyColor(difficulty),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    marginTop: '4px',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    fontFamily: 'var(--font-primary), system-ui, sans-serif',
                    letterSpacing: '0.05em',
                }}
            >
                {difficulty}
            </div>

            {/* Speech bubble */}
            {message && (
                <div
                    style={{
                        marginTop: '12px',
                        backgroundColor: '#1a1a2e',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        color: '#ccc',
                        maxWidth: '200px',
                        textAlign: 'center',
                        position: 'relative',
                        animation: 'fadeIn 0.3s ease',
                        fontFamily: 'var(--font-primary), system-ui, sans-serif',
                        fontSize: '14px',
                        border: '1px solid #333',
                    }}
                >
                    {message}
                    {/* Speech bubble arrow */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '-8px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 0,
                            height: 0,
                            borderLeft: '8px solid transparent',
                            borderRight: '8px solid transparent',
                            borderBottom: '8px solid #1a1a2e',
                        }}
                    />
                </div>
            )}
        </div>
    );
}

function getDifficultyColor(difficulty: AIDifficulty): string {
    switch (difficulty) {
        case 'easy':
            return '#22c55e';
        case 'medium':
            return '#eab308';
        case 'hard':
            return '#f97316';
        case 'nightmare':
            return '#dc2626';
    }
}
