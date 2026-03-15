/**
 * App Configuration
 *
 * Set DEV_MODE_ENABLED to false before building for clients.
 * When false, the admin panel is completely inaccessible.
 */

export const APP_CONFIG = {
    /** Set to false to completely disable dev mode access. */
    DEV_MODE_ENABLED: true,

    /** App version. */
    VERSION: '1.0.0',
} as const;
