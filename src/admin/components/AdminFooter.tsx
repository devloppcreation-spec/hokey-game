/**
 * AdminFooter Component
 *
 * Apply Changes, Reset, auto-save toggle, and last-saved timestamp.
 */

interface AdminFooterProps {
    hasUnsavedChanges: boolean;
    onApply: () => void;
    onReset: () => void;
    autoSave: boolean;
    onAutoSaveChange: (v: boolean) => void;
    lastSavedAt: Date | null;
}

export function AdminFooter({
    hasUnsavedChanges,
    onApply,
    onReset,
    autoSave,
    onAutoSaveChange,
    lastSavedAt,
}: AdminFooterProps) {
    return (
        <div style={{
            padding: '0.75rem 1rem',
            borderTop: '1px solid var(--color-scoreboard-border, #334155)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
        }}>
            {/* Buttons row */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                    onClick={onApply}
                    disabled={!hasUnsavedChanges}
                    style={{
                        flex: 1,
                        padding: '0.6rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: hasUnsavedChanges
                            ? 'var(--color-primary, #1E40AF)'
                            : 'var(--color-surface, #1E293B)',
                        color: hasUnsavedChanges
                            ? 'var(--color-text-onPrimary, #fff)'
                            : 'var(--color-text-secondary, #94A3B8)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: hasUnsavedChanges ? 'pointer' : 'not-allowed',
                        fontFamily: 'var(--font-primary), sans-serif',
                        transition: 'all 0.15s ease',
                    }}
                >
                    Apply Changes
                </button>
                <button
                    onClick={onReset}
                    disabled={!hasUnsavedChanges}
                    style={{
                        padding: '0.6rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid var(--color-scoreboard-border, #334155)',
                        background: 'transparent',
                        color: hasUnsavedChanges
                            ? 'var(--color-text-primary, #F8FAFC)'
                            : 'var(--color-text-secondary, #94A3B8)',
                        fontWeight: 500,
                        fontSize: '0.85rem',
                        cursor: hasUnsavedChanges ? 'pointer' : 'not-allowed',
                        fontFamily: 'var(--font-primary), sans-serif',
                    }}
                >
                    Reset
                </button>
            </div>

            {/* Meta row */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.68rem',
                color: 'var(--color-text-secondary, #94A3B8)',
            }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={autoSave}
                        onChange={(e) => onAutoSaveChange(e.target.checked)}
                        style={{ accentColor: 'var(--color-accent, #F59E0B)' }}
                    />
                    Auto-save
                </label>

                {lastSavedAt && (
                    <span>
                        Saved {lastSavedAt.toLocaleTimeString()}
                    </span>
                )}
            </div>
        </div>
    );
}
