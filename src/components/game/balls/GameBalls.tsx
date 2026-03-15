/**
 * GameBall Component
 *
 * Renders the sport-specific ball / puck.
 * Uses forwardRef so GameCanvas can manipulate position via direct DOM transforms.
 *
 * Positioning: style.transform is set externally by the rAF loop in GameCanvas.
 * This component only defines the visual appearance.
 */

import { forwardRef } from 'react';
import type { SportType } from '@/types/sportTheme.types';
import './GameBalls.css';

interface GameBallProps {
    /** Which sport's ball to render */
    sport: SportType;
    /** Override diameter in pixels (default: 30) */
    size?: number;
}

/**
 * GameBall — selects the correct ball visual based on sport.
 * Position is driven externally via ref.style.transform.
 */
export const GameBall = forwardRef<HTMLDivElement, GameBallProps>(({
    sport,
    size = 30,
}, ref) => {
    const style: React.CSSProperties = {
        width: size,
        height: size,
    };

    switch (sport) {
        case 'basketball':
            return (
                <div ref={ref} className="game-ball basketball" style={style}>
                    <div className="ball-texture" />
                    <div className="ball-lines horizontal" />
                    <div className="ball-lines vertical" />
                    <div className="ball-lines curve-left" />
                    <div className="ball-lines curve-right" />
                </div>
            );
        case 'soccer':
            return (
                <div ref={ref} className="game-ball soccer" style={style}>
                    <div className="soccer-pattern" />
                </div>
            );
        case 'tennis':
            return (
                <div ref={ref} className="game-ball tennis" style={style}>
                    <div className="tennis-nap" />
                    <div className="tennis-line one" />
                    <div className="tennis-line two" />
                </div>
            );
        case 'volleyball':
            return (
                <div ref={ref} className="game-ball volleyball" style={style}>
                    <div className="volleyball-pattern" />
                </div>
            );
        case 'hockey':
        default:
            return (
                <div ref={ref} className="game-ball hockey" style={style}>
                    <div className="puck-inner" />
                    <div className="puck-highlight" />
                </div>
            );
    }
});

GameBall.displayName = 'GameBall';
