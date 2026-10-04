// Global tuning knobs. Change numbers here rather than hunting through the code.

export const TILE = 16;                 // world pixels per tile
export const GROUND_SCALE = 2;          // ground is painted at 2x so 32px custom tiles stay crisp

export const SAVE_KEY = 'project-princess-save-v3';
export const LEGACY_SAVE_KEYS = ['whisker-hollow-v2']; // the single-file prototype's save

export const WALK_SPEED = 64;           // world px per second
export const RUN_SPEED = 108;
export const PET_SPEED = 26;

// Camera: the short side of the screen always shows at least this many tiles.
export const MIN_TILES_SHORT_SIDE = 11;

// Clock. The day runs 6:00am to 2:00am (26 * 60 minutes), like Stardew.
export const DAY_START = 6 * 60;
export const DAY_END = 26 * 60;
export const MS_PER_GAME_MINUTE = 700;  // 10 game minutes = 7 real seconds

// Friendship. 25 points = one heart, 10 hearts max.
export const POINTS_PER_HEART = 25;
export const MAX_HEARTS = 10;
export const FRIENDSHIP = { talk: 10, love: 45, like: 25, neutral: 10, dislike: -15 };

export const RAIN_CHANCE = 0.3;         // chance each day has a Melbourne shower

export const ART_PATH = 'assets/sprites/';
