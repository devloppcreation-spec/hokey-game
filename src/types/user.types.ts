/**
 * User Type Definitions
 *
 * Session and player identity types for the email sign-in flow.
 */

export interface UserSession {
    email: string;
    acceptedTerms: boolean;
    acceptedAt: string; // ISO timestamp
    sessionId: string;
}

export interface PlayerInfo {
    email: string;
    displayName: string; // extracted from email or entered
    playerNumber: 1 | 2;
}
