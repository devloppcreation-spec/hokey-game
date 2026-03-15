/**
 * Sport Themes
 *
 * Five visual themes that skin the game as different sports.
 * Gameplay remains identical — only rendering changes.
 */

import type { SportTheme, SportType } from '@/types/sportTheme.types';

export const sportThemes: Record<SportType, SportTheme> = {
    // ── Hockey ──────────────────────────────────────────────
    hockey: {
        id: 'hockey',
        name: 'Ice Hockey',
        icon: '🏒',
        field: {
            backgroundColor: '#e8f4fc',
            lineColor: '#cc0000',
            borderColor: '#8b4513',
            borderWidth: 12,
            centerCircleColor: '#0066cc',
            centerLogoEnabled: true,
        },
        goals: {
            color: '#ff0000',
            glowColor: '#ff6666',
            style: 'net',
            width: 100,
            height: 80,
        },
        ball: {
            shape: 'circle',
            size: 20,
            color: '#1a1a1a',
            pattern: 'solid',
            glowColor: '#ffffff',
            trailColor: '#87ceeb',
            shadow: true,
        },
        paddle: {
            style: 'stick',
            color1: '#0066cc',
            color2: '#cc0000',
        },
        sounds: {
            hitSound: '/sounds/hockey-hit.mp3',
            goalSound: '/sounds/hockey-horn.mp3',
            ambientSound: '/sounds/hockey-crowd.mp3',
        },
    },

    // ── Soccer ──────────────────────────────────────────────
    soccer: {
        id: 'soccer',
        name: 'Football / Soccer',
        icon: '⚽',
        field: {
            backgroundColor: '#2d8a2d',
            lineColor: '#ffffff',
            borderColor: '#1a5c1a',
            borderWidth: 8,
            centerCircleColor: '#ffffff',
            centerLogoEnabled: true,
        },
        goals: {
            color: '#ffffff',
            glowColor: '#ffff00',
            style: 'net',
            width: 120,
            height: 80,
        },
        ball: {
            shape: 'sphere',
            size: 24,
            color: '#ffffff',
            pattern: 'soccer',
            glowColor: '#ffffff',
            trailColor: '#90EE90',
            shadow: true,
        },
        paddle: {
            style: 'foot',
            color1: '#0066cc',
            color2: '#cc0000',
        },
        sounds: {
            hitSound: '/sounds/soccer-kick.mp3',
            goalSound: '/sounds/soccer-goal.mp3',
            ambientSound: '/sounds/soccer-crowd.mp3',
        },
    },

    // ── Basketball ──────────────────────────────────────────
    basketball: {
        id: 'basketball',
        name: 'Basketball',
        icon: '🏀',
        field: {
            backgroundColor: '#c4a055',
            lineColor: '#ffffff',
            borderColor: '#8b6914',
            borderWidth: 6,
            centerCircleColor: '#ff6600',
            centerLogoEnabled: true,
        },
        goals: {
            color: '#ff6600',
            glowColor: '#ffaa00',
            style: 'hoop',
            width: 60,
            height: 60,
        },
        ball: {
            shape: 'sphere',
            size: 28,
            color: '#ff6600',
            pattern: 'basketball',
            glowColor: '#ffaa00',
            trailColor: '#ffd700',
            shadow: true,
        },
        paddle: {
            style: 'hand',
            color1: '#0066cc',
            color2: '#cc0000',
        },
        sounds: {
            hitSound: '/sounds/basketball-bounce.mp3',
            goalSound: '/sounds/basketball-swish.mp3',
            ambientSound: '/sounds/basketball-crowd.mp3',
        },
    },

    // ── Tennis ──────────────────────────────────────────────
    tennis: {
        id: 'tennis',
        name: 'Tennis',
        icon: '🎾',
        field: {
            backgroundColor: '#2e7d32',
            lineColor: '#ffffff',
            borderColor: '#1b5e20',
            borderWidth: 4,
            centerCircleColor: '#ffffff',
            centerLogoEnabled: false,
        },
        goals: {
            color: '#ffffff',
            glowColor: '#ccff00',
            style: 'zone',
            width: 80,
            height: 200,
        },
        ball: {
            shape: 'sphere',
            size: 18,
            color: '#ccff00',
            pattern: 'tennis',
            glowColor: '#ccff00',
            trailColor: '#ccff00',
            shadow: true,
        },
        paddle: {
            style: 'racket',
            color1: '#0066cc',
            color2: '#cc0000',
        },
        sounds: {
            hitSound: '/sounds/tennis-hit.mp3',
            goalSound: '/sounds/tennis-point.mp3',
            ambientSound: '/sounds/tennis-crowd.mp3',
        },
    },

    // ── Volleyball ──────────────────────────────────────────
    volleyball: {
        id: 'volleyball',
        name: 'Volleyball',
        icon: '🏐',
        field: {
            backgroundColor: '#f4d03f',
            lineColor: '#ffffff',
            borderColor: '#d4ac0d',
            borderWidth: 4,
            centerCircleColor: '#ffffff',
            centerLogoEnabled: false,
        },
        goals: {
            color: '#ffffff',
            glowColor: '#ffffff',
            style: 'zone',
            width: 80,
            height: 200,
        },
        ball: {
            shape: 'sphere',
            size: 26,
            color: '#ffffff',
            pattern: 'volleyball',
            glowColor: '#ffffff',
            trailColor: '#ffeaa7',
            shadow: true,
        },
        paddle: {
            style: 'hand',
            color1: '#0066cc',
            color2: '#cc0000',
        },
        sounds: {
            hitSound: '/sounds/volleyball-hit.mp3',
            goalSound: '/sounds/volleyball-point.mp3',
            ambientSound: '/sounds/volleyball-crowd.mp3',
        },
    },
};

export const getSportTheme = (sport: SportType): SportTheme => sportThemes[sport];

export const getAllSportThemes = (): SportTheme[] => Object.values(sportThemes);
