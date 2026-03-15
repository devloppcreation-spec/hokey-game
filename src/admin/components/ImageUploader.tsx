/**
 * ImageUploader Component
 *
 * Drag-and-drop / click-to-browse image uploader with base64
 * conversion, URL input, live preview, and remove button.
 */

import { useState, useRef, type CSSProperties } from 'react';

interface ImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
    placeholder?: string;
    previewHeight?: number;
    previewStyle?: CSSProperties;
}

export function ImageUploader({
    value,
    onChange,
    placeholder = 'Upload image',
    previewHeight = 80,
    previewStyle = {},
}: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        setError(null);

        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5 MB');
            return;
        }

        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = () => {
            onChange(reader.result as string);
            setIsLoading(false);
        };
        reader.onerror = () => {
            setError('Failed to read file');
            setIsLoading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <div>
            {/* Preview */}
            {value && (
                <div
                    style={{
                        position: 'relative',
                        marginBottom: '10px',
                        backgroundColor: 'var(--color-background, #0F172A)',
                        borderRadius: '8px',
                        padding: '14px',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <img
                        src={value}
                        alt="Preview"
                        style={{
                            maxHeight: previewHeight,
                            maxWidth: '100%',
                            objectFit: 'contain',
                            ...previewStyle,
                        }}
                    />
                    <button
                        onClick={() => onChange('')}
                        style={{
                            position: 'absolute',
                            top: '6px',
                            right: '6px',
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '11px',
                            lineHeight: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Drop zone */}
            <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                style={{
                    border: `2px dashed ${isDragging ? 'var(--color-primary, #1E40AF)' : 'var(--color-scoreboard-border, #334155)'}`,
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isDragging
                        ? 'rgba(30, 64, 175, 0.08)'
                        : 'var(--color-background, #0F172A)',
                    transition: 'all 0.2s ease',
                }}
            >
                {isLoading ? (
                    <span
                        style={{
                            color: 'var(--color-text-secondary, #94A3B8)',
                            fontSize: '0.8rem',
                        }}
                    >
                        Uploading…
                    </span>
                ) : (
                    <>
                        <div style={{ fontSize: '28px', marginBottom: '6px', lineHeight: 1 }}>📁</div>
                        <p
                            style={{
                                color: 'var(--color-text-secondary, #94A3B8)',
                                margin: 0,
                                fontSize: '0.78rem',
                                fontFamily: 'var(--font-primary), sans-serif',
                            }}
                        >
                            {placeholder}
                        </p>
                        <p
                            style={{
                                color: 'var(--color-text-secondary, #94A3B8)',
                                margin: '6px 0 0',
                                fontSize: '0.68rem',
                                opacity: 0.6,
                                fontFamily: 'var(--font-primary), sans-serif',
                            }}
                        >
                            Drag &amp; drop or click to browse
                        </p>
                    </>
                )}
            </div>

            {/* URL input */}
            <div style={{ marginTop: '8px' }}>
                <input
                    type="text"
                    value={value.startsWith('data:') ? '' : value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Or paste image URL…"
                    style={{
                        width: '100%',
                        padding: '8px 10px',
                        backgroundColor: 'var(--color-background, #0F172A)',
                        border: '1px solid var(--color-scoreboard-border, #334155)',
                        borderRadius: '6px',
                        color: 'var(--color-text-primary, #F8FAFC)',
                        fontSize: '0.72rem',
                        fontFamily: 'monospace',
                        boxSizing: 'border-box',
                        outline: 'none',
                    }}
                />
            </div>

            {/* Error */}
            {error && (
                <p
                    style={{
                        color: '#ef4444',
                        fontSize: '0.72rem',
                        marginTop: '6px',
                        fontFamily: 'var(--font-primary), sans-serif',
                    }}
                >
                    {error}
                </p>
            )}

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                style={{ display: 'none' }}
            />
        </div>
    );
}
