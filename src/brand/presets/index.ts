/**
 * Brand Presets — Barrel Export
 *
 * Re-exports all presets as a typed array for the BrandSwitcher component.
 */

import type { BrandConfig } from '@/types/brand.types';
import { neutralDefault } from './neutralDefault';
import { sportsArenaRed } from './sportsArenaRed';
import { corporateBlue } from './corporateBlue';
import { neonArcade } from './neonArcade';
import { kidsParty } from './kidsParty';

export interface BrandPreset {
    preset: BrandConfig;
    emoji: string;
    description: string;
}

export const brandPresets: BrandPreset[] = [
    {
        preset: neutralDefault,
        emoji: '🎯',
        description: 'Professional blue & gray — clean and balanced.',
    },
    {
        preset: sportsArenaRed,
        emoji: '🏟️',
        description: 'Bold red & black arena — high-energy broadcast feel.',
    },
    {
        preset: corporateBlue,
        emoji: '💼',
        description: 'Navy & slate — ideal for corporate events.',
    },
    {
        preset: neonArcade,
        emoji: '👾',
        description: 'Neon pink, cyan & green — retro arcade vibes.',
    },
    {
        preset: kidsParty,
        emoji: '🎉',
        description: 'Candy colors & fun fonts — perfect for kids.',
    },
];

export { neutralDefault, sportsArenaRed, corporateBlue, neonArcade, kidsParty };
