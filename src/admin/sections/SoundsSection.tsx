/**
 * SoundsSection Component
 *
 * Sound configuration panel for the admin.
 * Features master toggle, volume slider, per-slot sound editing
 * with built-in options, custom upload, preview play, sound packs,
 * and a test-all-sounds button.
 */

import { useState, useCallback, useRef } from 'react';
import { useBrandStore } from '@/store/brandStore';
import { SoundUploader } from '../components/SoundUploader';
import { defaultSounds, soundPacks } from '../utils/defaultSounds';
import type { SoundOption } from '../utils/defaultSounds';

// ── Sound slot config ────────────────────────────────────────

interface SlotDef {
    key: string;
    title: string;
    description: string;
    icon: string;
}

const SOUND_SLOTS: SlotDef[] = [
    { key: 'goalHorn', title: 'Goal Horn', description: 'Plays when a goal is scored', icon: '🎺' },
    { key: 'puckHit', title: 'Puck Hit', description: 'Plays when the puck is struck', icon: '🏒' },
    { key: 'whistle', title: 'Whistle', description: 'Plays at game start and stop', icon: '🔔' },
    { key: 'crowdCheer', title: 'Crowd Cheer', description: 'Background crowd ambiance', icon: '👏' },
    { key: 'gameOver', title: 'Game Over', description: 'Plays when the game ends', icon: '🏆' },
    { key: 'countdown', title: 'Countdown', description: 'Beep sounds for 3-2-1 countdown', icon: '⏱️' },
];

// ── Main Component ───────────────────────────────────────────

export function SoundsSection() {
    const { currentBrand, updateSounds } = useBrandStore();
    const sounds = currentBrand.sounds;
    const [masterVolume, setMasterVolume] = useState(sounds?.masterVolume ?? 80);

    const handleVolumeChange = useCallback(
        (volume: number) => {
            setMasterVolume(volume);
            updateSounds({ masterVolume: volume });
        },
        [updateSounds],
    );

    const handleToggle = useCallback(
        (enabled: boolean) => updateSounds({ enabled }),
        [updateSounds],
    );

    const handleSlotChange = useCallback(
        (key: string, url: string) => updateSounds({ [key]: url } as Record<string, string>),
        [updateSounds],
    );

    const handleApplyPack = useCallback(
        (packSounds: Record<string, string>) => {
            updateSounds({ ...packSounds, enabled: true });
        },
        [updateSounds],
    );

    const handleTestAll = useCallback(() => {
        const vol = (masterVolume ?? 80) / 100;
        let delay = 0;
        for (const slot of SOUND_SLOTS) {
            const url = (sounds as unknown as Record<string, string>)?.[slot.key];
            if (url) {
                setTimeout(() => {
                    const a = new Audio(url);
                    a.volume = vol * 0.5;
                    a.play().catch(() => {});
                }, delay);
                delay += 800;
            }
        }
    }, [sounds, masterVolume]);

    const isEnabled = sounds?.enabled ?? true;

    return (
        <div>
            {/* ── Master Controls ────────────────────────── */}
            <div
                style={{
                    padding: '14px 16px',
                    marginBottom: '2px',
                    background: 'var(--color-surface, #1E293B)',
                    borderBottom: '1px solid var(--color-scoreboard-border, #334155)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '14px',
                    }}
                >
                    <span
                        style={{
                            color: 'var(--color-text-primary, #F8FAFC)',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            fontFamily: 'var(--font-primary), sans-serif',
                        }}
                    >
                        Sound Effects
                    </span>
                    <ToggleSwitch checked={isEnabled} onChange={handleToggle} />
                </div>

                <div style={{ opacity: isEnabled ? 1 : 0.4, transition: 'opacity 0.2s' }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '6px',
                        }}
                    >
                        <span
                            style={{
                                color: 'var(--color-text-secondary, #94A3B8)',
                                fontSize: '0.75rem',
                                fontFamily: 'var(--font-primary), sans-serif',
                            }}
                        >
                            Master Volume
                        </span>
                        <span
                            style={{
                                color: 'var(--color-text-primary, #F8FAFC)',
                                fontSize: '0.75rem',
                                fontFamily: 'monospace',
                                minWidth: '32px',
                                textAlign: 'right',
                            }}
                        >
                            {masterVolume}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={masterVolume}
                        onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                        disabled={!isEnabled}
                        style={{
                            width: '100%',
                            accentColor: 'var(--color-primary, #1E40AF)',
                        }}
                    />
                </div>
            </div>

            {/* ── Sound Slots ───────────────────────────── */}
            <div style={{ opacity: isEnabled ? 1 : 0.4, transition: 'opacity 0.2s' }}>
                {SOUND_SLOTS.map((slot) => (
                    <SoundSlot
                        key={slot.key}
                        title={slot.title}
                        description={slot.description}
                        icon={slot.icon}
                        currentSound={
                            (sounds as unknown as Record<string, string>)?.[slot.key]
                        }
                        onSoundChange={(url) => handleSlotChange(slot.key, url)}
                        defaultOptions={defaultSounds[slot.key] ?? []}
                        disabled={!isEnabled}
                        masterVolume={masterVolume}
                    />
                ))}
            </div>

            {/* ── Sound Packs ───────────────────────────── */}
            <div
                style={{
                    padding: '14px 16px',
                    borderTop: '1px solid var(--color-scoreboard-border, #334155)',
                }}
            >
                <div
                    style={{
                        color: 'var(--color-text-primary, #F8FAFC)',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        marginBottom: '4px',
                        fontFamily: 'var(--font-primary), sans-serif',
                    }}
                >
                    🎵 Sound Packs
                </div>
                <p
                    style={{
                        color: 'var(--color-text-secondary, #94A3B8)',
                        fontSize: '0.7rem',
                        margin: '0 0 12px',
                        fontFamily: 'var(--font-primary), sans-serif',
                    }}
                >
                    Apply a complete sound theme with one click
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {soundPacks.map((pack) => (
                        <SoundPackButton
                            key={pack.name}
                            name={pack.name}
                            description={pack.description}
                            onClick={() => handleApplyPack(pack.sounds)}
                        />
                    ))}
                </div>
            </div>

            {/* ── Test All ──────────────────────────────── */}
            <div
                style={{
                    padding: '16px',
                    textAlign: 'center',
                    borderTop: '1px solid var(--color-scoreboard-border, #334155)',
                }}
            >
                <button
                    onClick={handleTestAll}
                    disabled={!isEnabled}
                    style={{
                        padding: '10px 24px',
                        backgroundColor: 'var(--color-primary, #1E40AF)',
                        color: 'var(--color-text-onPrimary, #FFFFFF)',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: isEnabled ? 'pointer' : 'not-allowed',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        fontFamily: 'var(--font-primary), sans-serif',
                        opacity: isEnabled ? 1 : 0.5,
                        transition: 'opacity 0.2s',
                    }}
                >
                    🔊 Test All Sounds
                </button>
            </div>
        </div>
    );
}

