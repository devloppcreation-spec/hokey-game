/**
 * AIPersonality
 *
 * Flavor text per difficulty level: names, avatars, taunts.
 */

import type { AIDifficulty } from '@/types/gameMode.types';

export interface AIPersonality {
    name: string;
    avatar: string;
    tauntOnScore: string[];
    reactOnConcede: string[];
}

const AI_PERSONALITIES: Record<AIDifficulty, AIPersonality> = {
    easy: {
        name: 'Rookie Bot',
        avatar: '🤖',
        tauntOnScore: [
            'Yay! I got one!',
            'Lucky shot!',
            'Wow, I did it!',
        ],
        reactOnConcede: [
            'Good one!',
            "You're good at this!",
            'Nice shot!',
        ],
    },
    medium: {
        name: 'Training Bot',
        avatar: '🎯',
        tauntOnScore: [
            'Got you!',
            'Point for me!',
            'Keep up!',
        ],
        reactOnConcede: [
            'Not bad!',
            'Lucky...',
            "I'll get the next one!",
        ],
    },
    hard: {
        name: 'Pro Bot',
        avatar: '💪',
        tauntOnScore: [
            'Too easy.',
            "You'll have to do better.",
            'As expected.',
        ],
        reactOnConcede: [
            'Hmm, interesting.',
            "Won't happen again.",
            '...',
        ],
    },
    nightmare: {
        name: 'Nightmare',
        avatar: '💀',
        tauntOnScore: [
            'Pathetic.',
            "Is that all you've got?",
            'Give up.',
        ],
        reactOnConcede: [
            '...',
            'A fluke.',
            'Enjoy it while it lasts.',
        ],
    },
};

export function getAIPersonality(difficulty: AIDifficulty): AIPersonality {
    return AI_PERSONALITIES[difficulty];
}

export function getRandomTaunt(difficulty: AIDifficulty, type: 'score' | 'concede'): string {
    const personality = AI_PERSONALITIES[difficulty];
    const taunts = type === 'score' ? personality.tauntOnScore : personality.reactOnConcede;
    return taunts[Math.floor(Math.random() * taunts.length)];
}
