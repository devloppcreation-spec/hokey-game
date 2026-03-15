/**
 * ColorsSection Component
 *
 * Full colour editor for the admin panel. Provides collapsible
 * groups for brand colours, field, player 1/2, scoreboard, and
 * puck, plus one-click colour presets.
 */

import { useState } from 'react';
import { useBrandStore } from '@/store/brandStore';
import { AdminSection } from '../components/AdminSection';
import { ColorPicker } from '../components/ColorPicker';
import { colorPresets } from '../utils/colorPresets';

export function ColorsSection() {
    const { currentBrand, updateColors } = useBrandStore();
    const c = currentBrand.colors;

    return (
        <div>
            {/* ── Brand Colors ───────────────────────────── */}
            <AdminSection title="Brand Colors" description="Primary brand palette" defaultOpen>
                <ColorRow label="Primary" color={c.primary} onChange={(v) => updateColors({ primary: v })} />
                <ColorRow label="Secondary" color={c.secondary} onChange={(v) => updateColors({ secondary: v })} />
                <ColorRow label="Accent" color={c.accent} onChange={(v) => updateColors({ accent: v })} />
                <ColorRow label="Background" color={c.background} onChange={(v) => updateColors({ background: v })} />
                <ColorRow label="Surface" color={c.surface} onChange={(v) => updateColors({ surface: v })} />
            </AdminSection>

            {/* ── Ice & Field ────────────────────────────── */}
            <AdminSection title="Ice & Field" description="Playing field colours">
                <ColorRow label="Ice / Field" color={c.iceColor} onChange={(v) => updateColors({ iceColor: v })} />
                <ColorRow label="Lines" color={c.lineColor} onChange={(v) => updateColors({ lineColor: v })} />
                <ColorRow label="Goal" color={c.goalColor} onChange={(v) => updateColors({ goalColor: v })} />
            </AdminSection>

            {/* ── Player 1 ───────────────────────────────── */}
            <AdminSection title="Player 1" description="Left-side player colours">
                <ColorRow
                    label="Primary"
                    color={c.player1.primary}
                    onChange={(v) => updateColors({ player1: { ...c.player1, primary: v } })}
                />
                <ColorRow
                    label="Secondary"
                    color={c.player1.secondary}
                    onChange={(v) => updateColors({ player1: { ...c.player1, secondary: v } })}
                />
                <ColorRow
                    label="Trail"
                    color={c.player1.trail}
                    onChange={(v) => updateColors({ player1: { ...c.player1, trail: v } })}
                />
                <ColorRow
                    label="Stick"
                    color={c.player1.stick}
                    onChange={(v) => updateColors({ player1: { ...c.player1, stick: v } })}
                />
            </AdminSection>

            {/* ── Player 2 ───────────────────────────────── */}
            <AdminSection title="Player 2" description="Right-side player colours">
                <ColorRow
                    label="Primary"
                    color={c.player2.primary}
                    onChange={(v) => updateColors({ player2: { ...c.player2, primary: v } })}
                />
                <ColorRow
                    label="Secondary"
                    color={c.player2.secondary}
                    onChange={(v) => updateColors({ player2: { ...c.player2, secondary: v } })}
                />
                <ColorRow
                    label="Trail"
                    color={c.player2.trail}
                    onChange={(v) => updateColors({ player2: { ...c.player2, trail: v } })}
                />
                <ColorRow
                    label="Stick"
                    color={c.player2.stick}
                    onChange={(v) => updateColors({ player2: { ...c.player2, stick: v } })}
                />
            </AdminSection>

            {/* ── Text Colors ────────────────────────────── */}
            <AdminSection title="Text Colors" description="UI text colour palette">
                <ColorRow
                    label="Primary"
                    color={c.text.primary}
                    onChange={(v) => updateColors({ text: { ...c.text, primary: v } })}
                />
                <ColorRow
                    label="Secondary"
                    color={c.text.secondary}
                    onChange={(v) => updateColors({ text: { ...c.text, secondary: v } })}
                />
                <ColorRow
                    label="Accent"
                    color={c.text.accent}
                    onChange={(v) => updateColors({ text: { ...c.text, accent: v } })}
                />
                <ColorRow
                    label="On Primary"
                    color={c.text.onPrimary}
                    onChange={(v) => updateColors({ text: { ...c.text, onPrimary: v } })}
                />
            </AdminSection>

            {/* ── Scoreboard ─────────────────────────────── */}
            <AdminSection title="Scoreboard" description="Score display colours">
                <ColorRow
                    label="Background"
                    color={c.scoreboard.background}
                    onChange={(v) => updateColors({ scoreboard: { ...c.scoreboard, background: v } })}
                />
                <ColorRow
                    label="Text"
                    color={c.scoreboard.text}
                    onChange={(v) => updateColors({ scoreboard: { ...c.scoreboard, text: v } })}
                />
                <ColorRow
                    label="Highlight"
                    color={c.scoreboard.highlight}
                    onChange={(v) => updateColors({ scoreboard: { ...c.scoreboard, highlight: v } })}
                />
                <ColorRow
                    label="Border"
                    color={c.scoreboard.border}
                    onChange={(v) => updateColors({ scoreboard: { ...c.scoreboard, border: v } })}
                />
            </AdminSection>

            {/* ── Puck / Ball ────────────────────────────── */}
            <AdminSection title="Puck / Ball" description="Game object colours">
                <ColorRow
                    label="Fill"
                    color={c.puck.fill}
                    onChange={(v) => updateColors({ puck: { ...c.puck, fill: v } })}
                />
                <ColorRow
                    label="Stroke"
                    color={c.puck.stroke}
                    onChange={(v) => updateColors({ puck: { ...c.puck, stroke: v } })}
                />
                <ColorRow
                    label="Glow"
                    color={c.puck.glow}
                    onChange={(v) => updateColors({ puck: { ...c.puck, glow: v } })}
                />
            </AdminSection>

            {/* ── Quick Presets ───────────────────────────── */}
            <AdminSection title="Quick Presets" description="Apply a complete colour theme" defaultOpen>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {colorPresets.map((preset) => (
                        <PresetButton
                            key={preset.id}
                            name={preset.name}
                            swatches={preset.swatches}
                            onClick={() => updateColors(preset.colors)}
                        />
                    ))}
                </div>
            </AdminSection>
        </div>
    );
}