// ── SoundSlot ────────────────────────────────────────────────

function SoundSlot({
    title,
    description,
    icon,
    currentSound,
    onSoundChange,
    defaultOptions,
    disabled,
    masterVolume,
}: {
    title: string;
    description: string;
    icon: string;
    currentSound?: string;
    onSoundChange: (url: string) => void;
    defaultOptions: SoundOption[];
    disabled: boolean;
    masterVolume: number;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const playSound = () => {
        if (!currentSound || disabled) return;

        // Stop previous
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        const a = new Audio(currentSound);
        a.volume = (masterVolume / 100) * 0.5;
        audioRef.current = a;
        setIsPlaying(true);
        a.play().catch(() => setIsPlaying(false));
        a.onended = () => {
            setIsPlaying(false);
            audioRef.current = null;
        };
    };

    const stopSound = () => {
        audioRef.current?.pause();
        audioRef.current = null;
        setIsPlaying(false);
    };

    return (
        <div
            style={{
                borderBottom: '1px solid var(--color-scoreboard-border, #334155)',
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.background = 'var(--color-surface, #1E293B)')
                }
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
                <span style={{ fontSize: '20px', marginRight: '10px', lineHeight: 1 }}>
                    {icon}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                        style={{
                            color: 'var(--color-text-primary, #F8FAFC)',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            fontFamily: 'var(--font-primary), sans-serif',
                        }}
                    >
                        {title}
                    </div>
                    <div
                        style={{
                            color: 'var(--color-text-secondary, #94A3B8)',
                            fontSize: '0.68rem',
                            fontFamily: 'var(--font-primary), sans-serif',
                        }}
                    >
                        {description}
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {currentSound && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                isPlaying ? stopSound() : playSound();
                            }}
                            style={{
                                padding: '5px 10px',
                                backgroundColor: 'var(--color-surface, #1E293B)',
                                border: '1px solid var(--color-scoreboard-border, #334155)',
                                borderRadius: '6px',
                                color: 'var(--color-text-primary, #F8FAFC)',
                                cursor: 'pointer',
                                fontSize: '0.72rem',
                                lineHeight: 1,
                            }}
                        >
                            {isPlaying ? '⏹️' : '▶️'}
                        </button>
                    )}
                    <span
                        style={{
                            color: 'var(--color-text-secondary, #94A3B8)',
                            fontSize: '0.6rem',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                            transition: 'transform 0.2s',
                            display: 'inline-block',
                        }}
                    >
                        ▼
                    </span>
                </div>
            </div>

            {/* Expanded content */}
            {isExpanded && (
                <div style={{ padding: '0 16px 14px' }}>
                    {/* Built-in options */}
                    <div style={{ marginBottom: '10px' }}>
                        <span
                            style={{
                                color: 'var(--color-text-secondary, #94A3B8)',
                                fontSize: '0.68rem',
                                fontFamily: 'var(--font-primary), sans-serif',
                            }}
                        >
                            Built-in Options
                        </span>
                        <div
                            style={{
                                display: 'flex',
                                gap: '6px',
                                marginTop: '6px',
                                flexWrap: 'wrap',
                            }}
                        >
                            {defaultOptions.map((opt) => (
                                <button
                                    key={opt.name}
                                    onClick={() => onSoundChange(opt.url)}
                                    style={{
                                        padding: '5px 10px',
                                        backgroundColor:
                                            currentSound === opt.url
                                                ? 'var(--color-primary, #1E40AF)'
                                                : 'var(--color-background, #0F172A)',
                                        border: `1px solid ${
                                            currentSound === opt.url
                                                ? 'var(--color-primary, #1E40AF)'
                                                : 'var(--color-scoreboard-border, #334155)'
                                        }`,
                                        borderRadius: '6px',
                                        color: 'var(--color-text-primary, #F8FAFC)',
                                        cursor: 'pointer',
                                        fontSize: '0.72rem',
                                        fontFamily: 'var(--font-primary), sans-serif',
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    {opt.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom upload */}
                    <SoundUploader
                        value={currentSound ?? ''}
                        onChange={onSoundChange}
                    />

                    {/* Clear */}
                    {currentSound && (
                        <button
                            onClick={() => onSoundChange('')}
                            style={{
                                marginTop: '8px',
                                padding: '5px 12px',
                                backgroundColor: 'transparent',
                                border: '1px solid var(--color-scoreboard-border, #334155)',
                                borderRadius: '6px',
                                color: 'var(--color-text-secondary, #94A3B8)',
                                cursor: 'pointer',
                                fontSize: '0.72rem',
                                fontFamily: 'var(--font-primary), sans-serif',
                            }}
                        >
                            🗑️ Remove Sound
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

// ── ToggleSwitch ─────────────────────────────────────────────

function ToggleSwitch({
    checked,
    onChange,
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <button
            onClick={() => onChange(!checked)}
            aria-pressed={checked}
            style={{
                width: '44px',
                height: '24px',
                borderRadius: '12px',
                backgroundColor: checked
                    ? 'var(--color-primary, #1E40AF)'
                    : 'var(--color-scoreboard-border, #334155)',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.2s',
                flexShrink: 0,
            }}
        >
            <div
                style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    position: 'absolute',
                    top: '2px',
                    left: checked ? '22px' : '2px',
                    transition: 'left 0.2s',
                }}
            />
        </button>
    );
}

// ── SoundPackButton ──────────────────────────────────────────

function SoundPackButton({
    name,
    description,
    onClick,
}: {
    name: string;
    description: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '8px 12px',
                backgroundColor: 'var(--color-background, #0F172A)',
                border: '1px solid var(--color-scoreboard-border, #334155)',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = 'var(--color-primary, #1E40AF)')
            }
            onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor =
                    'var(--color-scoreboard-border, #334155)')
            }
        >
            <div
                style={{
                    color: 'var(--color-text-primary, #F8FAFC)',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    marginBottom: '2px',
                    fontFamily: 'var(--font-primary), sans-serif',
                }}
            >
                {name}
            </div>
            <div
                style={{
                    color: 'var(--color-text-secondary, #94A3B8)',
                    fontSize: '0.65rem',
                    fontFamily: 'var(--font-primary), sans-serif',
                }}
            >
                {description}
            </div>
        </button>
    );
}
