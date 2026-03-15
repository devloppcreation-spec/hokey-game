/**
 * Kids Party Preset
 *
 * Bright, playful candy colors with Fredoka One display font.
 * Fun and inviting for younger audiences and family events.
 */

import type { BrandConfig } from '@/types/brand.types';

export const kidsParty: BrandConfig = {
    id: 'preset-kids-party',
    name: 'Kids Party',
    version: '1.0.0',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',

    colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        accent: '#FFE66D',
        background: '#2D1B69',
        surface: '#3D2B79',

        iceColor: '#E8F8F5',
        icePattern: '#D5F5E3',
        lineColor: '#FF6B6B',
        goalColor: '#FF6B6B',

        player1: {
            primary: '#FF6B6B',
            secondary: '#FFA07A',
            stick: '#8B4513',
            trail: 'rgba(255,107,107,0.4)',
        },
        player2: {
            primary: '#4ECDC4',
            secondary: '#7FDBDA',
            stick: '#8B4513',
            trail: 'rgba(78,205,196,0.4)',
        },

        text: {
            primary: '#FFFFFF',
            secondary: '#C4B5FD',
            accent: '#FFE66D',
            onPrimary: '#FFFFFF',
            onSecondary: '#2D1B69',
        },

        scoreboard: {
            background: '#3D2B79',
            text: '#FFFFFF',
            highlight: '#FFE66D',
            border: '#FF6B6B',
        },

        puck: {
            fill: '#FFE66D',
            stroke: '#F59E0B',
            glow: 'rgba(255,230,109,0.4)',
        },
    },

    typography: {
        fontFamily: {
            primary: "'Nunito', system-ui, sans-serif",
            secondary: "'Nunito', system-ui, sans-serif",
            display: "'Fredoka One', cursive",
            monospace: "'JetBrains Mono', monospace",
        },
        fontUrls: [
            'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;900&family=Fredoka+One&display=swap',
        ],
        sizes: {
            xs: '0.8rem', sm: '0.95rem', md: '1.1rem', lg: '1.35rem',
            xl: '1.6rem', xxl: '2.2rem', display: '3.8rem', score: '5.5rem',
        },
        weights: { light: 300, regular: 400, medium: 600, bold: 700, black: 900 },
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
        enabled: true, goalHorn: 'party-horn', puckHit: 'boing',
        crowdCheer: 'kids-cheering', whistle: 'fun-whistle', ambient: 'happy-music',
    },

    gameCustomization: {
        playerNames: { player1Default: '⭐ Star', player2Default: '🌙 Moon' },
        scoreToWin: 5, matchDuration: null, showTimer: true,
        showPlayerTrails: true, celebrationDuration: 5000, intermissionScreens: true,
    },

    metadata: {
        companyName: 'Kids Party',
        tagline: "Let's Play Hockey! 🏒",
        copyright: '© 2026 Kids Party. All rights reserved.',
        supportUrl: '', termsUrl: '', privacyUrl: '',
    },
};
