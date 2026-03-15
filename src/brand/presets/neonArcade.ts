/**
 * Neon Arcade Preset
 *
 * Vibrant neon pink/cyan/green on deep purple.
 * Retro arcade aesthetic with Press Start 2P display font.
 */

import type { BrandConfig } from '@/types/brand.types';

export const neonArcade: BrandConfig = {
    id: 'preset-neon-arcade',
    name: 'Neon Arcade',
    version: '1.0.0',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',

    colors: {
        primary: '#E91E9C',
        secondary: '#00E5FF',
        accent: '#76FF03',
        background: '#0D0221',
        surface: '#1A0A3E',

        iceColor: '#1A1040',
        icePattern: '#221555',
        lineColor: '#E91E9C',
        goalColor: '#00E5FF',

        player1: {
            primary: '#E91E9C',
            secondary: '#F48FB1',
            stick: '#FFD600',
            trail: 'rgba(233,30,156,0.5)',
        },
        player2: {
            primary: '#00E5FF',
            secondary: '#80DEEA',
            stick: '#FFD600',
            trail: 'rgba(0,229,255,0.5)',
        },

        text: {
            primary: '#FFFFFF',
            secondary: '#B388FF',
            accent: '#76FF03',
            onPrimary: '#FFFFFF',
            onSecondary: '#0D0221',
        },

        scoreboard: {
            background: '#1A0A3E',
            text: '#FFFFFF',
            highlight: '#76FF03',
            border: '#E91E9C',
        },

        puck: {
            fill: '#FFD600',
            stroke: '#FF6F00',
            glow: 'rgba(255,214,0,0.5)',
        },
    },

    typography: {
        fontFamily: {
            primary: "'VT323', monospace",
            secondary: "'Roboto', system-ui, sans-serif",
            display: "'Press Start 2P', cursive",
            monospace: "'VT323', monospace",
        },
        fontUrls: [
            'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Roboto:wght@400;700&display=swap',
        ],
        sizes: {
            xs: '0.7rem', sm: '0.8rem', md: '0.95rem', lg: '1.15rem',
            xl: '1.35rem', xxl: '1.8rem', display: '2.5rem', score: '4rem',
        },
        weights: { light: 400, regular: 400, medium: 400, bold: 700, black: 700 },
    },

    logos: {
        primary: { url: '/logos/logo-primary.svg', width: 200, height: 60 },
        secondary: '/logos/logo-secondary.svg',
        icon: '/logos/icon.svg',
        favicon: '/favicon.svg',
        watermark: '/logos/watermark.svg',
        loading: '/logos/loading.svg',
    },

    assets: {
        iceTexture: '', goalNet: '', rinkBorder: '',
        centerCircle: '', faceoffSpots: '', crowdBackground: '', celebrationEffect: '',
    },

    sounds: {
        enabled: true, goalHorn: 'arcade-goal', puckHit: '8bit-hit',
        crowdCheer: 'pixel-cheer', whistle: 'synth-whistle', ambient: 'chiptune-loop',
    },

    gameCustomization: {
        playerNames: { player1Default: 'P1', player2Default: 'P2' },
        scoreToWin: 10, matchDuration: null, showTimer: false,
        showPlayerTrails: true, celebrationDuration: 3500, intermissionScreens: true,
    },

    metadata: {
        companyName: 'Neon Arcade',
        tagline: 'INSERT COIN ▸▸',
        copyright: '© 2026 Neon Arcade. All rights reserved.',
        supportUrl: '', termsUrl: '', privacyUrl: '',
    },
};
