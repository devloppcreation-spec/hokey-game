/**
 * SoundUploader Component
 *
 * Click-to-browse audio uploader with base64 conversion,
 * file type / size validation, and error display.
 */

import { useRef, useState } from 'react';

interface SoundUploaderProps {
    value: string;
    onChange: (url: string) => void;
}

export function SoundUploader({ value: _value, onChange }: SoundUploaderProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        setError(null);

        if (!file.type.startsWith('audio/')) {
            setError('Please upload an audio file (MP3, WAV, OGG)');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError('Audio file must be less than 2 MB');
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

    return (
        <div>
            <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                    border: '2px dashed var(--color-scoreboard-border, #334155)',
                    borderRadius: '8px',
                    padding: '14px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: 'var(--color-background, #0F172A)',
                    transition: 'border-color 0.2s ease',
                }}
            >
                {isLoading ? (
                    <span
                        style={{
                            color: 'var(--color-text-secondary, #94A3B8)',
                            fontSize: '0.78rem',
                        }}
                    >
                        Uploading…
                    </span>
                ) : (
                    <>
                        <div style={{ fontSize: '22px', marginBottom: '4px', lineHeight: 1 }}>
                            🎵
                        </div>
                        <p
                            style={{
                                color: 'var(--color-text-secondary, #94A3B8)',
                                margin: 0,
                                fontSize: '0.72rem',
                                fontFamily: 'var(--font-primary), sans-serif',
                            }}
                        >
                            Upload custom sound (MP3, WAV, OGG)
                        </p>
                    </>
                )}
            </div>

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

            <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                }}
                style={{ display: 'none' }}
            />
        </div>
    );
}
