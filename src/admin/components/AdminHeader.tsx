/**
 * AdminHeader Component
 *
 * Displays current brand name, unsaved changes indicator,
 * quick save and reset buttons.
 */

interface AdminHeaderProps {
    brandName: string;
    hasUnsavedChanges: boolean;
    onSave: () => void;
    onReset: () => void;
    onClose: () => void;
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
}

export function AdminHeader({
    brandName,
    hasUnsavedChanges,
    onSave,
    onReset,
    onClose,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
}: AdminHeaderProps) {
    const smallBtn: React.CSSProperties = {
        padding: '0.35rem 0.6rem',
        borderRadius: '6px',
        border: '1px solid var(--color-scoreboard-border, #334155)',
        background: 'transparent',
        color: 'var(--color-text-secondary, #94A3B8)',
        cursor: 'pointer',
        fontSize: '0.75rem',
        fontFamily: 'var(--font-primary), sans-serif',
        transition: 'all 0.15s ease',
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            borderBottom: '1px solid var(--color-scoreboard-border, #334155)',
        }}>
            {/* Brand name + indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                <span style={{
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: 'var(--color-text-primary, #F8FAFC)',
                    fontFamily: 'var(--font-display), sans-serif',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}>
                    {brandName}
                </span>
                {hasUnsavedChanges && (
                    <span style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'var(--color-accent, #F59E0B)',
                        display: 'inline-block',
                        flexShrink: 0,
                    }}
                        title="Unsaved changes"
                    />
                )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', flexShrink: 0 }}>
                <button
                    style={{ ...smallBtn, opacity: canUndo ? 1 : 0.3 }}
                    onClick={onUndo}
                    disabled={!canUndo}
                    title="Undo (Ctrl+Z)"
                >
                    ↩
                </button>
                <button
                    style={{ ...smallBtn, opacity: canRedo ? 1 : 0.3 }}
                    onClick={onRedo}
                    disabled={!canRedo}
                    title="Redo (Ctrl+Shift+Z)"
                >
                    ↪
                </button>

                {hasUnsavedChanges && (
                    <>
                        <button
                            style={{ ...smallBtn, color: 'var(--color-accent, #F59E0B)' }}
                            onClick={onSave}
                            title="Save (Ctrl+S)"
                        >
                            Save
                        </button>
                        <button style={smallBtn} onClick={onReset} title="Reset changes">
                            Reset
                        </button>
                    </>
                )}

                <button
                    style={{ ...smallBtn, fontSize: '1rem', padding: '0.2rem 0.45rem' }}
                    onClick={onClose}
                    title="Close panel"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
