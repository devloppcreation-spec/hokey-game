/**
 * PlayerPaddle Component
 *
 * Renders a mallet/paddle for air hockey (or other sport variants).
 * Uses forwardRef so GameCanvas can manipulate position via direct DOM transforms.
 *
 * Positioning: style.transform is set externally by the rAF loop in GameCanvas.
 * This component only defines the visual appearance and size.
 */

import React, { forwardRef } from 'react';
import './PlayerPaddle.css';

interface PlayerPaddleProps {
    /** Which player this paddle belongs to - used for colour styling */
    player: 'player1' | 'player2';
    /** Whether this paddle is AI-controlled (shows a robot indicator) */
    isAI?: boolean;
    /** Diameter of the paddle in pixels */
    size?: number;
}

export const PlayerPaddle = forwardRef<HTMLDivElement, PlayerPaddleProps>(({
    player,
    isAI = false,
    size = 65,
}, ref) => {
    const isP1 = player === 'player1';

    return (
        <div
            ref={ref}
            className={`player-paddle ${isP1 ? 'p1' : 'p2'}`}
            style={{
                width: size,
                height: size,
            }}
        >
            <div className="paddle-outer" />
            <div className="paddle-inner" />
            <div className="paddle-handle" />
            <div className="paddle-highlight" />
            {isAI && <div className="paddle-ai-badge">🤖</div>}
        </div>
    );
});

PlayerPaddle.displayName = 'PlayerPaddle';
