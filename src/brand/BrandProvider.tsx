/**
 * BrandProvider
 *
 * React context provider that:
 * - Initialises the brand store from localStorage on mount
 * - Re-applies CSS custom properties whenever the brand changes
 * - Loads external fonts for custom typography
 * - Kicks off asset preloading in the background
 */

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useBrandStore } from '@/store/brandStore';
import type { BrandConfig } from '@/types';
import { applyCSSProperties, loadBrandFonts, preloadBrandAssets } from '@/brand/brandUtils';

// ── Context ───────────────────────────────────────────────────

interface BrandContextValue {
    brand: BrandConfig;
    isLoading: boolean;
    error: string | null;
}

const BrandContext = createContext<BrandContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────

interface BrandProviderProps {
    children: ReactNode;
    /** Optional initial brand override (e.g. from server-side config). */
    initialBrand?: BrandConfig;
}

export function BrandProvider({ children, initialBrand }: BrandProviderProps) {
    const currentBrand = useBrandStore((s) => s.currentBrand);
    const isLoading = useBrandStore((s) => s.isLoading);
    const error = useBrandStore((s) => s.error);
    const loadFromStorage = useBrandStore((s) => s.loadFromStorage);
    const setCurrentBrand = useBrandStore((s) => s.setCurrentBrand);

    // ── Initialise from storage (or override) on mount ────
    useEffect(() => {
        if (initialBrand) {
            setCurrentBrand(initialBrand);
        } else {
            loadFromStorage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Re-apply side effects whenever the brand changes ──
    useEffect(() => {
        // CSS custom properties → instant visual update
        applyCSSProperties(currentBrand);

        // Typography → inject <link> tags for Google Fonts etc.
        loadBrandFonts(currentBrand);

        // Assets → background preload (non-blocking)
        preloadBrandAssets(currentBrand).catch(() => {
            /* swallow – preload failures are non-critical */
        });

        // Update document title
        document.title = currentBrand.name;
    }, [currentBrand]);

    return (
        <BrandContext.Provider value={{ brand: currentBrand, isLoading, error }}>
            {children}
        </BrandContext.Provider>
    );
}

// ── Consumer hook ─────────────────────────────────────────────

export function useBrandContext(): BrandContextValue {
    const ctx = useContext(BrandContext);
    if (!ctx) {
        throw new Error('useBrandContext must be used within a <BrandProvider>');
    }
    return ctx;
}
