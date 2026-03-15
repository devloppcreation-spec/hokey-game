/**
 * TypographySection Component
 *
 * Full typography editor for the admin panel. Includes font
 * family selectors, live text preview, font size sliders,
 * and one-click typography presets with Google Fonts integration.
 */

import { useState } from 'react';
import { useBrandStore } from '@/store/brandStore';
import { AdminSection } from '../components/AdminSection';
import { FontSelector } from '../components/FontSelector';
import { typographyPresets, loadGoogleFont } from '../utils/fonts';

export function TypographySection() {
    const { currentBrand, updateTypography } = useBrandStore();
    const typo = currentBrand.typography;
    const [previewText, setPreviewText] = useState('Sports Arena 123');

    const handleFontChange = async (
        type: 'primary' | 'secondary' | 'display' | 'monospace',
        fontFamily: string,
    ) => {
        await loadGoogleFont(fontFamily);
        updateTypography({
            fontFamily: { ...typo.fontFamily, [type]: fontFamily },
        });
    };

    const handleSizeChange = (key: string, value: string) => {
        updateTypography({
            sizes: { ...typo.sizes, [key]: value },
        });
    };

    const handleWeightChange = (key: string, value: number) => {
        updateTypography({
            weights: { ...typo.weights, [key]: value },
        });
    };

    const applyPreset = async (preset: (typeof typographyPresets)[number]) => {
        const { fontFamily } = preset;
        await Promise.all([
            loadGoogleFont(fontFamily.primary),
            loadGoogleFont(fontFamily.display),
            loadGoogleFont(fontFamily.secondary),
            loadGoogleFont(fontFamily.monospace),
        ]);
        updateTypography({ fontFamily });
    };

    return (
        <div>
            {/* ── Live Preview ────────────────────────────── */}
            <AdminSection title="Live Preview" description="Type to preview fonts" defaultOpen>
                <input
                    type="text"
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                    placeholder="Preview text…"
                    style={{
                        width: '100%',
                        padding: '8px 10px',
                        marginBottom: '16px',
                        backgroundColor: 'var(--color-background, #0F172A)',
                        border: '1px solid var(--color-scoreboard-border, #334155)',
                        borderRadius: '6px',
                        color: 'var(--color-text-primary, #F8FAFC)',
                        fontSize: '0.82rem',
                        fontFamily: 'var(--font-primary), sans-serif',
                        boxSizing: 'border-box',
                        outline: 'none',
                        textAlign: 'center',
                    }}
                />

                <PreviewRow label="Primary" fontFamily={typo.fontFamily.primary} size="1.1rem" weight={400} text={previewText} />
                <PreviewRow label="Display" fontFamily={typo.fontFamily.display} size="1.8rem" weight={700} text={previewText} />
                <PreviewRow label="Score" fontFamily={typo.fontFamily.display} size={typo.sizes.score} weight={900} text="5 – 3" accent />
            </AdminSection>

            {/* ── Font Families ───────────────────────────── */}
            <AdminSection title="Font Families" description="Select fonts for each role" defaultOpen>
                <FontField label="Primary (UI Text)" value={typo.fontFamily.primary} onChange={(f) => handleFontChange('primary', f)} />
                <FontField label="Display (Headlines, Scores)" value={typo.fontFamily.display} onChange={(f) => handleFontChange('display', f)} />
                <FontField label="Secondary (Supporting)" value={typo.fontFamily.secondary} onChange={(f) => handleFontChange('secondary', f)} />
                <FontField label="Monospace (Data)" value={typo.fontFamily.monospace} onChange={(f) => handleFontChange('monospace', f)} />
            </AdminSection>

            {/* ── Font Sizes ─────────────────────────────── */}
            <AdminSection title="Font Sizes" description="Adjust the type scale">
                <SizeSlider label="XS" value={typo.sizes.xs} min={8} max={16} onChange={(v) => handleSizeChange('xs', `${v}px`)} />
                <SizeSlider label="Small" value={typo.sizes.sm} min={10} max={18} onChange={(v) => handleSizeChange('sm', `${v}px`)} />
                <SizeSlider label="Medium" value={typo.sizes.md} min={14} max={24} onChange={(v) => handleSizeChange('md', `${v}px`)} />
                <SizeSlider label="Large" value={typo.sizes.lg} min={18} max={32} onChange={(v) => handleSizeChange('lg', `${v}px`)} />
                <SizeSlider label="XL" value={typo.sizes.xl} min={24} max={48} onChange={(v) => handleSizeChange('xl', `${v}px`)} />
                <SizeSlider label="XXL" value={typo.sizes.xxl} min={32} max={64} onChange={(v) => handleSizeChange('xxl', `${v}px`)} />
                <SizeSlider label="Display" value={typo.sizes.display} min={36} max={96} onChange={(v) => handleSizeChange('display', `${v}px`)} />
                <SizeSlider label="Score" value={typo.sizes.score} min={48} max={120} onChange={(v) => handleSizeChange('score', `${v}px`)} />
            </AdminSection>

            {/* ── Font Weights ────────────────────────────── */}
            <AdminSection title="Font Weights" description="Customise weight values">
                <WeightSlider label="Light" value={typo.weights.light} onChange={(v) => handleWeightChange('light', v)} />
                <WeightSlider label="Regular" value={typo.weights.regular} onChange={(v) => handleWeightChange('regular', v)} />
                <WeightSlider label="Medium" value={typo.weights.medium} onChange={(v) => handleWeightChange('medium', v)} />
                <WeightSlider label="Bold" value={typo.weights.bold} onChange={(v) => handleWeightChange('bold', v)} />
                <WeightSlider label="Black" value={typo.weights.black} onChange={(v) => handleWeightChange('black', v)} />
            </AdminSection>

            {/* ── Presets ─────────────────────────────────── */}
            <AdminSection title="Quick Presets" description="Apply a complete typography set" defaultOpen>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {typographyPresets.map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => applyPreset(preset)}
                            style={{
                                padding: '10px 14px',
                                backgroundColor: 'var(--color-background, #0F172A)',
                                border: '1px solid var(--color-scoreboard-border, #334155)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'border-color 0.15s ease',
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: `"${preset.fontFamily.display}", sans-serif`,
                                    color: 'var(--color-text-primary, #F8FAFC)',
                                    fontSize: '0.9rem',
                                    fontWeight: 700,
                                    marginBottom: '2px',
                                }}
                            >
                                {preset.name}
                            </div>
                            <div
                                style={{
                                    fontFamily: `"${preset.fontFamily.primary}", sans-serif`,
                                    color: 'var(--color-text-secondary, #94A3B8)',
                                    fontSize: '0.68rem',
                                }}
                            >
                                {preset.fontFamily.primary} / {preset.fontFamily.display}
                            </div>
                        </button>
                    ))}
                </div>
            </AdminSection>
        </div>
    );
}

