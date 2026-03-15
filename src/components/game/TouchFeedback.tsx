/**
 * TouchFeedback
 *
 * Renders coloured circles at each active touch/mouse point
 * to give visual feedback on tactile tables.
 * Uses Canvas-relative coordinates for overlay positioning.
 */

import { useState, useEffect, useRef } from 'react';

interface TouchPoint {
    id: number;
    x: number;
    y: number;
    player: 'player1' | 'player2';
}

export function TouchFeedback() {
    const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleTouch = (e: TouchEvent) => {
            const canvas = containerRef.current?.parentElement?.querySelector('canvas');
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();

            const points: TouchPoint[] = [];
            for (let i = 0; i < e.touches.length; i++) {
                const touch = e.touches[i];
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                const player = x < rect.width / 2 ? 'player1' : 'player2';
                points.push({ id: touch.identifier, x, y, player });
            }
            setTouchPoints(points);
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (e.touches.length === 0) {
                setTouchPoints([]);
                return;
            }
            handleTouch(e);
        };

        const handleMouse = (e: MouseEvent) => {
            if (e.buttons === 0) {
                setTouchPoints([]);
                return;
            }
            const canvas = containerRef.current?.parentElement?.querySelector('canvas');
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const player = x < rect.width / 2 ? 'player1' : 'player2';
            setTouchPoints([{ id: -1, x, y, player }]);
        };

        window.addEventListener('touchstart', handleTouch, { passive: true });
        window.addEventListener('touchmove', handleTouch, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });
        window.addEventListener('touchcancel', handleTouchEnd, { passive: true });
        window.addEventListener('mousemove', handleMouse);
        window.addEventListener('mousedown', handleMouse);
        window.addEventListener('mouseup', handleMouse);

        return () => {
            window.removeEventListener('touchstart', handleTouch);
            window.removeEventListener('touchmove', handleTouch);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('touchcancel', handleTouchEnd);
            window.removeEventListener('mousemove', handleMouse);
            window.removeEventListener('mousedown', handleMouse);
            window.removeEventListener('mouseup', handleMouse);
        };
    }, []);

    return (
        <div ref={containerRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 15 }}>
            {touchPoints.map((point) => (
                <div
                    key={point.id}
                    style={{
                        position: 'absolute',
                        left: point.x - 30,
                        top: point.y - 30,
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: point.player === 'player1'
                            ? 'rgba(0, 100, 255, 0.2)'
                            : 'rgba(255, 50, 50, 0.2)',
                        border: `3px solid ${point.player === 'player1' ? 'rgba(0,100,255,0.6)' : 'rgba(255,50,50,0.6)'}`,
                        pointerEvents: 'none',
                        transition: 'left 0.05s linear, top 0.05s linear',
                    }}
                />
            ))}
        </div>
    );
}
