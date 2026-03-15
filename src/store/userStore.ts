/**
 * User Store
 *
 * Manages player identity state and email collection.
 * Emails are persisted to localStorage for later backend sync.
 */

import { create } from 'zustand';
import type { PlayerInfo } from '@/types/user.types';

interface UserStore {
    player1: PlayerInfo | null;
    player2: PlayerInfo | null;
    collectedEmails: string[];

    setPlayer1: (player: PlayerInfo) => void;
    setPlayer2: (player: PlayerInfo) => void;
    clearPlayers: () => void;

    addEmail: (email: string) => void;
    getCollectedEmails: () => string[];
    clearEmails: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
    player1: null,
    player2: null,
    collectedEmails: JSON.parse(localStorage.getItem('collectedEmails') || '[]'),

    setPlayer1: (player) => {
        set({ player1: player });
        get().addEmail(player.email);
    },

    setPlayer2: (player) => {
        set({ player2: player });
        get().addEmail(player.email);
    },

    clearPlayers: () => set({ player1: null, player2: null }),

    addEmail: (email) => {
        const emails = get().collectedEmails;
        if (!emails.includes(email)) {
            const updated = [...emails, email];
            localStorage.setItem('collectedEmails', JSON.stringify(updated));
            set({ collectedEmails: updated });
        }
    },

    getCollectedEmails: () => get().collectedEmails,

    clearEmails: () => {
        localStorage.removeItem('collectedEmails');
        set({ collectedEmails: [] });
    },
}));
