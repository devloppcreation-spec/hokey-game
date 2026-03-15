/**
 * Brand Utilities
 *
 * Helper functions for runtime brand operations:
 * - Deep merging partial brand configs with defaults
 * - Generating CSS custom properties from brand config
 * - Loading external fonts
 * - Preloading brand assets
 */

import type { BrandConfig } from '@/types/brand.types';
import { defaultBrand } from './defaultBrand';

// ── Deep Merge ────────────────────────────────────────────────

/**
 * Recursively deep-merges `partial` into `base`, returning a new
 * object. Arrays are replaced (not concatenated). `undefined` values
 * in `partial` are ignored.
 */
export function deepMerge<T extends Record<string, unknown>>(
    base: T,
    partial: Record<string, unknown>,
): T {
    const result: Record<string, unknown> = { ...base };

    for (const key of Object.keys(partial)) {
        const baseVal = (base as Record<string, unknown>)[key];
        const partialVal = partial[key];

        if (partialVal === undefined) continue;

        if (
            partialVal !== null &&
            typeof partialVal === 'object' &&
            !Array.isArray(partialVal) &&
            baseVal !== null &&
            typeof baseVal === 'object' &&
            !Array.isArray(baseVal)
        ) {
            result[key] = deepMerge(
                baseVal as Record<string, unknown>,
                partialVal as Record<string, unknown>,
            );
        } else {
            result[key] = partialVal;
        }
    }

    return result as T;
}

/**
 * Merges a partial brand config on top of the default brand,
 * returning a complete BrandConfig.
 */
export function mergeBrandConfig(partial: Record<string, unknown>): BrandConfig {
    return deepMerge(defaultBrand as unknown as Record<string, unknown>, partial) as unknown as BrandConfig;
}

// ── CSS Custom Properties ─────────────────────────────────────

/** Converts `camelCase` → `kebab-case` */
function camelToKebab(str: string): string {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * Flattens a nested object into a flat map of CSS custom property
 * names → values. E.g. `{ player1: { primary: '#f00' } }` becomes
 * `{ '--color-player1-primary': '#f00' }`.
 */
function flattenToProperties(
    obj: Record<string, unknown>,
    prefix: string,
): Record<string, string> {
    const result: Record<string, string> = {};

    for (const [key, value] of Object.entries(obj)) {
        const prop = `${prefix}-${camelToKebab(key)}`;

        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(result, flattenToProperties(value as Record<string, unknown>, prop));
        } else {
            result[prop] = String(value);
        }
    }

    return result;
}

/**
 * Generates a full map of CSS custom properties for a given
 * BrandConfig. Covers colors, typography, and sizes.
 */
export function generateCSSProperties(config: BrandConfig): Record<string, string> {
    const props: Record<string, string> = {};

    // Colors → --color-*
    Object.assign(props, flattenToProperties(config.colors as unknown as Record<string, unknown>, '--color'));

    // Typography fonts → --font-*
    for (const [key, value] of Object.entries(config.typography.fontFamily)) {
        props[`--font-${camelToKebab(key)}`] = value;
    }

    // Typography sizes → --text-*
    for (const [key, value] of Object.entries(config.typography.sizes)) {
        props[`--text-${camelToKebab(key)}`] = value;
    }

    // Typography weights → --weight-*
    for (const [key, value] of Object.entries(config.typography.weights)) {
        props[`--weight-${camelToKebab(key)}`] = String(value);
    }

    return props;
}

/**
 * Applies a BrandConfig's design tokens as CSS custom properties
 * directly on :root (`document.documentElement`).
 */
export function applyCSSProperties(config: BrandConfig): void {
    const root = document.documentElement;
    const props = generateCSSProperties(config);

    for (const [name, value] of Object.entries(props)) {
        root.style.setProperty(name, value);
    }
}

// ── Font Loading ──────────────────────────────────────────────

/**
 * Injects `<link>` elements for each font URL in the brand config.
 * Skips URLs already present in the document head.
 */
export function loadBrandFonts(config: BrandConfig): void {
    for (const url of config.typography.fontUrls) {
        if (document.querySelector(`link[href="${url}"]`)) continue;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    }
}

// ── Asset Preloading ──────────────────────────────────────────

/**
 * Collects all non-empty asset/logo URLs from the brand config,
 * then preloads them via `<link rel="preload">`. Returns a promise
 * that resolves when all assets have finished loading (or failed).
 */
export async function preloadBrandAssets(config: BrandConfig): Promise<void> {
    const urls: string[] = [];

    // Logos
    if (config.logos.primary.url) urls.push(config.logos.primary.url);
    for (const key of ['secondary', 'icon', 'favicon', 'watermark', 'loading'] as const) {
        if (config.logos[key]) urls.push(config.logos[key]);
    }

    // Game assets
    for (const value of Object.values(config.assets)) {
        if (value) urls.push(value);
    }

    // Sound files
    if (config.sounds.enabled) {
        for (const [key, value] of Object.entries(config.sounds)) {
            if (key !== 'enabled' && value) urls.push(value as string);
        }
    }

    // Filter empty and already-preloaded
    const toLoad = urls.filter(
        (u) => u && !document.querySelector(`link[rel="preload"][href="${u}"]`),
    );

    const promises = toLoad.map(
        (url) =>
            new Promise<void>((resolve) => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = url;

                // Determine best `as` attribute by extension
                if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(url)) {
                    link.as = 'image';
                } else if (/\.(mp3|ogg|wav|m4a)$/i.test(url)) {
                    link.as = 'audio';
                } else {
                    link.as = 'fetch';
                }

                link.onload = () => resolve();
                link.onerror = () => resolve(); // resolve even on error to not block
                document.head.appendChild(link);
            }),
    );

    await Promise.all(promises);
}

// ── Full Brand Application ────────────────────────────────────

/**
 * One-call convenience: applies CSS vars, loads fonts, and starts
 * asset preloading for the given BrandConfig.
 */
export async function applyBrand(config: BrandConfig): Promise<void> {
    applyCSSProperties(config);
    loadBrandFonts(config);
    await preloadBrandAssets(config);
}
