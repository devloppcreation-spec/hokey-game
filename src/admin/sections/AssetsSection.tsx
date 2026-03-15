/**
 * AssetsSection Component
 *
 * Logo and game-asset editor for the admin panel.
 * Supports upload/URL for primary logo, secondary logo,
 * watermark, favicon, loading screen, field texture, and
 * crowd background. Primary logo has size controls,
 * watermark has an opacity slider.
 */

import { useBrandStore } from '@/store/brandStore';
import { AdminSection } from '../components/AdminSection';
import { ImageUploader } from '../components/ImageUploader';

export function AssetsSection() {
    const { currentBrand, updateLogos, updateAssets } = useBrandStore();
    const logos = currentBrand.logos;
    const assets = currentBrand.assets;

    return (
        <div>
            {/* ── Logos ───────────────────────────────────── */}

            <AdminSection title="Primary Logo" description="Main brand logo for header and loading" defaultOpen>
                <ImageUploader
                    value={logos.primary.url}
                    onChange={(url) => updateLogos({ primary: { ...logos.primary, url } })}
                    placeholder="Upload primary logo (PNG, SVG)"
                    previewHeight={80}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <SizeInput
                        label="Width"
                        value={logos.primary.width}
                        onChange={(w) => updateLogos({ primary: { ...logos.primary, width: w } })}
                    />
                    <SizeInput
                        label="Height"
                        value={logos.primary.height}
                        onChange={(h) => updateLogos({ primary: { ...logos.primary, height: h } })}
                    />
                </div>
            </AdminSection>

            <AdminSection title="Secondary Logo" description="Smaller logo for footer or alternate use">
                <ImageUploader
                    value={logos.secondary}
                    onChange={(url) => updateLogos({ secondary: url })}
                    placeholder="Upload secondary logo"
                    previewHeight={60}
                />
            </AdminSection>

            <AdminSection title="Center Ice Watermark" description="Semi-transparent logo on playing field">
                <ImageUploader
                    value={logos.watermark}
                    onChange={(url) => updateLogos({ watermark: url })}
                    placeholder="Upload watermark (PNG with transparency)"
                    previewHeight={100}
                />
                <div style={{ marginTop: '10px' }}>
                    <label
                        style={{
                            color: 'var(--color-text-secondary, #94A3B8)',
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-primary), sans-serif',
                        }}
                    >
                        Opacity
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={assets.watermarkOpacity ?? 30}
                            onChange={(e) => updateAssets({ watermarkOpacity: parseInt(e.target.value) })}
                            style={{ flex: 1, accentColor: 'var(--color-primary, #1E40AF)' }}
                        />
                        <span
                            style={{
                                color: 'var(--color-text-primary, #F8FAFC)',
                                fontFamily: 'monospace',
                                fontSize: '0.75rem',
                                width: '36px',
                                textAlign: 'right',
                            }}
                        >
                            {assets.watermarkOpacity ?? 30}%
                        </span>
                    </div>
                </div>
            </AdminSection>

            <AdminSection title="App Icon / Favicon" description="Browser tab and app launcher icon">
                <ImageUploader
                    value={logos.favicon}
                    onChange={(url) => updateLogos({ favicon: url })}
                    placeholder="Upload icon (square, 512×512 rec.)"
                    previewHeight={64}
                    previewStyle={{ borderRadius: '12px' }}
                />
            </AdminSection>

            <AdminSection title="Loading Screen" description="Logo shown while app loads">
                <ImageUploader
                    value={logos.loading}
                    onChange={(url) => updateLogos({ loading: url })}
                    placeholder="Upload loading logo"
                    previewHeight={100}
                />
            </AdminSection>

            {/* ── Game Assets ─────────────────────────────── */}

            <AdminSection title="Field Texture" description="Optional texture overlay on playing surface">
                <ImageUploader
                    value={assets.iceTexture}
                    onChange={(url) => updateAssets({ iceTexture: url })}
                    placeholder="Upload texture (seamless pattern)"
                    previewHeight={80}
                />
            </AdminSection>

            <AdminSection title="Crowd Background" description="Background image behind the field">
                <ImageUploader
                    value={assets.crowdBackground}
                    onChange={(url) => updateAssets({ crowdBackground: url })}
                    placeholder="Upload background image"
                    previewHeight={100}
                />
            </AdminSection>

            {/* ── Reset ───────────────────────────────────── */}
            <div style={{ padding: '1rem', textAlign: 'center' }}>
                <button
                    onClick={() => {
                        if (confirm('Reset all logos and assets to default?')) {
                            updateLogos({
                                primary: { url: '', width: 200, height: 60 },
                                secondary: '',
                                watermark: '',
                                favicon: '',
                                loading: '',
                            });
                            updateAssets({
                                iceTexture: '',
                                crowdBackground: '',
                                watermarkOpacity: 30,
                            });
                        }
                    }}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: 'var(--color-background, #0F172A)',
                        color: 'var(--color-text-secondary, #94A3B8)',
                        border: '1px solid var(--color-scoreboard-border, #334155)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-primary), sans-serif',
                    }}
                >
                    🗑️ Reset All Assets
                </button>
            </div>
        </div>
    );
}

// ── Size Input ───────────────────────────────────────────────

function SizeInput({
    label,
    value,
    onChange,
}: {
    label: string;
    value: number;
    onChange: (v: number) => void;
}) {
    return (
        <div style={{ flex: 1 }}>
            <label
                style={{
                    color: 'var(--color-text-secondary, #94A3B8)',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-primary), sans-serif',
                }}
            >
                {label}
            </label>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                style={{
                    width: '100%',
                    padding: '8px',
                    marginTop: '4px',
                    backgroundColor: 'var(--color-background, #0F172A)',
                    border: '1px solid var(--color-scoreboard-border, #334155)',
                    borderRadius: '6px',
                    color: 'var(--color-text-primary, #F8FAFC)',
                    boxSizing: 'border-box',
                    fontFamily: 'monospace',
                    fontSize: '0.82rem',
                    outline: 'none',
                }}
            />
        </div>
    );
}
