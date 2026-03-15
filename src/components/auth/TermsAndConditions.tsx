/**
 * TermsAndConditions Modal
 *
 * Full-screen overlay with scrollable terms content.
 * Styled to match the dark game theme.
 */

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TermsAndConditions({ isOpen, onClose }: TermsModalProps) {
    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.92)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5000,
                padding: '20px',
            }}
        >
            <div
                style={{
                    backgroundColor: '#1a1a2e',
                    borderRadius: '16px',
                    maxWidth: '600px',
                    width: '100%',
                    maxHeight: '80vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: '20px 24px',
                        borderBottom: '1px solid #333',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            color: 'white',
                            fontSize: '1.3rem',
                            fontFamily: 'var(--font-display), system-ui, sans-serif',
                        }}
                    >
                        📜 Terms and Conditions
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#888',
                            fontSize: '24px',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            lineHeight: 1,
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div
                    style={{
                        padding: '20px 24px',
                        overflow: 'auto',
                        color: '#ccc',
                        lineHeight: 1.7,
                        fontSize: '0.9rem',
                        fontFamily: 'var(--font-primary), system-ui, sans-serif',
                    }}
                >
                    <h3 style={{ color: '#fff', marginTop: 0 }}>1. Acceptance of Terms</h3>
                    <p>
                        By accessing and using this game application ("Service"), you agree to be
                        bound by these Terms and Conditions. If you do not agree with any part of
                        these terms, you may not use the Service.
                    </p>

                    <h3 style={{ color: '#fff' }}>2. Email Collection</h3>
                    <p>We collect your email address for the following purposes:</p>
                    <ul>
                        <li>To identify you as a player during game sessions</li>
                        <li>To send you updates about tournaments and events (optional)</li>
                        <li>To maintain leaderboards and player statistics</li>
                    </ul>
                    <p>Your email will not be shared with third parties without your consent.</p>

                    <h3 style={{ color: '#fff' }}>3. Privacy Policy</h3>
                    <p>We are committed to protecting your privacy. The data we collect is:</p>
                    <ul>
                        <li>Stored securely</li>
                        <li>Used only for game-related purposes</li>
                        <li>Never sold to third parties</li>
                        <li>Deleted upon request</li>
                    </ul>

                    <h3 style={{ color: '#fff' }}>4. User Conduct</h3>
                    <p>Users agree to:</p>
                    <ul>
                        <li>Use the Service responsibly</li>
                        <li>Not attempt to disrupt or damage the Service</li>
                        <li>Respect other players</li>
                    </ul>

                    <h3 style={{ color: '#fff' }}>5. Intellectual Property</h3>
                    <p>
                        All content, graphics, and software in this Service are protected by
                        intellectual property rights and are owned by the Service provider.
                    </p>

                    <h3 style={{ color: '#fff' }}>6. Limitation of Liability</h3>
                    <p>
                        The Service is provided "as is" without warranties of any kind. We are not
                        liable for any damages arising from the use of this Service.
                    </p>

                    <h3 style={{ color: '#fff' }}>7. Changes to Terms</h3>
                    <p>
                        We reserve the right to modify these terms at any time. Continued use of
                        the Service constitutes acceptance of modified terms.
                    </p>

                    <h3 style={{ color: '#fff' }}>8. Contact</h3>
                    <p>For questions about these Terms, please contact the venue operator.</p>

                    <p
                        style={{
                            marginTop: '24px',
                            fontStyle: 'italic',
                            color: '#666',
                            fontSize: '0.8rem',
                        }}
                    >
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>

                {/* Footer */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid #333' }}>
                    <button
                        onClick={onClose}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: 'var(--brand-primary, #0066cc)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '16px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontFamily: 'var(--font-display), system-ui, sans-serif',
                            transition: 'transform 0.15s ease',
                        }}
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
}
