/**
 * Default Brand Configuration
 *
 * A professional neutral brand (blue/gray) used as the baseline.
 * White-label deployments override this with their own config.
 */

import type { BrandConfig } from '@/types/brand.types';

const now = new Date().toISOString();

export const defaultBrand: BrandConfig = {
    id: 'default',
    name: 'Hockey Game',
    version: '1.0.0',
    createdAt: now,
    updatedAt: now,

    // ── Colors ──────────────────────────────────────────────────
    colors: {
        primary: '#1E40AF',
        secondary: '#3B82F6',
        accent: '#F59E0B',
        background: '#0F172A',
        surface: '#1E293B',

        iceColor: '#E8F4FC',
        icePattern: '#D4EAF7',
        lineColor: '#DC2626',
        goalColor: '#EF4444',

        player1: {
            primary: '#DC2626',
            secondary: '#FCA5A5',
            stick: '#92400E',
            trail: 'rgba(220,38,38,0.35)',
        },
        player2: {
            primary: '#2563EB',
            secondary: '#93C5FD',
            stick: '#92400E',
            trail: 'rgba(37,99,235,0.35)',
        },

        text: {
            primary: '#F8FAFC',
            secondary: '#94A3B8',
            accent: '#F59E0B',
            onPrimary: '#FFFFFF',
            onSecondary: '#FFFFFF',
        },

        scoreboard: {
            background: '#1E293B',
            text: '#F8FAFC',
            highlight: '#F59E0B',
            border: '#334155',
        },

        puck: {
            fill: '#1E1E1E',
            stroke: '#000000',
            glow: 'rgba(255,255,255,0.25)',
        },
    },

    // ── Typography ──────────────────────────────────────────────
    typography: {
        fontFamily: {
            primary: "'Inter', system-ui, -apple-system, sans-serif",
            secondary: "'Inter', system-ui, -apple-system, sans-serif",
            display: "'Outfit', 'Inter', system-ui, sans-serif",
            monospace: "'JetBrains Mono', 'Fira Code', monospace",
        },
        fontUrls: [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&family=Outfit:wght@300;400;500;700;900&family=JetBrains+Mono:wght@400;700&display=swap',
        ],
        sizes: {
            xs: '0.75rem',
            sm: '0.875rem',
            md: '1rem',
            lg: '1.25rem',
            xl: '1.5rem',
            xxl: '2rem',
            display: '3.5rem',
            score: '5rem',
        },
        weights: {
            light: 300,
            regular: 400,
            medium: 500,
            bold: 700,
            black: 900,
        },
    },

    // ── Logos ────────────────────────────────────────────────────
    logos: {
        primary: {
            url: '/logos/logo-primary.svg',
            width: 200,
            height: 60,
        },
        secondary: '/logos/logo-secondary.svg',
        icon: '/logos/icon.svg',
        favicon: '/favicon.svg',
        watermark: '/logos/watermark.svg',
        loading: '/logos/loading.svg',
    },

    // ── Assets ──────────────────────────────────────────────────
    assets: {
        iceTexture: '',
        goalNet: '',
        rinkBorder: '',
        centerCircle: '',
        faceoffSpots: '',
        crowdBackground: '',
        celebrationEffect: '',
    },

    // ── Sounds ──────────────────────────────────────────────────
    sounds: {
        enabled: false,
        goalHorn: '',
        puckHit: '',
        crowdCheer: '',
        whistle: '',
        ambient: '',
    },

    // ── Game Customization ──────────────────────────────────────
    gameCustomization: {
        playerNames: {
            player1Default: 'Player 1',
            player2Default: 'Player 2',
        },
        scoreToWin: 7,
        matchDuration: null,
        showTimer: true,
        showPlayerTrails: true,
        celebrationDuration: 3000,
        intermissionScreens: true,
    },

    // ── Metadata ────────────────────────────────────────────────
    metadata: {
        companyName: 'Hockey Game',
        tagline: 'Fast-Paced Two-Player Ice Hockey',
        copyright: `© ${new Date().getFullYear()} Hockey Game. All rights reserved.`,
        supportUrl: '',
        termsUrl: '',
        privacyUrl: '',
    },
};
