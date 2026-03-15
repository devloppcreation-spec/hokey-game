/**
 * Corporate Blue Preset
 *
 * Clean, professional navy/slate palette with Inter typography.
 * Ideal for corporate events and branded activations.
 */

import type { BrandConfig } from '@/types/brand.types';

export const corporateBlue: BrandConfig = {
    id: 'preset-corporate-blue',
    name: 'Corporate Blue',
    version: '1.0.0',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',

    colors: {
        primary: '#1E3A5F',
        secondary: '#2563EB',
        accent: '#10B981',
        background: '#0C1220',
        surface: '#162032',

        iceColor: '#EEF2F7',
        icePattern: '#DCE4EE',
        lineColor: '#1E3A5F',
        goalColor: '#2563EB',

        player1: {
            primary: '#1E3A5F',
            secondary: '#60A5FA',
            stick: '#6B7280',
            trail: 'rgba(30,58,95,0.3)',
        },
        player2: {
            primary: '#10B981',
            secondary: '#6EE7B7',
            stick: '#6B7280',
            trail: 'rgba(16,185,129,0.3)',
        },

        text: {
            primary: '#F1F5F9',
            secondary: '#94A3B8',
            accent: '#10B981',
            onPrimary: '#FFFFFF',
            onSecondary: '#FFFFFF',
        },

        scoreboard: {
            background: '#162032',
            text: '#F1F5F9',
            highlight: '#10B981',
            border: '#1E3A5F',
        },

        puck: {
            fill: '#1E293B',
            stroke: '#0F172A',
            glow: 'rgba(37,99,235,0.2)',
        },
    },

    typography: {
        fontFamily: {
            primary: "'Inter', system-ui, sans-serif",
            secondary: "'Inter', system-ui, sans-serif",
            display: "'Poppins', 'Inter', system-ui, sans-serif",
            monospace: "'JetBrains Mono', monospace",
        },
        fontUrls: [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=Poppins:wght@400;600;700;800&display=swap',
        ],
        sizes: {
            xs: '0.7rem', sm: '0.85rem', md: '1rem', lg: '1.2rem',
            xl: '1.4rem', xxl: '1.8rem', display: '3rem', score: '4.5rem',
        },
        weights: { light: 300, regular: 400, medium: 500, bold: 700, black: 800 },
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
        enabled: false, goalHorn: '', puckHit: '',
        crowdCheer: '', whistle: '', ambient: '',
    },

    gameCustomization: {
        playerNames: { player1Default: 'Team A', player2Default: 'Team B' },
        scoreToWin: 7, matchDuration: null, showTimer: true,
        showPlayerTrails: false, celebrationDuration: 2500, intermissionScreens: true,
    },

    metadata: {
        companyName: 'Corporate Blue',
        tagline: 'Professional Gaming Experience',
        copyright: '© 2026 Corporate Blue. All rights reserved.',
        supportUrl: '', termsUrl: '', privacyUrl: '',
    },
};
