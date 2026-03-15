/**
 * Brand Configuration Type System
 *
 * Comprehensive TypeScript interfaces for all brand-configurable
 * properties in the white-label hockey game application.
 */

// ── Player Color Set ──────────────────────────────────────────

export interface PlayerColorSet {
    primary: string;
    secondary: string;
    stick: string;
    trail: string;
}

// ── Text Colors ───────────────────────────────────────────────

export interface TextColors {
    primary: string;
    secondary: string;
    accent: string;
    onPrimary: string;
    onSecondary: string;
}

// ── Scoreboard Colors ─────────────────────────────────────────

export interface ScoreboardColors {
    background: string;
    text: string;
    highlight: string;
    border: string;
}

// ── Puck Colors ───────────────────────────────────────────────

export interface PuckColors {
    fill: string;
    stroke: string;
    glow: string;
}

// ── Brand Colors ──────────────────────────────────────────────

export interface BrandColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;

    // Game-specific colors
    iceColor: string;
    icePattern: string;
    lineColor: string;
    goalColor: string;

    // Player colors
    player1: PlayerColorSet;
    player2: PlayerColorSet;

    // UI colors
    text: TextColors;
    scoreboard: ScoreboardColors;
    puck: PuckColors;
}

// ── Typography ────────────────────────────────────────────────

export interface BrandTypography {
    fontFamily: {
        primary: string;
        secondary: string;
        display: string;
        monospace: string;
    };
    fontUrls: string[];
    sizes: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        xxl: string;
        display: string;
        score: string;
    };
    weights: {
        light: number;
        regular: number;
        medium: number;
        bold: number;
        black: number;
    };
}

// ── Logos ──────────────────────────────────────────────────────

export interface BrandLogos {
    primary: {
        url: string;
        width: number;
        height: number;
    };
    secondary: string;
    icon: string;
    favicon: string;
    watermark: string;
    loading: string;
}

// ── Assets ────────────────────────────────────────────────────

export interface BrandAssets {
    iceTexture: string;
    goalNet: string;
    rinkBorder: string;
    centerCircle: string;
    faceoffSpots: string;
    crowdBackground: string;
    celebrationEffect: string;
    watermarkOpacity?: number;
}

// ── Sounds ────────────────────────────────────────────────────

export interface BrandSounds {
    enabled: boolean;
    masterVolume?: number;
    goalHorn: string;
    puckHit: string;
    crowdCheer: string;
    whistle: string;
    ambient: string;
    gameOver?: string;
    countdown?: string;
}

// ── Game Customization ────────────────────────────────────────

export interface GameCustomization {
    playerNames: {
        player1Default: string;
        player2Default: string;
    };
    scoreToWin: number;
    matchDuration: number | null;
    showTimer: boolean;
    showPlayerTrails: boolean;
    celebrationDuration: number;
    intermissionScreens: boolean;
}

// ── Metadata ──────────────────────────────────────────────────

export interface BrandMetadata {
    companyName: string;
    tagline: string;
    copyright: string;
    supportUrl: string;
    termsUrl: string;
    privacyUrl: string;
}

// ── Root Brand Config ─────────────────────────────────────────

export interface BrandConfig {
    id: string;
    name: string;
    version: string;
    createdAt: string;
    updatedAt: string;

    colors: BrandColors;
    typography: BrandTypography;
    logos: BrandLogos;
    assets: BrandAssets;
    sounds: BrandSounds;
    gameCustomization: GameCustomization;
    metadata: BrandMetadata;
}

/**
 * A deeply-partial version of BrandConfig, used when applying
 * partial overrides on top of a default brand.
 */
export type PartialBrandConfig = {
    [K in keyof BrandConfig]?: BrandConfig[K] extends object
    ? Partial<BrandConfig[K]>
    : BrandConfig[K];
};
