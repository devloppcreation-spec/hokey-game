/**
 * SportSelector Component
 *
 * Grid of sport theme buttons. Clicking one changes the visual skin
 * without altering gameplay (still hockey physics).
 */

import { getAllSportThemes } from '@/themes/sportThemes';
import { useGameStore } from '@/store/gameStore';
import type { SportType } from '@/types/sportTheme.types';

export function SportSelector() {
    const currentSport = useGameStore((s) => s.currentSport);
    const setSport = useGameStore((s) => s.setSport);
    const themes = getAllSportThemes();

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                padding: '16px 20px',
                flexWrap: 'wrap',
            }}
        >
            {themes.map((theme) => {
                const active = currentSport === theme.id;
                return (
                    <button
                        key={theme.id}
                        onClick={() => setSport(theme.id as SportType)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '14px 22px',
                            borderRadius: '14px',
                            border: active
                                ? '3px solid #fff'
                                : '3px solid transparent',
                            backgroundColor: theme.field.backgroundColor,
                            cursor: 'pointer',
                            transition:
                                'transform 0.2s ease, box-shadow 0.2s ease',
                            transform: active ? 'scale(1.08)' : 'scale(1)',
                            boxShadow: active
                                ? '0 8px 24px rgba(0,0,0,0.35)'
                                : '0 3px 12px rgba(0,0,0,0.2)',
                            outline: 'none',
                            minWidth: '90px',
                        }}
                        title={theme.name}
                    >
                        <span
                            style={{
                                fontSize: '36px',
                                marginBottom: '6px',
                                lineHeight: 1,
                            }}
                        >
                            {theme.icon}
                        </span>
                        <span
                            style={{
                                color: theme.field.lineColor,
                                fontWeight: 700,
                                fontSize: '12px',
                                textShadow: '0 1px 3px rgba(0,0,0,0.4)',
                                letterSpacing: '0.02em',
                                fontFamily:
                                    'var(--font-primary), system-ui, sans-serif',
                            }}
                        >
                            {theme.name}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
