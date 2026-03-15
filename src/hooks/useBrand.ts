/**
 * Custom Brand Hooks
 *
 * Convenience hooks that select specific slices of the brand store
 * so components only re-render when their slice changes.
 */

import { useCallback } from 'react';
import { useBrandStore } from '@/store/brandStore';
import type { BrandColors, BrandTypography, BrandLogos, BrandConfig } from '@/types';
import { applyCSSProperties, loadBrandFonts, preloadBrandAssets } from '@/brand/brandUtils';

// ── Read-only selectors ───────────────────────────────────────

/** Returns the current brand's color palette. */
export function useBrandColors(): BrandColors {
    return useBrandStore((s) => s.currentBrand.colors);
}

/** Returns the current brand's typography settings. */
export function useBrandTypography(): BrandTypography {
    return useBrandStore((s) => s.currentBrand.typography);
}

/** Returns the current brand's logo URLs. */
export function useBrandLogos(): BrandLogos {
    return useBrandStore((s) => s.currentBrand.logos);
}

/** Returns the full current BrandConfig. */
export function useBrandConfig(): BrandConfig {
    return useBrandStore((s) => s.currentBrand);
}

// ── Update helpers ────────────────────────────────────────────

interface BrandUpdateActions {
    updateColors: (colors: Partial<BrandColors>) => void;
    updateTypography: (typography: Partial<BrandTypography>) => void;
    updateLogos: (logos: Partial<BrandLogos>) => void;
    updateBrandPartial: (updates: Partial<BrandConfig>) => void;
    setCurrentBrand: (brand: BrandConfig) => void;
    resetToDefault: () => void;
    saveBrand: (brand: BrandConfig) => void;
    loadBrand: (brandId: string) => void;
    deleteBrand: (brandId: string) => void;
    duplicateBrand: (brandId: string, newName: string) => void;
    exportBrand: (brandId: string) => string;
    importBrand: (jsonString: string) => void;
}

/** Returns a stable object of all brand mutation functions. */
export function useBrandUpdate(): BrandUpdateActions {
    const updateColors = useBrandStore((s) => s.updateColors);
    const updateTypography = useBrandStore((s) => s.updateTypography);
    const updateLogos = useBrandStore((s) => s.updateLogos);
    const updateBrandPartial = useBrandStore((s) => s.updateBrandPartial);
    const setCurrentBrand = useBrandStore((s) => s.setCurrentBrand);
    const resetToDefault = useBrandStore((s) => s.resetToDefault);
    const saveBrand = useBrandStore((s) => s.saveBrand);
    const loadBrand = useBrandStore((s) => s.loadBrand);
    const deleteBrand = useBrandStore((s) => s.deleteBrand);
    const duplicateBrand = useBrandStore((s) => s.duplicateBrand);
    const exportBrand = useBrandStore((s) => s.exportBrand);
    const importBrand = useBrandStore((s) => s.importBrand);

    return {
        updateColors,
        updateTypography,
        updateLogos,
        updateBrandPartial,
        setCurrentBrand,
        resetToDefault,
        saveBrand,
        loadBrand,
        deleteBrand,
        duplicateBrand,
        exportBrand,
        importBrand,
    };
}

// ── DOM Application ───────────────────────────────────────────

/**
 * Returns a callback that imperatively applies the current brand
 * to the DOM (CSS vars, fonts, asset preloads). Useful when you
 * need to trigger a re-application after external changes.
 */
export function useApplyBrand(): () => Promise<void> {
    const brand = useBrandStore((s) => s.currentBrand);

    return useCallback(async () => {
        applyCSSProperties(brand);
        loadBrandFonts(brand);
        await preloadBrandAssets(brand);
    }, [brand]);
}
