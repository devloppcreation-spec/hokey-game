/**
 * AdminLayout Component
 *
 * The content area of the admin panel. Houses the tab navigation,
 * search bar, and renders the active tab's content placeholder.
 * The actual tab editors are stubs that will be filled in PROMPT 08+.
 */

import type { AdminTab } from '@/hooks/useAdminPanel';
import type { BrandConfig, PartialBrandConfig } from '@/types/brand.types';
import { AdminTabs } from './components/AdminTabs';
import { AdminSection } from './components/AdminSection';
import { useBrandStore } from '@/store/brandStore';
import { BrandSwitcher } from './sections/BrandSwitcher';
import { ColorsSection } from './sections/ColorsSection';
import { TypographySection } from './sections/TypographySection';
import { AssetsSection } from './sections/AssetsSection';
import { SoundsSection } from './sections/SoundsSection';

interface AdminLayoutProps {
    activeTab: AdminTab;
    onTabChange: (tab: AdminTab) => void;
    brand: BrandConfig;
    searchQuery: string;
    onSearchChange: (q: string) => void;
    onUpdate: (changes: PartialBrandConfig) => void;
}

export function AdminLayout({
    activeTab,
    onTabChange,
    brand,
    searchQuery,
    onSearchChange,
    onUpdate: _onUpdate,
}: AdminLayoutProps) {
    const store = useBrandStore();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Tabs */}
            <AdminTabs activeTab={activeTab} onTabChange={onTabChange} />

            {/* Search */}
            <div style={{ padding: '0.5rem 1rem' }}>
                <input
                    type="text"
                    placeholder="Search settings..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.45rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid var(--color-scoreboard-border, #334155)',
                        background: 'var(--color-background, #0F172A)',
                        color: 'var(--color-text-primary, #F8FAFC)',
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-primary), sans-serif',
                        outline: 'none',
                    }}
                />
            </div>

            {/* Tab Content */}
            <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
                {activeTab === 'quick-switch' && <BrandSwitcher />}
                {activeTab === 'colors' && <ColorsSection />}
                {activeTab === 'typography' && <TypographySection />}
                {activeTab === 'logos' && <AssetsSection />}
                {activeTab === 'game' && <PlaceholderTab name="Game Settings" desc="Configure score-to-win, match duration, player trails." />}
                {activeTab === 'sounds' && <SoundsSection />}
                {activeTab === 'export' && <ExportTab brand={brand} onImport={(json) => store.importBrand(json)} />}
            </div>
        </div>
    );
}


// ── Export / Import Tab ───────────────────────────────────────

function ExportTab({
    brand,
    onImport,
}: {
    brand: BrandConfig;
    onImport: (json: string) => void;
}) {
    const handleExport = () => {
        const json = JSON.stringify(brand, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${brand.name.replace(/\s+/g, '-').toLowerCase()}-brand.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;
            const text = await file.text();
            onImport(text);
        };
        input.click();
    };

    const handleCopyJSON = () => {
        navigator.clipboard.writeText(JSON.stringify(brand, null, 2));
    };

    return (
        <div>
            <AdminSection title="Export" description="Download or copy the current brand" defaultOpen>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <ActionBtn label="📥 Download JSON" onClick={handleExport} />
                    <ActionBtn label="📋 Copy to Clipboard" onClick={handleCopyJSON} />
                </div>
            </AdminSection>

            <AdminSection title="Import" description="Load a brand from a JSON file" defaultOpen>
                <ActionBtn label="📤 Import JSON File" onClick={handleImport} />
            </AdminSection>
        </div>
    );
}

// ── Placeholder Tab ──────────────────────────────────────────

function PlaceholderTab({ name, desc }: { name: string; desc: string }) {
    return (
        <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
            <div style={{
                fontSize: '1.5rem',
                marginBottom: '0.5rem',
                opacity: 0.3,
            }}>
                🚧
            </div>
            <div style={{
                fontWeight: 600,
                color: 'var(--color-text-primary, #F8FAFC)',
                fontSize: '0.9rem',
            }}>
                {name}
            </div>
            <div style={{
                fontSize: '0.78rem',
                color: 'var(--color-text-secondary, #94A3B8)',
                marginTop: '0.3rem',
            }}>
                {desc}
            </div>
        </div>
    );
}

// ── Shared Button ────────────────────────────────────────────

function ActionBtn({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--color-scoreboard-border, #334155)',
                background: 'var(--color-surface, #1E293B)',
                color: 'var(--color-text-primary, #F8FAFC)',
                cursor: 'pointer',
                fontFamily: 'var(--font-primary), sans-serif',
                fontSize: '0.8rem',
            }}
        >
            {label}
        </button>
    );
}