// ── Sub-components ───────────────────────────────────────────

function PreviewRow({
    label,
    fontFamily,
    size,
    weight,
    text,
    accent,
}: {
    label: string;
    fontFamily: string;
    size: string;
    weight: number;
    text: string;
    accent?: boolean;
}) {
    return (
        <div style={{ marginBottom: '12px' }}>
            <div
                style={{
                    fontSize: '0.65rem',
                    color: 'var(--color-text-secondary, #94A3B8)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '4px',
                    fontFamily: 'var(--font-primary), sans-serif',
                }}
            >
                {label}
            </div>
            <div
                style={{
                    fontFamily: `"${fontFamily}", sans-serif`,
                    fontSize: size,
                    fontWeight: weight,
                    color: accent
                        ? 'var(--color-primary, #1E40AF)'
                        : 'var(--color-text-primary, #F8FAFC)',
                    lineHeight: 1.2,
                    wordBreak: 'break-word',
                }}
            >
                {text}
            </div>
        </div>
    );
}

function FontField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (font: string) => void;
}) {
    return (
        <div style={{ marginBottom: '14px' }}>
            <label
                style={{
                    display: 'block',
                    color: 'var(--color-text-secondary, #94A3B8)',
                    fontSize: '0.78rem',
                    marginBottom: '6px',
                    fontFamily: 'var(--font-primary), sans-serif',
                }}
            >
                {label}
            </label>
            <FontSelector value={value} onChange={onChange} />
        </div>
    );
}

function SizeSlider({
    label,
    value,
    min,
    max,
    onChange,
}: {
    label: string;
    value: string;
    min: number;
    max: number;
    onChange: (value: number) => void;
}) {
    const numValue = parseInt(value) || min;

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px',
                gap: '12px',
            }}
        >
            <span
                style={{
                    color: 'var(--color-text-secondary, #94A3B8)',
                    width: '60px',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-primary), sans-serif',
                    flexShrink: 0,
                }}
            >
                {label}
            </span>
            <input
                type="range"
                min={min}
                max={max}
                value={numValue}
                onChange={(e) => onChange(parseInt(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--color-primary, #1E40AF)' }}
            />
            <span
                style={{
                    color: 'var(--color-text-primary, #F8FAFC)',
                    width: '42px',
                    textAlign: 'right',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    flexShrink: 0,
                }}
            >
                {numValue}px
            </span>
        </div>
    );
}

function WeightSlider({
    label,
    value,
    onChange,
}: {
    label: string;
    value: number;
    onChange: (value: number) => void;
}) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px',
                gap: '12px',
            }}
        >
            <span
                style={{
                    color: 'var(--color-text-secondary, #94A3B8)',
                    width: '60px',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-primary), sans-serif',
                    flexShrink: 0,
                }}
            >
                {label}
            </span>
            <input
                type="range"
                min={100}
                max={900}
                step={100}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--color-primary, #1E40AF)' }}
            />
            <span
                style={{
                    color: 'var(--color-text-primary, #F8FAFC)',
                    width: '42px',
                    textAlign: 'right',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    fontWeight: value,
                    flexShrink: 0,
                }}
            >
                {value}
            </span>
        </div>
    );
}
