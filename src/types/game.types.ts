/**
 * Game Entity Type Definitions
 *
 * Comprehensive types for the hockey game engine: physics,
 * entities, configuration, input, and game state machine.
 */

// ── Geometry ──────────────────────────────────────────────────

export interface Vec2 {
    x: number;
    y: number;
}

// ── Game Status ───────────────────────────────────────────────

export type GameStatus =
    | 'idle'
    | 'countdown'
    | 'playing'
    | 'goal'
    | 'paused'
    | 'ended';

// ── Player Controls Mapping ───────────────────────────────────

export interface PlayerControls {
    up: string;
    down: string;
    left: string;
    right: string;
}

// ── Puck State ────────────────────────────────────────────────

export interface PuckState {
    position: Vec2;
    velocity: Vec2;
    radius: number;
    maxSpeed: number;
    trail: Vec2[];
    lastTouchedBy: number | null; // 0 or 1
}

// ── Player State ──────────────────────────────────────────────

export interface PlayerState {
    index: number; // 0 = player 1, 1 = player 2
    position: Vec2;
    velocity: Vec2;
    stickRadius: number;
    speed: number;
    score: number;
    name: string;
    controls: PlayerControls;
    zoneBounds: { minX: number; maxX: number; minY: number; maxY: number };
}

// ── Rink Dimensions ───────────────────────────────────────────

export interface RinkDimensions {
    width: number;
    height: number;
    cornerRadius: number;
    borderWidth: number;
    centerCircleRadius: number;
    centerLineX: number;
    faceoffCircleRadius: number;
    faceoffSpots: Vec2[];
    goalWidth: number;
    goalDepth: number;
    creaseRadius: number;
}

// ── Goal ──────────────────────────────────────────────────────

export interface GoalState {
    /** 'left' or 'right' – which end of the rink */
    side: 'left' | 'right';
    /** Rectangle defining the goal opening */
    opening: { x: number; y: number; width: number; height: number };
    /** Rectangle defining the net depth behind the goal line */
    net: { x: number; y: number; width: number; height: number };
    /** Centre of the crease semi-circle */
    creaseCenter: Vec2;
    creaseRadius: number;
}

// ── Game Config ───────────────────────────────────────────────

export interface GameConfig {
    scoreToWin: number;
    matchDuration: number | null; // seconds, null = unlimited
    countdownSeconds: number;
    celebrationDuration: number; // ms
    friction: number; // ice friction coefficient
    puckBounce: number; // restitution coefficient for walls
    puckMaxSpeed: number;
    playerSpeed: number;
    playerStickRadius: number;
    puckRadius: number;
    goalWidth: number;
    goalDepth: number;
}

// ── Game Stats ────────────────────────────────────────────────

export interface GameStats {
    shots: [number, number];
    goals: [number, number];
    possession: [number, number]; // seconds
    totalPlayTime: number; // seconds
}

// ── Full Game State ───────────────────────────────────────────

export interface GameState {
    status: GameStatus;
    players: [PlayerState, PlayerState];
    puck: PuckState;
    goals: [GoalState, GoalState]; // [left, right]
    rink: RinkDimensions;
    config: GameConfig;
    stats: GameStats;
    scores: [number, number];
    countdownRemaining: number;
    matchTimeRemaining: number | null;
    lastGoalBy: number | null; // which player scored
    winner: number | null;
}

// ── Input State ───────────────────────────────────────────────

export interface InputState {
    keys: Set<string>;
    touches: Map<number, { x: number; y: number; playerId: number }>;
}
