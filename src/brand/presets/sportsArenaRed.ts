/**
 * Sports Arena Red Preset
 *
 * Bold red & black arena theme with Oswald display font.
 * High-energy sports broadcast feel.
 */

import type { BrandConfig } from '@/types/brand.types';

export const sportsArenaRed: BrandConfig = {
    id: 'preset-sports-red',
    name: 'Sports Arena Red',
    version: '1.0.0',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',

    colors: {
        primary: '#B91C1C',
        secondary: '#DC2626',
        accent: '#FBBF24',
        background: '#0A0A0A',
        surface: '#1A1A1A',

        iceColor: '#F0F4F8',
        icePattern: '#DDE6EF',
        lineColor: '#B91C1C',
        goalColor: '#EF4444',

        player1: {
            primary: '#B91C1C',
            secondary: '#FCA5A5',
            stick: '#78350F',
            trail: 'rgba(185,28,28,0.4)',
        },
        player2: {
            primary: '#F5F5F5',
            secondary: '#D4D4D4',
            stick: '#78350F',
            trail: 'rgba(245,245,245,0.3)',
        },

        text: {
            primary: '#FFFFFF',
            secondary: '#A3A3A3',
            accent: '#FBBF24',
            onPrimary: '#FFFFFF',
            onSecondary: '#0A0A0A',
        },

        scoreboard: {
            background: '#1A1A1A',
            text: '#FFFFFF',
            highlight: '#FBBF24',
            border: '#B91C1C',
        },

        puck: {
            fill: '#111111',
            stroke: '#000000',
            glow: 'rgba(185,28,28,0.35)',
        },
    },

    typography: {
        fontFamily: {
            primary: "'Roboto', system-ui, sans-serif",
            secondary: "'Roboto Condensed', system-ui, sans-serif",
            display: "'Oswald', 'Impact', sans-serif",
            monospace: "'JetBrains Mono', monospace",
        },
        fontUrls: [
            'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&family=Roboto+Condensed:wght@400;700&family=Oswald:wght@400;600;700&display=swap',
        ],
        sizes: {
            xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.25rem',
            xl: '1.5rem', xxl: '2.25rem', display: '4rem', score: '5.5rem',
        },
        weights: { light: 300, regular: 400, medium: 500, bold: 700, black: 900 },
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
        enabled: true, goalHorn: 'stadium-horn', puckHit: 'hard-slap',
        crowdCheer: 'roaring-crowd', whistle: 'referee-whistle', ambient: 'arena-buzz',
    },

    gameCustomization: {
        playerNames: { player1Default: 'Home', player2Default: 'Away' },
        scoreToWin: 5, matchDuration: 180, showTimer: true,
        showPlayerTrails: true, celebrationDuration: 4000, intermissionScreens: true,
    },

    metadata: {
        companyName: 'Sports Arena',
        tagline: 'Feel the Roar of the Arena',
        copyright: '© 2026 Sports Arena. All rights reserved.',
        supportUrl: '', termsUrl: '', privacyUrl: '',
    },
};
