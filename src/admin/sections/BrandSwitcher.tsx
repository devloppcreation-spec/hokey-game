/**
 * BrandSwitcher Section
 *
 * Admin panel section that displays brand presets as visual cards
 * and lists saved user brands. Replaces the old QuickSwitchTab.
 */

import { useState } from 'react';
import { useBrandStore } from '@/store/brandStore';
import { brandPresets } from '@/brand/presets';
import { AdminSection } from '../components/AdminSection';
import type { BrandConfig } from '@/types/brand.types';

// ── Main Component ────────────────────────────────────────────

export function BrandSwitcher() {
    const store = useBrandStore();
    const current = store.currentBrand;

    return (
        <div>
            {/* Current brand badge */}
            <AdminSection title="Active Brand" defaultOpen>
                <ActiveBrandBadge brand={current} />
            </AdminSection>

            {/* Preset themes */}
            <AdminSection title="Theme Presets" description="One-click brand themes" defaultOpen>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '0.6rem',
                }}>
                    {brandPresets.map((bp) => (
                        <PresetCard
                            key={bp.preset.id}
                            emoji={bp.emoji}
                            name={bp.preset.name}
                            description={bp.description}
                            colors={bp.preset.colors}
                            isActive={current.id === bp.preset.id}
                            onApply={() => store.setCurrentBrand(structuredClone(bp.preset))}
                        />
                    ))}
                </div>
            </AdminSection>

            {/* Saved brands */}
            <AdminSection title="Saved Brands" description="Your custom saved brands" defaultOpen>
                <SavedBrandsList
                    brands={store.savedBrands}
                    activeId={current.id}
                    onLoad={(b) => store.loadBrand(b.id)}
                    onDelete={(b) => store.deleteBrand(b.id)}
                />
            </AdminSection>
        </div>
    );
}

// ── Active Brand Badge ────────────────────────────────────────

function ActiveBrandBadge({ brand }: { brand: BrandConfig }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.65rem 0.85rem',
            background: 'var(--color-background, #0F172A)',
            borderRadius: '10px',
            border: '1px solid var(--color-primary, #1E40AF)',
        }}>
            {/* Color swatches */}
            <div style={{ display: 'flex', gap: '3px' }}>
                {[brand.colors.primary, brand.colors.secondary, brand.colors.accent].map((c, i) => (
                    <div key={i} style={{
                        width: 18, height: 18, borderRadius: '4px',
                        background: c,
                        border: '1px solid rgba(255,255,255,0.15)',
                    }} />
                ))}
            </div>

            <div style={{ flex: 1 }}>
                <div style={{
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    color: 'var(--color-text-primary, #F8FAFC)',
                    fontFamily: 'var(--font-primary), sans-serif',
                }}>
                    {brand.name}
                </div>
                <div style={{
                    fontSize: '0.7rem',
                    color: 'var(--color-text-secondary, #94A3B8)',
                    marginTop: '1px',
                }}>
                    v{brand.version} · {brand.metadata.tagline}
                </div>
            </div>

            <div style={{
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                background: 'var(--color-primary, #1E40AF)',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase' as const,
            }}>
                Active
            </div>
        </div>
    );
}

// ── Preset Card ───────────────────────────────────────────────

