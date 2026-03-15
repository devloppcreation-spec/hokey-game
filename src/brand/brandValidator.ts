/**
 * Brand Config Validator
 *
 * Runtime validation helpers to ensure a BrandConfig object is
 * complete and contains valid values before it is applied.
 */

import type { BrandConfig } from '@/types/brand.types';

export interface ValidationError {
    path: string;
    message: string;
}

export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}

// ── Helpers ───────────────────────────────────────────────────

const HEX_RE = /^#([0-9A-Fa-f]{3,8})$/;
const RGBA_RE = /^rgba?\(/;

function isValidColor(value: unknown): boolean {
    if (typeof value !== 'string') return false;
    return HEX_RE.test(value) || RGBA_RE.test(value);
}

function isNonEmptyString(value: unknown): boolean {
    return typeof value === 'string' && value.trim().length > 0;
}

function isPositiveNumber(value: unknown): boolean {
    return typeof value === 'number' && value > 0;
}

// ── Color Validators ──────────────────────────────────────────

function validateColorGroup(
    obj: Record<string, unknown>,
    prefix: string,
    errors: ValidationError[],
): void {
    for (const [key, value] of Object.entries(obj)) {
        const path = `${prefix}.${key}`;
        if (value !== null && typeof value === 'object') {
            validateColorGroup(value as Record<string, unknown>, path, errors);
        } else if (!isValidColor(value)) {
            errors.push({ path, message: `Invalid color value: "${String(value)}"` });
        }
    }
}

// ── Main Validator ────────────────────────────────────────────

export function validateBrandConfig(config: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    if (!config || typeof config !== 'object') {
        return { valid: false, errors: [{ path: '', message: 'Config must be an object' }] };
    }

    const c = config as Record<string, unknown>;

    // Top-level required strings
    for (const field of ['id', 'name', 'version'] as const) {
        if (!isNonEmptyString((c as Record<string, unknown>)[field])) {
            errors.push({ path: field, message: `"${field}" must be a non-empty string` });
        }
    }

    // Colors
    if (!c.colors || typeof c.colors !== 'object') {
        errors.push({ path: 'colors', message: 'Missing colors object' });
    } else {
        validateColorGroup(c.colors as Record<string, unknown>, 'colors', errors);
    }

    // Typography
    if (!c.typography || typeof c.typography !== 'object') {
        errors.push({ path: 'typography', message: 'Missing typography object' });
    } else {
        const typo = c.typography as Record<string, unknown>;
        if (!typo.fontFamily || typeof typo.fontFamily !== 'object') {
            errors.push({ path: 'typography.fontFamily', message: 'Missing fontFamily object' });
        }
        if (!Array.isArray(typo.fontUrls)) {
            errors.push({ path: 'typography.fontUrls', message: 'fontUrls must be an array' });
        }
    }

    // Logos
    if (!c.logos || typeof c.logos !== 'object') {
        errors.push({ path: 'logos', message: 'Missing logos object' });
    } else {
        const logos = c.logos as Record<string, unknown>;
        if (!logos.primary || typeof logos.primary !== 'object') {
            errors.push({ path: 'logos.primary', message: 'Missing primary logo object' });
        } else {
            const prim = logos.primary as Record<string, unknown>;
            if (!isNonEmptyString(prim.url)) {
                errors.push({ path: 'logos.primary.url', message: 'Primary logo URL is required' });
            }
            if (!isPositiveNumber(prim.width)) {
                errors.push({ path: 'logos.primary.width', message: 'Primary logo width must be > 0' });
            }
            if (!isPositiveNumber(prim.height)) {
                errors.push({ path: 'logos.primary.height', message: 'Primary logo height must be > 0' });
            }
        }
    }

    // Game Customization
    if (!c.gameCustomization || typeof c.gameCustomization !== 'object') {
        errors.push({ path: 'gameCustomization', message: 'Missing gameCustomization object' });
    } else {
        const gc = c.gameCustomization as Record<string, unknown>;
        if (!isPositiveNumber(gc.scoreToWin)) {
            errors.push({ path: 'gameCustomization.scoreToWin', message: 'scoreToWin must be > 0' });
        }
        if (gc.matchDuration !== null && !isPositiveNumber(gc.matchDuration)) {
            errors.push({
                path: 'gameCustomization.matchDuration',
                message: 'matchDuration must be > 0 or null',
            });
        }
    }

    // Sounds
    if (!c.sounds || typeof c.sounds !== 'object') {
        errors.push({ path: 'sounds', message: 'Missing sounds object' });
    } else {
        const sounds = c.sounds as Record<string, unknown>;
        if (typeof sounds.enabled !== 'boolean') {
            errors.push({ path: 'sounds.enabled', message: 'sounds.enabled must be a boolean' });
        }
    }

    // Metadata
    if (!c.metadata || typeof c.metadata !== 'object') {
        errors.push({ path: 'metadata', message: 'Missing metadata object' });
    }

    return { valid: errors.length === 0, errors };
}

/**
 * Quick boolean check – returns true when the config is valid.
 */
export function isBrandConfigValid(config: unknown): config is BrandConfig {
    return validateBrandConfig(config).valid;
}
