/**
 * Default Sounds & Sound Packs
 *
 * Built-in sound options for each slot and themed
 * one-click sound packs. URLs are placeholders —
 * replace with real hosted assets in production.
 */

export interface SoundOption {
    name: string;
    url: string;
}

export const defaultSounds: Record<string, SoundOption[]> = {
    goalHorn: [
        { name: 'Classic Horn', url: '/sounds/goal-horn-classic.mp3' },
        { name: 'Air Horn', url: '/sounds/goal-horn-air.mp3' },
        { name: 'Stadium Horn', url: '/sounds/goal-horn-stadium.mp3' },
        { name: 'Digital', url: '/sounds/goal-horn-digital.mp3' },
    ],
    puckHit: [
        { name: 'Stick Hit', url: '/sounds/puck-hit-stick.mp3' },
        { name: 'Board Hit', url: '/sounds/puck-hit-board.mp3' },
        { name: 'Soft', url: '/sounds/puck-hit-soft.mp3' },
    ],
    whistle: [
        { name: 'Referee', url: '/sounds/whistle-referee.mp3' },
        { name: 'Digital', url: '/sounds/whistle-digital.mp3' },
        { name: 'Short', url: '/sounds/whistle-short.mp3' },
    ],
    crowdCheer: [
        { name: 'Large Arena', url: '/sounds/crowd-large.mp3' },
        { name: 'Small Venue', url: '/sounds/crowd-small.mp3' },
        { name: 'Muted', url: '/sounds/crowd-muted.mp3' },
    ],
    gameOver: [
        { name: 'Fanfare', url: '/sounds/gameover-fanfare.mp3' },
        { name: 'Victory', url: '/sounds/gameover-victory.mp3' },
        { name: 'Simple', url: '/sounds/gameover-simple.mp3' },
    ],
    countdown: [
        { name: 'Beep', url: '/sounds/countdown-beep.mp3' },
        { name: 'Digital', url: '/sounds/countdown-digital.mp3' },
        { name: 'Voice', url: '/sounds/countdown-voice.mp3' },
    ],
};

// ── Sound Packs ──────────────────────────────────────────────

export interface SoundPack {
    name: string;
    description: string;
    sounds: Record<string, string>;
}

export const soundPacks: SoundPack[] = [
    {
        name: 'Classic Sports',
        description: 'Traditional arena sounds',
        sounds: {
            goalHorn: '/sounds/goal-horn-classic.mp3',
            puckHit: '/sounds/puck-hit-stick.mp3',
            whistle: '/sounds/whistle-referee.mp3',
            crowdCheer: '/sounds/crowd-large.mp3',
            gameOver: '/sounds/gameover-fanfare.mp3',
            countdown: '/sounds/countdown-beep.mp3',
        },
    },
    {
        name: 'Arcade',
        description: 'Retro game sounds',
        sounds: {
            goalHorn: '/sounds/arcade-goal.mp3',
            puckHit: '/sounds/arcade-hit.mp3',
            whistle: '/sounds/arcade-whistle.mp3',
            crowdCheer: '/sounds/arcade-crowd.mp3',
            gameOver: '/sounds/arcade-win.mp3',
            countdown: '/sounds/arcade-countdown.mp3',
        },
    },
    {
        name: 'Minimal',
        description: 'Subtle, quiet sounds',
        sounds: {
            goalHorn: '/sounds/minimal-goal.mp3',
            puckHit: '/sounds/minimal-hit.mp3',
            whistle: '/sounds/minimal-whistle.mp3',
            crowdCheer: '',
            gameOver: '/sounds/minimal-end.mp3',
            countdown: '/sounds/minimal-beep.mp3',
        },
    },
    {
        name: 'Party',
        description: 'Fun, energetic sounds',
        sounds: {
            goalHorn: '/sounds/party-goal.mp3',
            puckHit: '/sounds/party-hit.mp3',
            whistle: '/sounds/party-whistle.mp3',
            crowdCheer: '/sounds/party-crowd.mp3',
            gameOver: '/sounds/party-win.mp3',
            countdown: '/sounds/party-countdown.mp3',
        },
    },
];
