/**
 * GameCanvas Component
 *
 * Canvas element that hosts the game renderer.
 * Handles: engine init on mount, resize, fullscreen, cleanup.
 * Integrates TouchInput for tactile table screens.
 *
 * SMOOTH RENDERING: Ball and paddle positions are updated via direct
 * DOM manipulation (transform) in a requestAnimationFrame loop,
 * bypassing React re-renders for 60fps performance.
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import type { BrandConfig } from '@/types/brand.types';
import type { GameConfig } from '@/types/game.types';
import type { UseGameReturn } from '@/hooks/useGame';
import { TouchInput } from '@/game/TouchInput';
import { TouchZoneOverlay } from './TouchZoneOverlay';
import { TouchFeedback } from './TouchFeedback';
import { PremiumPlayingField } from './PremiumPlayingField';
import { useGameStore } from '@/store/gameStore';
import { GameBall } from '@/components/game/balls/GameBalls';
import { PlayerPaddle } from '@/components/game/PlayerPaddle';

interface GameCanvasProps {
    brand: BrandConfig;
    game: UseGameReturn;
    config?: Partial<GameConfig>;
    playerNames?: [string, string];
    /** Show touch zone overlay (helpful for setup / debugging). */
    showTouchZones?: boolean;
}

const RINK_WIDTH_RATIO = 0.92; // % of container width

export function GameCanvas({ brand: _brand, game, config, playerNames, showTouchZones = false }: GameCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const initDone = useRef(false);
    const touchInputRef = useRef<TouchInput | null>(null);

    // Direct DOM refs for smooth positioning (no React re-render)
    const ballRef = useRef<HTMLDivElement>(null);
    const paddle1Ref = useRef<HTMLDivElement>(null);
    const paddle2Ref = useRef<HTMLDivElement>(null);
    const positionRafRef = useRef<number | null>(null);
    // Cumulative ball rotation angle (degrees)
    const ballRotationRef = useRef<number>(0);

    const currentSport = useGameStore(s => s.currentSport);
    const [canvasSize, setCanvasSize] = useState({ width: 900, height: 450 });

    // Compute rink width from container
    const getRinkWidth = useCallback(() => {
        const el = containerRef.current;
        if (!el) return 900;
        const w = Math.floor(el.clientWidth * RINK_WIDTH_RATIO);
        return w > 100 ? w : 900; // Default to 900 if too small or 0
    }, []);

    // Init engine when canvas mounts
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || initDone.current) return;

        const rinkWidth = getRinkWidth();
        console.log('[GameCanvas] Initializing engine with rinkWidth:', rinkWidth);
        game.init(canvas, rinkWidth, config, playerNames);
        initDone.current = true;

        // Initialise touch input after engine is ready
        if (game.engine) {
            const inputState = game.engine.getInputState();
            touchInputRef.current = new TouchInput(canvas, inputState);
        }

        // Focus canvas for keyboard input
        canvas.focus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Direct-DOM Position Update Loop ──────────────────────────
    // Reads positions from the engine and writes transform directly
    // to DOM refs. This runs at 60fps without triggering React re-renders.
    useEffect(() => {
        const updatePositions = () => {
            const engine = useGameStore.getState().engine;
            if (!engine) {
                positionRafRef.current = requestAnimationFrame(updatePositions);
                return;
            }

            const state = engine.getState();
            const { players, puck } = state;

            // Update paddle 1 position directly
            if (paddle1Ref.current) {
                const p1 = players[0];
                const halfSize = p1.stickRadius;
                paddle1Ref.current.style.transform =
                    `translate(${p1.position.x - halfSize}px, ${p1.position.y - halfSize}px)`;
            }

            // Update paddle 2 position directly
            if (paddle2Ref.current) {
                const p2 = players[1];
                const halfSize = p2.stickRadius;
                paddle2Ref.current.style.transform =
                    `translate(${p2.position.x - halfSize}px, ${p2.position.y - halfSize}px)`;
            }

            // Update ball position + rotation directly
            if (ballRef.current) {
                const ballSize = puck.radius;
                // Compute rotation from velocity (speed → angular velocity in deg/frame)
                const speed = Math.sqrt(puck.velocity.x * puck.velocity.x + puck.velocity.y * puck.velocity.y);
                // ~0.5 degree per unit speed per frame at 60fps
                ballRotationRef.current += speed * 0.15;
                // Keep angle bounded to avoid huge numbers
                if (ballRotationRef.current > 360000) ballRotationRef.current -= 360000;

                ballRef.current.style.transform =
                    `translate(${puck.position.x - ballSize}px, ${puck.position.y - ballSize}px) rotate(${ballRotationRef.current}deg)`;
            }

            positionRafRef.current = requestAnimationFrame(updatePositions);
        };

        positionRafRef.current = requestAnimationFrame(updatePositions);

        return () => {
            if (positionRafRef.current) {
                cancelAnimationFrame(positionRafRef.current);
            }
        };
    }, []);

    // Handle window resize
    useEffect(() => {
        let resizeTimer: ReturnType<typeof setTimeout>;

        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const rinkWidth = getRinkWidth();
                const rinkHeight = rinkWidth * 0.5;
                setCanvasSize({ width: rinkWidth, height: rinkHeight });
                game.resize(rinkWidth, rinkHeight);
                touchInputRef.current?.updateZones();
            }, 100);
        };
        
        onResize();

        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
            clearTimeout(resizeTimer);
        };
    }, [game, getRinkWidth]);

    // Cleanup touch input on unmount
    useEffect(() => {
        return () => {
            touchInputRef.current?.destroy();
        };
    }, []);

    // Fullscreen
    const toggleFullscreen = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            el.requestFullscreen();
        }
    }, []);

    // Prevent default for game keys
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    return (
        <div
            ref={containerRef}
            className="game-canvas-container"
            style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                background: 'transparent',
            }}
        >
            <PremiumPlayingField sport={currentSport} width={canvasSize.width} height={canvasSize.height}>
                <canvas
                    ref={canvasRef}
                    tabIndex={0}
                    style={{
                        outline: 'none',
                        cursor: 'none',
                        maxWidth: '100%',
                        touchAction: 'none',
                        position: 'absolute',
                        inset: 0,
                        zIndex: 10
                    }}
                    onDoubleClick={toggleFullscreen}
                />
                
                {/* Game Objects — positioned via direct DOM transforms, NOT React props */}
                <div className="game-objects" style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 30,
                    pointerEvents: 'none'
                }}>
                    <PlayerPaddle 
                        ref={paddle1Ref}
                        player="player1"
                        isAI={false}
                        size={game.gameState?.players[0]?.stickRadius ? game.gameState.players[0].stickRadius * 2 : 65}
                    />
                    <PlayerPaddle 
                        ref={paddle2Ref}
                        player="player2"
                        isAI={useGameStore.getState().gameMode === 'vs-ai'}
                        size={game.gameState?.players[1]?.stickRadius ? game.gameState.players[1].stickRadius * 2 : 65}
                    />
                    <GameBall 
                        ref={ballRef}
                        sport={currentSport}
                    />
                </div>
            </PremiumPlayingField>
            {/* Touch overlays */}
            <TouchZoneOverlay showZones={showTouchZones} />
            <TouchFeedback />
        </div>
    );
}
