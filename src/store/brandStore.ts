/**
 * Brand Store
 *
 * Zustand store with full brand CRUD, localStorage persistence,
 * import/export, and real-time CSS custom property updates.
 */

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { BrandConfig, BrandColors, BrandTypography, BrandLogos, BrandAssets, BrandSounds } from '@/types';
import { defaultBrand } from '@/brand/defaultBrand';
import { applyCSSProperties, loadBrandFonts, preloadBrandAssets, deepMerge } from '@/brand/brandUtils';
import { validateBrandConfig } from '@/brand/brandValidator';

// ── Storage Keys ──────────────────────────────────────────────

const STORAGE_KEY_CURRENT = 'hockey-brand-current';
const STORAGE_KEY_SAVED = 'hockey-brand-saved';

// ── Store Interface ───────────────────────────────────────────

export interface BrandStore {
    // State
    currentBrand: BrandConfig;
    savedBrands: BrandConfig[];
    isLoading: boolean;
    error: string | null;

    // Actions
    setCurrentBrand: (brand: BrandConfig) => void;
    updateBrandPartial: (updates: Partial<BrandConfig>) => void;
    updateColors: (colors: Partial<BrandColors>) => void;
    updateTypography: (typography: Partial<BrandTypography>) => void;
    updateLogos: (logos: Partial<BrandLogos>) => void;
    updateAssets: (assets: Partial<BrandAssets>) => void;
    updateSounds: (sounds: Partial<BrandSounds>) => void;

    // Brand Management
    saveBrand: (brand: BrandConfig) => void;
    loadBrand: (brandId: string) => void;
    deleteBrand: (brandId: string) => void;
    duplicateBrand: (brandId: string, newName: string) => void;
    exportBrand: (brandId: string) => string;
    importBrand: (jsonString: string) => void;

    // Persistence
    loadFromStorage: () => void;
    saveToStorage: () => void;
    resetToDefault: () => void;
}

// ── Helpers ───────────────────────────────────────────────────

function applyBrandSideEffects(brand: BrandConfig): void {
    applyCSSProperties(brand);
    loadBrandFonts(brand);
}

function readJSON<T>(key: string): T | null {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        return JSON.parse(raw) as T;
    } catch {
        console.warn(`[BrandStore] Failed to parse localStorage key "${key}"`);
        return null;
    }
}

function writeJSON(key: string, value: unknown): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
        console.warn(`[BrandStore] Failed to write localStorage key "${key}"`, err);
    }
}

// ── Store ─────────────────────────────────────────────────────

