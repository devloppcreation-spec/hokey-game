/**
 * AdminSection Component
 *
 * Collapsible section with title, description, and smooth animation.
 */

import { useState, type ReactNode } from 'react';

interface AdminSectionProps {
    title: string;
    description?: string;
    defaultOpen?: boolean;
    children: ReactNode;
}

export function AdminSection({ title, description, defaultOpen = false, children }: AdminSectionProps) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div style={{
            borderBottom: '1px solid var(--color-scoreboard-border, #334155)',
        }}>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-primary, #F8FAFC)',
                    fontFamily: 'var(--font-primary), sans-serif',
                    textAlign: 'left',
                }}
            >
                <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{title}</div>
                    {description && (
                        <div style={{ fontSize: '0.72rem', opacity: 0.5, marginTop: '2px' }}>
                            {description}
                        </div>
                    )}
                </div>
                <span style={{
                    transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    fontSize: '0.8rem',
                    opacity: 0.5,
                }}>
                    ▶
                </span>
            </button>

            <div style={{
                maxHeight: open ? '2000px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease',
                padding: open ? '0 1rem 1rem' : '0 1rem 0',
            }}>
                {children}
            </div>
        </div>
    );
}
