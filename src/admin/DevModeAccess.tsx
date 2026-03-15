/**
 * DevModeAccess Component
 *
 * Completely hides admin panel from end-users.
 * Only accessible by typing "devmode" (d-e-v-m-o-d-e) within 2 seconds.
 * When `enabled` is false, renders nothing at all.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface DevModeAccessProps {
    children: React.ReactNode;
    /** Set to false in production builds to fully disable. */
    enabled: boolean;
}

const SECRET_SEQUENCE = ['d', 'e', 'v', 'm', 'o', 'd', 'e'];

export function DevModeAccess({ children, enabled }: DevModeAccessProps) {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const sequenceRef = useRef<string[]>([]);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleClose = useCallback(() => {
        setIsUnlocked(false);
    }, []);

    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input or textarea
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement
            ) {
                return;
            }

            // Append key to sequence, keeping only the last N characters
            sequenceRef.current = [
                ...sequenceRef.current,
                e.key.toLowerCase(),
            ].slice(-SECRET_SEQUENCE.length);

            // Reset sequence after 2s of inactivity
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                sequenceRef.current = [];
            }, 2000);

            // Check match
            if (
                sequenceRef.current.length === SECRET_SEQUENCE.length &&
                sequenceRef.current.join('') === SECRET_SEQUENCE.join('')
            ) {
                setIsUnlocked(true);
                sequenceRef.current = [];
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [enabled]);

    if (!enabled || !isUnlocked) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10000,
                backgroundColor: 'rgba(0, 0, 0, 0.92)',
            }}
        >
            {/* Top bar */}
            <div
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    display: 'flex',
                    gap: 10,
                    zIndex: 10001,
                }}
            >
                <div
                    style={{
                        background: 'linear-gradient(135deg, #e53e3e, #c53030)',
                        color: '#fff',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        boxShadow: '0 2px 8px rgba(229,62,62,0.4)',
                        userSelect: 'none',
                    }}
                >
                    🔧 DEV MODE
                </div>
                <button
                    onClick={handleClose}
                    style={{
                        background: '#2d2d2d',
                        color: '#e2e2e2',
                        border: '1px solid #444',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 600,
                        transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.background = '#444')
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.background = '#2d2d2d')
                    }
                >
                    ✕ Exit Dev Mode
                </button>
            </div>

            {/* Content area */}
            <div style={{ paddingTop: 60, height: '100%', overflow: 'auto' }}>
                {children}
            </div>
        </div>
    );
}
