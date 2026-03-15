/**
 * Color Presets
 *
 * One-click colour themes for the admin panel. Each preset provides
 * a partial BrandColors that is deep-merged into the current brand.
 */

import type { BrandColors } from '@/types/brand.types';

export interface ColorPreset {
    id: string;
    name: string;
    /** Three representative colours shown in the button swatch */
    swatches: [string, string, string];
    /** Partial BrandColors applied on selection */
    colors: Partial<BrandColors>;
}

export const colorPresets: ColorPreset[] = [
    {
        id: 'corporate-blue',
        name: 'Corporate Blue',
        swatches: ['#0066cc', '#004499', '#e8f4fc'],
        colors: {
            primary: '#0066cc',
            secondary: '#004499',
            accent: '#00aaff',
            background: '#0a0a1a',
            iceColor: '#e8f4fc',
            lineColor: '#cc0000',
        },
    },
    {
        id: 'sports-red',
        name: 'Sports Red',
        swatches: ['#cc0000', '#990000', '#1a1a1a'],
        colors: {
            primary: '#cc0000',
            secondary: '#990000',
            accent: '#ff3333',
            background: '#1a0a0a',
            iceColor: '#f0f0f0',
            lineColor: '#0066cc',
        },
    },
    {
        id: 'neon-green',
        name: 'Neon Green',
        swatches: ['#00ff66', '#00cc52', '#0a1a0a'],
        colors: {
            primary: '#00ff66',
            secondary: '#00cc52',
            accent: '#66ff99',
            background: '#0a1a0a',
            iceColor: '#1a2e1a',
            lineColor: '#00ff66',
        },
    },
    {
        id: 'royal-purple',
        name: 'Royal Purple',
        swatches: ['#6600cc', '#4400aa', '#1a1a2e'],
        colors: {
            primary: '#6600cc',
            secondary: '#4400aa',
            accent: '#9933ff',
            background: '#1a0a2e',
            iceColor: '#e8e4fc',
            lineColor: '#ffcc00',
        },
    },
    {
        id: 'sunset-orange',
        name: 'Sunset Orange',
        swatches: ['#ff6600', '#cc5200', '#2a1a0a'],
        colors: {
            primary: '#ff6600',
            secondary: '#cc5200',
            accent: '#ffaa33',
            background: '#2a1a0a',
            iceColor: '#fcf0e8',
            lineColor: '#cc0000',
        },
    },
];
