/**
 * ColorPicker Component
 *
 * HSL-based color picker with saturation/lightness area, hue slider,
 * hex input, and a grid of quick-select preset colors.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface ColorPickerProps {
    color: string;
    onChange: (color: string) => void;
    onClose: () => void;
}

export function ColorPicker({ color, onChange, onClose }: ColorPickerProps) {
    const [hue, setHue] = useState(0);
    const [saturation, setSaturation] = useState(100);
    const [lightness, setLightness] = useState(50);
    const [hexInput, setHexInput] = useState(color);
    const areaRef = useRef<HTMLDivElement>(null);
    const dragging = useRef(false);

    // Parse initial colour into HSL
    useEffect(() => {
        const rgb = hexToRgb(color);
        if (rgb) {
            const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
            setHue(hsl.h);
            setSaturation(hsl.s);
            setLightness(hsl.l);
        }
        setHexInput(color);
    }, [color]);

    const applyHsl = useCallback(
        (h: number, s: number, l: number) => {
            setHue(h);
            setSaturation(s);
            setLightness(l);
            const hex = hslToHex(h, s, l);
            setHexInput(hex);
            onChange(hex);
        },
        [onChange],
    );

    const handleAreaPointer = useCallback(
        (e: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
            const rect = areaRef.current?.getBoundingClientRect();
            if (!rect) return;
            const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
            applyHsl(hue, Math.round(x * 100), Math.round((1 - y) * 100));
        },
        [hue, applyHsl],
    );

    useEffect(() => {
        const onMove = (e: PointerEvent) => {
            if (dragging.current) handleAreaPointer(e);
        };
        const onUp = () => {
            dragging.current = false;
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        return () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
        };
    }, [handleAreaPointer]);

    const handleHexInput = (value: string) => {
        setHexInput(value);
        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
            onChange(value);
            const rgb = hexToRgb(value);
            if (rgb) {
                const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                setHue(hsl.h);
                setSaturation(hsl.s);
                setLightness(hsl.l);
            }
        }
    };

    const quickColors = [
        '#ff0000', '#ff6600', '#ffcc00', '#00ff00', '#00ffcc',
        '#00ccff', '#0066ff', '#6600ff', '#cc00ff', '#ff0066',
        '#ffffff', '#cccccc', '#888888', '#444444', '#000000',
    ];

    return (
        <div
            style={{
                backgroundColor: 'var(--color-surface, #1E293B)',
                borderRadius: '12px',
                padding: '14px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
                width: '224px',
                border: '1px solid var(--color-scoreboard-border, #334155)',
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                }}
            >
                <span
                    style={{
                        color: 'var(--color-text-primary, #F8FAFC)',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        fontFamily: 'var(--font-primary), sans-serif',
                    }}
                >
                    Pick Color
                </span>
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-secondary, #94A3B8)',
                        cursor: 'pointer',
                        fontSize: '16px',
                        padding: '2px 4px',
                        lineHeight: 1,
                    }}
                >
                    ✕
                </button>
            </div>

            {/* Saturation / Lightness area */}
            <div
                ref={areaRef}
                onPointerDown={(e) => {
                    dragging.current = true;
                    handleAreaPointer(e);
                }}
                style={{
                    width: '100%',
                    height: '120px',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    cursor: 'crosshair',
                    position: 'relative',
                    overflow: 'hidden',
                    background: `
                        linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,1) 100%),
                        linear-gradient(to right, #808080, hsl(${hue}, 100%, 50%))
                    `,
                    touchAction: 'none',
                }}
            >
                {/* Selector dot */}
                <div
                    style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        border: '2px solid white',
                        boxShadow: '0 0 4px rgba(0,0,0,0.6)',
                        position: 'absolute',
                        left: `${saturation}%`,
                        top: `${100 - lightness}%`,
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                    }}
                />
            </div>

            {/* Hue slider */}
            <input
                type="range"
                min="0"
                max="360"
                value={hue}
                onChange={(e) => applyHsl(parseInt(e.target.value), saturation, lightness)}
                style={{
                    width: '100%',
                    height: '14px',
                    borderRadius: '7px',
                    marginBottom: '10px',
                    background:
                        'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    outline: 'none',
                }}
            />

            {/* Hex input */}
            <input
                type="text"
                value={hexInput}
                onChange={(e) => handleHexInput(e.target.value)}
                placeholder="#000000"
                style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: 'var(--color-background, #0F172A)',
                    border: '1px solid var(--color-scoreboard-border, #334155)',
                    borderRadius: '6px',
                    color: 'var(--color-text-primary, #F8FAFC)',
                    fontFamily: 'monospace',
                    fontSize: '0.82rem',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                    outline: 'none',
                    marginBottom: '10px',
                }}
            />

            {/* Quick colors */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '5px',
                }}
            >
                {quickColors.map((c) => (
                    <div
                        key={c}
                        onClick={() => {
                            onChange(c);
                            setHexInput(c);
                            const rgb = hexToRgb(c);
                            if (rgb) {
                                const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                                setHue(hsl.h);
                                setSaturation(hsl.s);
                                setLightness(hsl.l);
                            }
                        }}
                        style={{
                            aspectRatio: '1',
                            backgroundColor: c,
                            borderRadius: '4px',
                            cursor: 'pointer',
                            border:
                                hexInput.toLowerCase() === c
                                    ? '2px solid white'
                                    : '2px solid transparent',
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

// ── Colour Helpers ───────────────────────────────────────────

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m
        ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
        : null;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}

function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}
