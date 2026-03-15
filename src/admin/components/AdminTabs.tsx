/**
 * AdminTabs Component
 *
 * Tab navigation with icons and active state styling.
 * Supports change badges on tabs with pending modifications.
 */

import type { AdminTab } from '@/hooks/useAdminPanel';

interface AdminTabsProps {
    activeTab: AdminTab;
    onTabChange: (tab: AdminTab) => void;
    changedTabs?: Set<AdminTab>;
}

const TABS: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'quick-switch', label: 'Brands', icon: '⚡' },
    { id: 'colors', label: 'Colors', icon: '🎨' },
    { id: 'typography', label: 'Fonts', icon: '🔤' },
    { id: 'logos', label: 'Assets', icon: '🖼️' },
    { id: 'game', label: 'Game', icon: '🏒' },
    { id: 'sounds', label: 'Sounds', icon: '🔊' },
    { id: 'export', label: 'Import/Export', icon: '📦' },
];

export function AdminTabs({ activeTab, onTabChange, changedTabs }: AdminTabsProps) {
    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2px',
            padding: '0 0.5rem',
            borderBottom: '1px solid var(--color-scoreboard-border, #334155)',
        }}>
            {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const hasChanges = changedTabs?.has(tab.id);

                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        style={{
                            padding: '0.5rem 0.65rem',
                            fontSize: '0.72rem',
                            fontWeight: isActive ? 700 : 400,
                            background: isActive
                                ? 'var(--color-primary, #1E40AF)'
                                : 'transparent',
                            color: isActive
                                ? 'var(--color-text-onPrimary, #fff)'
                                : 'var(--color-text-secondary, #94A3B8)',
                            border: 'none',
                            borderRadius: '8px 8px 0 0',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontFamily: 'var(--font-primary), sans-serif',
                            position: 'relative',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                        {hasChanges && (
                            <span style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: 'var(--color-accent, #F59E0B)',
                                display: 'inline-block',
                                marginLeft: 2,
                            }} />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
