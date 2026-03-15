/**
 * Sport Theme Type Definitions
 *
 * Visual theme that changes the stadium/field appearance and ball/puck look.
 * Gameplay stays the same (hockey physics) — only visuals change.
 */

export type SportType = 'hockey' | 'soccer' | 'basketball' | 'tennis' | 'volleyball';

export interface SportTheme {
    id: SportType;
    name: string;
    icon: string; // emoji

    /** Field / Stadium appearance */
    field: {
        backgroundColor: string;
        surfaceTexture?: string;
        lineColor: string;
        borderColor: string;
        borderWidth: number;
        centerCircleColor: string;
        centerLogoEnabled: boolean;
    };

    /** Goal / Scoring area appearance */
    goals: {
        color: string;
        glowColor: string;
        style: 'net' | 'hoop' | 'zone';
        width: number;
        height: number;
    };

    /** Ball / Puck appearance */
    ball: {
        shape: 'circle' | 'sphere';
        size: number;
        color: string;
        texture?: string;
        pattern: 'solid' | 'soccer' | 'basketball' | 'tennis' | 'volleyball';
        glowColor: string;
        trailColor: string;
        shadow: boolean;
    };

    /** Player paddle appearance */
    paddle: {
        style: 'stick' | 'foot' | 'hand' | 'racket';
        color1: string;
        color2: string;
    };

    /** Sound theme */
    sounds: {
        hitSound: string;
        goalSound: string;
        ambientSound: string;
    };
}
