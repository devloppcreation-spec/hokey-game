/**
 * FontSelector Component
 *
 * Dropdown selector for choosing font families.
 * Shows system fonts and popular Google Fonts with search,
 * lazy-loads Google Fonts on hover for instant preview.
 */

import { useState, useEffect, useRef } from 'react';
import { popularFonts, loadGoogleFont } from '../utils/fonts';

interface FontSelectorProps {
    value: string;
    onChange: (font: string) => void;
}

const SYSTEM_FONTS = ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New', 'system-ui'];

export function FontSelector({ value, onChange }: FontSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleFontHover = async (font: string) => {
        if (!loadedFonts.has(font)) {
            await loadGoogleFont(font);
            setLoadedFonts((prev) => new Set([...prev, font]));
        }
    };

    const filteredFonts = popularFonts.filter((f) =>
        f.toLowerCase().includes(search.toLowerCase()),
    );

    const select = (font: string) => {
        onChange(font);
        setIsOpen(false);
        setSearch('');
    };

    return (
        <div ref={dropdownRef} style={{ position: 'relative' }}>
            {/* Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'var(--color-background, #0F172A)',
                    border: '1px solid var(--color-scoreboard-border, #334155)',
                    borderRadius: '8px',
                    color: 'var(--color-text-primary, #F8FAFC)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontFamily: `"${value}", sans-serif`,
                    fontSize: '0.85rem',
                    textAlign: 'left',
                }}
            >
                <span>{value}</span>
                <span
                    style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.2s ease',
                        fontSize: '0.7rem',
                        opacity: 0.5,
                    }}
                >
                    ▼
                </span>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '4px',
                        backgroundColor: 'var(--color-surface, #1E293B)',
                        border: '1px solid var(--color-scoreboard-border, #334155)',
                        borderRadius: '8px',
                        maxHeight: '300px',
                        overflow: 'hidden',
                        zIndex: 200,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {/* Search */}
                    <div style={{ padding: '8px', flexShrink: 0 }}>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search fonts…"
                            autoFocus
                            style={{
                                width: '100%',
                                padding: '8px 10px',
                                backgroundColor: 'var(--color-background, #0F172A)',
                                border: '1px solid var(--color-scoreboard-border, #334155)',
                                borderRadius: '6px',
                                color: 'var(--color-text-primary, #F8FAFC)',
                                boxSizing: 'border-box',
                                fontSize: '0.8rem',
                                fontFamily: 'var(--font-primary), sans-serif',
                                outline: 'none',
                            }}
                        />
                    </div>

                    {/* Scrollable list */}
                    <div style={{ overflow: 'auto', flex: 1 }}>
                        {/* System fonts */}
                        <GroupLabel>System Fonts</GroupLabel>
                        {SYSTEM_FONTS.filter((f) =>
                            f.toLowerCase().includes(search.toLowerCase()),
                        ).map((font) => (
                            <FontOption
                                key={font}
                                font={font}
                                selected={value === font}
                                onSelect={() => select(font)}
                            />
                        ))}

                        {/* Google fonts */}
                        <GroupLabel>Google Fonts</GroupLabel>
                        {filteredFonts.map((font) => (
                            <FontOption
                                key={font}
                                font={font}
                                selected={value === font}
                                onHover={() => handleFontHover(font)}
                                onSelect={() => select(font)}
                            />
                        ))}

                        {filteredFonts.length === 0 && (
                            <div
                                style={{
                                    padding: '12px',
                                    textAlign: 'center',
                                    color: 'var(--color-text-secondary, #94A3B8)',
                                    fontSize: '0.78rem',
                                }}
                            >
                                No fonts found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Sub-components ───────────────────────────────────────────

function GroupLabel({ children }: { children: React.ReactNode }) {
    return (
        <div
            style={{
                padding: '6px 12px',
                color: 'var(--color-text-secondary, #94A3B8)',
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 600,
                fontFamily: 'var(--font-primary), sans-serif',
                marginTop: '4px',
            }}
        >
            {children}
        </div>
    );
}

function FontOption({
    font,
    selected,
    onSelect,
    onHover,
}: {
    font: string;
    selected: boolean;
    onSelect: () => void;
    onHover?: () => void;
}) {
    return (
        <button
            onClick={onSelect}
            onMouseEnter={onHover}
            style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: selected
                    ? 'var(--color-primary, #1E40AF)22'
                    : 'transparent',
                border: 'none',
                borderLeft: selected
                    ? '3px solid var(--color-primary, #1E40AF)'
                    : '3px solid transparent',
                color: 'var(--color-text-primary, #F8FAFC)',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: `"${font}", sans-serif`,
                fontSize: '0.85rem',
                display: 'block',
                transition: 'background-color 0.1s ease',
            }}
        >
            {font}
        </button>
    );
}