export const useBrandStore = create<BrandStore>((set, get) => ({
    // ── State ─────────────────────────────────────────────
    currentBrand: defaultBrand,
    savedBrands: [],
    isLoading: false,
    error: null,

    // ── Actions ───────────────────────────────────────────

    setCurrentBrand: (brand: BrandConfig) => {
        const result = validateBrandConfig(brand);
        if (!result.valid) {
            set({ error: `Invalid brand config: ${result.errors.map((e) => e.message).join(', ')}` });
            return;
        }
        applyBrandSideEffects(brand);
        set({ currentBrand: brand, error: null });
        get().saveToStorage();
    },

    updateBrandPartial: (updates: Partial<BrandConfig>) => {
        const current = get().currentBrand;
        const merged = deepMerge(
            current as unknown as Record<string, unknown>,
            updates as unknown as Record<string, unknown>,
        ) as unknown as BrandConfig;
        merged.updatedAt = new Date().toISOString();
        applyBrandSideEffects(merged);
        set({ currentBrand: merged, error: null });
        get().saveToStorage();
    },

    updateColors: (colors: Partial<BrandColors>) => {
        get().updateBrandPartial({ colors: colors as BrandColors });
    },

    updateTypography: (typography: Partial<BrandTypography>) => {
        get().updateBrandPartial({ typography: typography as BrandTypography });
    },

    updateLogos: (logos: Partial<BrandLogos>) => {
        get().updateBrandPartial({ logos: logos as BrandLogos });
    },

    updateAssets: (assets: Partial<BrandAssets>) => {
        get().updateBrandPartial({ assets: assets as BrandAssets });
    },

    updateSounds: (sounds: Partial<BrandSounds>) => {
        get().updateBrandPartial({ sounds: sounds as BrandSounds });
    },

    // ── Brand Management ──────────────────────────────────

    saveBrand: (brand: BrandConfig) => {
        const saved = [...get().savedBrands];
        const idx = saved.findIndex((b) => b.id === brand.id);
        const updated = { ...brand, updatedAt: new Date().toISOString() };
        if (idx >= 0) {
            saved[idx] = updated;
        } else {
            saved.push(updated);
        }
        set({ savedBrands: saved, error: null });
        get().saveToStorage();
    },

    loadBrand: (brandId: string) => {
        const brand = get().savedBrands.find((b) => b.id === brandId);
        if (!brand) {
            set({ error: `Brand "${brandId}" not found` });
            return;
        }
        applyBrandSideEffects(brand);
        set({ currentBrand: brand, error: null });
        get().saveToStorage();
    },

    deleteBrand: (brandId: string) => {
        const saved = get().savedBrands.filter((b) => b.id !== brandId);
        set({ savedBrands: saved, error: null });
        // If we deleted the active brand, fall back to default
        if (get().currentBrand.id === brandId) {
            applyBrandSideEffects(defaultBrand);
            set({ currentBrand: defaultBrand });
        }
        get().saveToStorage();
    },

    duplicateBrand: (brandId: string, newName: string) => {
        const source = get().savedBrands.find((b) => b.id === brandId);
        if (!source) {
            set({ error: `Brand "${brandId}" not found for duplication` });
            return;
        }
        const now = new Date().toISOString();
        const duplicate: BrandConfig = {
            ...structuredClone(source),
            id: uuidv4(),
            name: newName,
            createdAt: now,
            updatedAt: now,
        };
        get().saveBrand(duplicate);
    },

    exportBrand: (brandId: string): string => {
        const brand =
            get().currentBrand.id === brandId
                ? get().currentBrand
                : get().savedBrands.find((b) => b.id === brandId);
        if (!brand) {
            set({ error: `Brand "${brandId}" not found for export` });
            return '{}';
        }
        return JSON.stringify(brand, null, 2);
    },

    importBrand: (jsonString: string) => {
        try {
            const parsed = JSON.parse(jsonString) as unknown;
            const result = validateBrandConfig(parsed);
            if (!result.valid) {
                set({
                    error: `Import validation failed: ${result.errors.map((e) => `${e.path}: ${e.message}`).join('; ')}`,
                });
                return;
            }
            const brand = parsed as BrandConfig;
            // Assign new ID to avoid collisions
            const now = new Date().toISOString();
            brand.id = uuidv4();
            brand.createdAt = now;
            brand.updatedAt = now;
            get().saveBrand(brand);
            set({ error: null });
        } catch {
            set({ error: 'Import failed: invalid JSON' });
        }
    },

    // ── Persistence ───────────────────────────────────────

    loadFromStorage: () => {
        set({ isLoading: true, error: null });

        // Load saved brands list
        const savedBrands = readJSON<BrandConfig[]>(STORAGE_KEY_SAVED) ?? [];

        // Load current brand
        const storedCurrent = readJSON<BrandConfig>(STORAGE_KEY_CURRENT);
        const currentBrand = storedCurrent ?? defaultBrand;

        applyBrandSideEffects(currentBrand);
        preloadBrandAssets(currentBrand).catch(() => {
            /* non-blocking */
        });

        set({ currentBrand, savedBrands, isLoading: false });
    },

    saveToStorage: () => {
        const { currentBrand, savedBrands } = get();
        writeJSON(STORAGE_KEY_CURRENT, currentBrand);
        writeJSON(STORAGE_KEY_SAVED, savedBrands);
    },

    resetToDefault: () => {
        applyBrandSideEffects(defaultBrand);
        set({ currentBrand: defaultBrand, error: null });
        get().saveToStorage();
    },
}));