function PresetCard({
    emoji,
    name,
    description,
    colors,
    isActive,
    onApply,
}: {
    emoji: string;
    name: string;
    description: string;
    colors: BrandConfig['colors'];
    isActive: boolean;
    onApply: () => void;
}) {
    const [hovered, setHovered] = useState(false);

    const swatches = [
        colors.primary, colors.secondary, colors.accent,
        colors.background, colors.iceColor,
    ];

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: 'relative',
                padding: '0.75rem',
                borderRadius: '12px',
                border: isActive
                    ? '2px solid var(--color-primary, #1E40AF)'
                    : '1px solid var(--color-scoreboard-border, #334155)',
                background: hovered
                    ? 'var(--color-surface, #1E293B)'
                    : 'var(--color-background, #0F172A)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: hovered ? 'translateY(-2px)' : 'none',
                boxShadow: hovered
                    ? '0 6px 20px rgba(0,0,0,0.3)'
                    : '0 2px 8px rgba(0,0,0,0.15)',
            }}
            onClick={onApply}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.3rem' }}>{emoji}</span>
                <span style={{
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: 'var(--color-text-primary, #F8FAFC)',
                    fontFamily: 'var(--font-primary), sans-serif',
                }}>
                    {name}
                </span>
            </div>

            {/* Description */}
            <div style={{
                fontSize: '0.72rem',
                color: 'var(--color-text-secondary, #94A3B8)',
                marginBottom: '0.6rem',
                lineHeight: 1.35,
            }}>
                {description}
            </div>

            {/* Color swatches row */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '0.5rem' }}>
                {swatches.map((c, i) => (
                    <div key={i} style={{
                        flex: 1,
                        height: 12,
                        borderRadius: '3px',
                        background: c,
                        border: '1px solid rgba(255,255,255,0.1)',
                    }} />
                ))}
            </div>

            {/* Player color preview */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '0.55rem' }}>
                <div style={{
                    flex: 1, height: 6, borderRadius: '3px',
                    background: `linear-gradient(90deg, ${colors.player1.primary}, ${colors.player1.secondary})`,
                }} />
                <div style={{
                    flex: 1, height: 6, borderRadius: '3px',
                    background: `linear-gradient(90deg, ${colors.player2.primary}, ${colors.player2.secondary})`,
                }} />
            </div>

            {/* Apply / Active badge */}
            {isActive ? (
                <div style={{
                    textAlign: 'center',
                    padding: '0.3rem',
                    borderRadius: '6px',
                    background: 'var(--color-primary, #1E40AF)22',
                    color: 'var(--color-primary, #1E40AF)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                }}>
                    ✓ Active
                </div>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '0.3rem',
                    borderRadius: '6px',
                    background: hovered ? 'var(--color-primary, #1E40AF)' : 'transparent',
                    color: hovered ? '#fff' : 'var(--color-text-secondary, #94A3B8)',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    border: hovered ? 'none' : '1px solid var(--color-scoreboard-border, #334155)',
                }}>
                    Apply Theme
                </div>
            )}
        </div>
    );
}

// ── Saved Brands List ─────────────────────────────────────────

function SavedBrandsList({
    brands,
    activeId,
    onLoad,
    onDelete,
}: {
    brands: BrandConfig[];
    activeId: string;
    onLoad: (b: BrandConfig) => void;
    onDelete: (b: BrandConfig) => void;
}) {
    if (brands.length === 0) {
        return (
            <div style={{
                fontSize: '0.78rem',
                opacity: 0.5,
                padding: '0.75rem 0',
                textAlign: 'center',
                color: 'var(--color-text-secondary, #94A3B8)',
            }}>
                No saved brands yet. Apply a preset and save it, or use Import to load one.
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {brands.map((b) => (
                <SavedBrandRow
                    key={b.id}
                    brand={b}
                    isActive={b.id === activeId}
                    onLoad={() => onLoad(b)}
                    onDelete={() => onDelete(b)}
                />
            ))}
        </div>
    );
}

function SavedBrandRow({
    brand,
    isActive,
    onLoad,
    onDelete,
}: {
    brand: BrandConfig;
    isActive: boolean;
    onLoad: () => void;
    onDelete: () => void;
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: isActive
                    ? '2px solid var(--color-primary, #1E40AF)'
                    : '1px solid var(--color-scoreboard-border, #334155)',
                background: hovered
                    ? 'var(--color-surface, #1E293B)'
                    : 'var(--color-background, #0F172A)',
                transition: 'background 0.15s ease',
            }}
        >
            {/* Mini swatches */}
            <div style={{ display: 'flex', gap: '2px' }}>
                {[brand.colors.primary, brand.colors.secondary, brand.colors.accent].map((c, i) => (
                    <div key={i} style={{
                        width: 12, height: 12, borderRadius: '3px',
                        background: c,
                        border: '1px solid rgba(255,255,255,0.1)',
                    }} />
                ))}
            </div>

            {/* Name + version */}
            <div style={{ flex: 1 }}>
                <div style={{
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    color: 'var(--color-text-primary, #F8FAFC)',
                    fontFamily: 'var(--font-primary), sans-serif',
                }}>
                    {brand.name}
                </div>
                <div style={{
                    fontSize: '0.65rem',
                    color: 'var(--color-text-secondary, #94A3B8)',
                }}>
                    v{brand.version}
                </div>
            </div>

            {/* Actions */}
            {isActive ? (
                <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: 'var(--color-primary, #1E40AF)',
                    textTransform: 'uppercase' as const,
                }}>
                    Active
                </span>
            ) : (
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onLoad(); }}
                        style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '6px',
                            border: '1px solid var(--color-scoreboard-border, #334155)',
                            background: 'var(--color-surface, #1E293B)',
                            color: 'var(--color-text-primary, #F8FAFC)',
                            cursor: 'pointer',
                            fontSize: '0.7rem',
                            fontFamily: 'var(--font-primary), sans-serif',
                        }}
                    >
                        Load
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '6px',
                            border: '1px solid #7F1D1D',
                            background: 'transparent',
                            color: '#EF4444',
                            cursor: 'pointer',
                            fontSize: '0.7rem',
                            fontFamily: 'var(--font-primary), sans-serif',
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
}