// ── Color Row ────────────────────────────────────────────────

function ColorRow({
    label,
    color,
    onChange,
}: {
    label: string;
    color: string;
    onChange: (color: string) => void;
}) {
    const [showPicker, setShowPicker] = useState(false);

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid var(--color-scoreboard-border, #334155)',
                position: 'relative',
            }}
        >
            <span
                style={{
                    color: 'var(--color-text-secondary, #94A3B8)',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-primary), sans-serif',
                }}
            >
                {label}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Hex input */}
                <input
                    type="text"
                    value={color}
                    onChange={(e) => onChange(e.target.value)}
                    style={{
                        width: '74px',
                        padding: '4px 6px',
                        backgroundColor: 'var(--color-background, #0F172A)',
                        border: '1px solid var(--color-scoreboard-border, #334155)',
                        borderRadius: '4px',
                        color: 'var(--color-text-primary, #F8FAFC)',
                        fontSize: '0.72rem',
                        fontFamily: 'monospace',
                        outline: 'none',
                    }}
                />

                {/* Swatch button */}
                <div
                    onClick={() => setShowPicker(!showPicker)}
                    style={{
                        width: '30px',
                        height: '30px',
                        backgroundColor: color,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        border: '2px solid var(--color-scoreboard-border, #334155)',
                        flexShrink: 0,
                    }}
                />
            </div>

            {/* Picker popover */}
            {showPicker && (
                <div
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        zIndex: 200,
                    }}
                >
                    <ColorPicker
                        color={color}
                        onChange={onChange}
                        onClose={() => setShowPicker(false)}
                    />
                </div>
            )}
        </div>
    );
}

// ── Preset Button ────────────────────────────────────────────

function PresetButton({
    name,
    swatches,
    onClick,
}: {
    name: string;
    swatches: [string, string, string];
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '6px 10px',
                backgroundColor: 'var(--color-background, #0F172A)',
                border: '1px solid var(--color-scoreboard-border, #334155)',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'border-color 0.15s ease',
                fontFamily: 'var(--font-primary), sans-serif',
            }}
        >
            <div style={{ display: 'flex' }}>
                {swatches.map((s, i) => (
                    <div
                        key={i}
                        style={{
                            width: '14px',
                            height: '14px',
                            backgroundColor: s,
                            marginLeft: i > 0 ? '-3px' : 0,
                            borderRadius: '50%',
                            border: '1px solid #222',
                        }}
                    />
                ))}
            </div>
            <span
                style={{
                    color: 'var(--color-text-secondary, #94A3B8)',
                    fontSize: '0.72rem',
                    whiteSpace: 'nowrap',
                }}
            >
                {name}
            </span>
        </button>
    );
}
