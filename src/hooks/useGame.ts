/**
 * useGame Hook
 *
 * Bridges the GameEngine with React state.
 * Provides: game state snapshot, scores, status, and engine controls.
 */

import { useCallback, useEffect, useRef, useMemo } from 'react';
import type { GameState, GameConfig, GameStatus } from '@/types/game.types';
import type { BrandConfig } from '@/types/brand.types';
import type { AIDifficulty } from '@/types/gameMode.types';
import { GameEngine } from '@/game/GameEngine';
import { GameRenderer } from '@/game/renderer/GameRenderer';
import { useGameStore } from '@/store/gameStore';
import { getSportTheme } from '@/themes/sportThemes';

export interface UseGameReturn {
    /** Current game-state snapshot (null before init). */
    gameState: GameState | null;
    status: GameStatus;
    scores: [number, number];
    engine: GameEngine | null;
    renderer: GameRenderer | null;

    /** Initialise engine + renderer. Call after canvas mounts. */
    init: (canvas: HTMLCanvasElement, rinkWidth: number, config?: Partial<GameConfig>, playerNames?: [string, string]) => void;
    start: () => void;
    pause: () => void;
    resume: () => void;
    togglePause: () => void;
    reset: () => void;
    resize: (width: number, height: number) => void;
    initAI: (difficulty: AIDifficulty) => void;
    dispose: () => void;
}

export function useGame(_brand: BrandConfig): UseGameReturn {
    // We use the global store for the engine so it persists across remounts
    const engine = useGameStore(s => s.engine);
    const gameState = useGameStore(s => s.gameState);
    const status = useGameStore(s => s.status);
    const scores = useGameStore(s => s.scores);
    
    // Renderer still lives in the hook as it's tied to a specific canvas
    const rendererRef = useRef<GameRenderer | null>(null);
    const rafRef = useRef<number | null>(null);
    const lastTsRef = useRef(0);

    const currentSport = useGameStore((s) => s.currentSport);

    // Render loop
    const renderLoop = useCallback((timestamp: number) => {
        const renderer = rendererRef.current;
        if (!engine || !renderer) return;

        const dt = (timestamp - lastTsRef.current) / 1000;
        lastTsRef.current = timestamp;

        const sportTheme = getSportTheme(currentSport);
        renderer.render(engine.getState(), _brand, Math.min(dt, 1 / 30), sportTheme);

        rafRef.current = requestAnimationFrame(renderLoop);
    }, [_brand, currentSport, engine]);

    // Init
    const init = useCallback((canvas: HTMLCanvasElement, rinkWidth: number, config?: Partial<GameConfig>, playerNames?: [string, string]) => {
        useGameStore.getState().initEngine(rinkWidth, config, playerNames);
        
        const newEngine = useGameStore.getState().engine!;
        newEngine.attachInput(canvas);

        const renderer = new GameRenderer(canvas);
        const rink = newEngine.getState().rink;
        renderer.resize(rink.width, rink.height);
        rendererRef.current = renderer;
    }, []);

    const start = useCallback(() => {
        const currentEngine = useGameStore.getState().engine;
        if (!currentEngine) return;

        currentEngine.start(true);
        lastTsRef.current = performance.now();
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(renderLoop);
    }, [renderLoop]);

    const pause = useCallback(() => {
        useGameStore.getState().pauseGame();
    }, []);

    const resume = useCallback(() => {
        useGameStore.getState().resumeGame();
    }, []);

    const togglePause = useCallback(() => {
        useGameStore.getState().togglePause();
    }, []);

    const reset = useCallback(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        const currentEngine = useGameStore.getState().engine;
        if (!currentEngine) return;
        currentEngine.start();
        lastTsRef.current = performance.now();
        rafRef.current = requestAnimationFrame(renderLoop);
    }, [renderLoop]);

    const resize = useCallback((width: number, height: number) => {
        useGameStore.getState().resizeRink(width);
        rendererRef.current?.resize(width, height);
        rendererRef.current?.invalidateAll();
    }, []);

    const initAI = useCallback((difficulty: AIDifficulty) => {
        useGameStore.getState().engine?.initAI(difficulty);
    }, []);

    const dispose = useCallback(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        // Note: we DON'T dispose the engine here as it lives in the store
        // It should only be disposed when explicitly requested or when jumping back to menu
    }, []);

    // Cleanup render loop on unmount
    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return useMemo(() => ({
        gameState,
        status,
        scores,
        engine,
        renderer: rendererRef.current,
        init,
        start,
        pause,
        resume,
        togglePause,
        reset,
        resize,
        initAI,
        dispose,
    }), [gameState, status, scores, engine, init, start, pause, resume, togglePause, reset, resize, initAI, dispose]);
}
