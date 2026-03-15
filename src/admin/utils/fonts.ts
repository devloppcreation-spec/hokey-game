/**
 * Google Fonts Utility
 *
 * Popular font list, dynamic Google Font loading,
 * and typography preset definitions.
 */

// ── Popular Google Fonts ─────────────────────────────────────

export const popularFonts = [
    // Sans-serif
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Nunito',
    'Raleway',
    'Ubuntu',
    'Outfit',

    // Display / Sports
    'Oswald',
    'Bebas Neue',
    'Anton',
    'Teko',
    'Russo One',
    'Black Ops One',
    'Bungee',
    'Righteous',

    // Serif
    'Playfair Display',
    'Merriweather',
    'Lora',

    // Fun / Arcade
    'Press Start 2P',
    'VT323',
    'Bangers',
    'Fredoka One',
    'Pacifico',

    // Monospace
    'Roboto Mono',
    'Fira Code',
    'JetBrains Mono',
];

// ── System Fonts (skip Google load) ──────────────────────────

const SYSTEM_FONTS = new Set([
    'Arial',
    'Helvetica',
    'Georgia',
    'Times New Roman',
    'Courier New',
    'system-ui',
    'monospace',
    'sans-serif',
    'serif',
]);

// ── Dynamic Font Loader ──────────────────────────────────────

export async function loadGoogleFont(fontFamily: string): Promise<void> {
    if (SYSTEM_FONTS.has(fontFamily)) return;

    const linkId = `google-font-${fontFamily.replace(/\s+/g, '-')}`;
    if (document.getElementById(linkId)) return;

    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;500;600;700;800;900&display=swap`;

    document.head.appendChild(link);

    return new Promise<void>((resolve) => {
        link.onload = () => resolve();
        link.onerror = () => resolve(); // non-blocking
    });
}

// ── Typography Presets ───────────────────────────────────────

export interface TypographyPreset {
    id: string;
    name: string;
    fontFamily: {
        primary: string;
        secondary: string;
        display: string;
        monospace: string;
    };
}

export const typographyPresets: TypographyPreset[] = [
    {
        id: 'modern-sans',
        name: 'Modern Sans',
        fontFamily: {
            primary: 'Inter',
            secondary: 'Inter',
            display: 'Inter',
            monospace: 'JetBrains Mono',
        },
    },
    {
        id: 'sports-bold',
        name: 'Sports Bold',
        fontFamily: {
            primary: 'Roboto',
            secondary: 'Roboto',
            display: 'Oswald',
            monospace: 'Roboto Mono',
        },
    },
    {
        id: 'classic-serif',
        name: 'Classic Serif',
        fontFamily: {
            primary: 'Georgia',
            secondary: 'Georgia',
            display: 'Playfair Display',
            monospace: 'Courier New',
        },
    },
    {
        id: 'retro-arcade',
        name: 'Retro Arcade',
        fontFamily: {
            primary: 'Press Start 2P',
            secondary: 'VT323',
            display: 'Press Start 2P',
            monospace: 'VT323',
        },
    },
    {
        id: 'friendly-round',
        name: 'Friendly Round',
        fontFamily: {
            primary: 'Nunito',
            secondary: 'Nunito',
            display: 'Fredoka One',
            monospace: 'Roboto Mono',
        },
    },
];
