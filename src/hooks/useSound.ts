/**
 * useSound Hook
 *
 * Loads, caches, and plays sound effects from the brand config.
 * Provides mute/volume controls.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { BrandSounds } from '@/types/brand.types';

type SoundName = 'goalHorn' | 'puckHit' | 'crowdCheer' | 'whistle' | 'ambient';

export interface UseSoundReturn {
    play: (name: SoundName) => void;
    stop: (name: SoundName) => void;
    stopAll: () => void;
    muted: boolean;
    toggleMute: () => void;
    setVolume: (v: number) => void;
    volume: number;
}

export function useSound(sounds: BrandSounds): UseSoundReturn {
    const cache = useRef<Map<string, HTMLAudioElement>>(new Map());
    const [muted, setMuted] = useState(!sounds.enabled);
    const [volume, setVolumeState] = useState(0.6);

    // Preload sound files when brand changes
    useEffect(() => {
        const entries: [SoundName, string][] = [
            ['goalHorn', sounds.goalHorn],
            ['puckHit', sounds.puckHit],
            ['crowdCheer', sounds.crowdCheer],
            ['whistle', sounds.whistle],
            ['ambient', sounds.ambient],
        ];

        for (const [name, url] of entries) {
            if (url && !cache.current.has(name)) {
                const audio = new Audio(url);
                audio.preload = 'auto';
                audio.volume = volume;
                cache.current.set(name, audio);
            }
        }

        return () => {
            // Stop all on cleanup
            for (const audio of cache.current.values()) {
                audio.pause();
                audio.currentTime = 0;
            }
            cache.current.clear();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sounds.goalHorn, sounds.puckHit, sounds.crowdCheer, sounds.whistle, sounds.ambient]);

    const play = useCallback((name: SoundName) => {
        if (muted) return;
        const audio = cache.current.get(name);
        if (!audio) return;
        audio.currentTime = 0;
        audio.volume = volume;
        audio.play().catch(() => { /* autoplay blocked, ignore */ });
    }, [muted, volume]);

    const stop = useCallback((name: SoundName) => {
        const audio = cache.current.get(name);
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
    }, []);

    const stopAll = useCallback(() => {
        for (const audio of cache.current.values()) {
            audio.pause();
            audio.currentTime = 0;
        }
    }, []);

    const toggleMute = useCallback(() => {
        setMuted((m) => !m);
    }, []);

    const setVolume = useCallback((v: number) => {
        setVolumeState(Math.max(0, Math.min(1, v)));
        for (const audio of cache.current.values()) {
            audio.volume = v;
        }
    }, []);

    return { play, stop, stopAll, muted, toggleMute, setVolume, volume };
}
