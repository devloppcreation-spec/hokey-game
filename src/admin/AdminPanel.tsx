/**
 * AdminPanel Component
 *
 * Full-screen admin panel shown inside DevModeAccess.
 * No visible toggle – DevModeAccess handles visibility.
 */

import type { BrandConfig } from '@/types/brand.types';
import { useAdminPanel } from '@/hooks/useAdminPanel';
import { AdminHeader } from './components/AdminHeader';
import { AdminFooter } from './components/AdminFooter';
import { AdminLayout } from './AdminLayout';

interface AdminPanelProps {
    brand: BrandConfig;
}

const PANEL_WIDTH = 420;

export function AdminPanel({ brand }: AdminPanelProps) {
    const admin = useAdminPanel();

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: PANEL_WIDTH,
                height: '100%',
                background: 'var(--color-surface, #1E293B)',
                borderLeft: '1px solid var(--color-scoreboard-border, #334155)',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'var(--font-primary), sans-serif',
                boxShadow: '-8px 0 32px rgba(0,0,0,0.4)',
            }}
        >
            {/* Header */}
            <AdminHeader
                brandName={brand.name}
                hasUnsavedChanges={admin.hasUnsavedChanges}
                onSave={admin.applyChanges}
                onReset={admin.resetChanges}
                onClose={() => { }}
                canUndo={admin.canUndo}
                canRedo={admin.canRedo}
                onUndo={admin.undo}
                onRedo={admin.redo}
            />

            {/* Content */}
            <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
                <AdminLayout
                    activeTab={admin.activeTab}
                    onTabChange={admin.setActiveTab}
                    brand={brand}
                    searchQuery={admin.searchQuery}
                    onSearchChange={admin.setSearchQuery}
                    onUpdate={admin.updatePending}
                />
            </div>

            {/* Footer */}
            <AdminFooter
                hasUnsavedChanges={admin.hasUnsavedChanges}
                onApply={admin.applyChanges}
                onReset={admin.resetChanges}
                autoSave={admin.autoSave}
                onAutoSaveChange={admin.setAutoSave}
                lastSavedAt={admin.lastSavedAt}
            />
        </div>
    );
}
