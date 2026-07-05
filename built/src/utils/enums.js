/**
 * PART 13 — Enumeration Specification
 * Single source of truth for every constant used across the system.
 * Never hardcode these strings elsewhere — import from here.
 */

export const SystemStatus = Object.freeze({
  ACTIVE: 'Active',
  MAINTENANCE: 'Maintenance',
  OFFLINE: 'Offline',
});

export const TournamentStatus = Object.freeze({
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  RUNNING: 'Running',
  FINISHED: 'Finished',
  ARCHIVED: 'Archived',
});

export const MatchStatus = Object.freeze({
  SCHEDULED: 'Scheduled',
  RUNNING: 'Running',
  PAUSED: 'Paused',
  FINISHED: 'Finished',
  CANCELLED: 'Cancelled',
});

export const BoardStatus = Object.freeze({
  IDLE: 'Idle',
  RUNNING: 'Running',
  FINISHED: 'Finished',
  OFFLINE: 'Offline',
});

export const PlayerStatus = Object.freeze({
  ACTIVE: 'Active',
  WITHDRAWN: 'Withdrawn',
  DISQUALIFIED: 'Disqualified',
});

export const TeamStatus = Object.freeze({
  ACTIVE: 'Active',
  WITHDRAWN: 'Withdrawn',
});

export const ResultType = Object.freeze({
  WIN: 'Win',
  LOSE: 'Lose',
  DRAW: 'Draw',
  WALKOVER: 'Walkover',
  DISQUALIFIED: 'Disqualified',
});

export const ResultReason = Object.freeze({
  CHECKMATE: 'Checkmate',
  RESIGNATION: 'Resignation',
  TIMEOUT: 'Timeout',
  AGREEMENT: 'Agreement',
  STALEMATE: 'Stalemate',
  REPETITION: 'Threefold Repetition',
  INSUFFICIENT_MATERIAL: 'Insufficient Material',
  WALKOVER_NO_SHOW: 'No Show',
  DISQUALIFICATION: 'Rule Violation',
  JUDGE_DECISION: 'Judge Decision',
});

export const GameType = Object.freeze({
  CHESS: 'Chess',
  THAI_CHESS: 'Thai Chess',
  CHECKERS: 'Checkers',
});

export const PieceColor = Object.freeze({
  WHITE: 'White',
  BLACK: 'Black',
});

export const Visibility = Object.freeze({
  PUBLIC: 'Public',
  HIDDEN: 'Hidden',
  ARCHIVED: 'Archived',
});

export const Role = Object.freeze({
  SUPER_ADMIN: 'Super Admin',
  TOURNAMENT_ADMIN: 'Tournament Admin',
  RECORDER: 'Recorder',
  JUDGE: 'Judge',
});

export const PermissionAction = Object.freeze({
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  PUBLISH: 'publish',
  OVERRIDE: 'override',
});

export const LogType = Object.freeze({
  LOGIN: 'Login',
  CREATE: 'Create',
  EDIT: 'Edit',
  DELETE: 'Delete',
  RESTORE: 'Restore',
  PUBLISH: 'Publish',
  LOCK: 'Lock',
  UNLOCK: 'Unlock',
  OVERRIDE: 'Override',
  EXPORT: 'Export',
  IMPORT: 'Import',
});

export const ErrorCode = Object.freeze({
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  BAD_REQUEST: 400,
  SERVER_ERROR: 500,
});

export const ValidationStatus = Object.freeze({
  VALID: 'Valid',
  WARNING: 'Warning',
  ILLEGAL: 'Illegal',
});

export const Theme = Object.freeze({
  LIGHT: 'light',
  DARK: 'dark',
});

export const SortOrder = Object.freeze({
  ASC: 'asc',
  DESC: 'desc',
});

export const FilterType = Object.freeze({
  TOURNAMENT: 'tournament',
  ROUND: 'round',
  HALL: 'hall',
  BOARD: 'board',
  TEAM: 'team',
  PLAYER: 'player',
  STATUS: 'status',
});

export const PaginationDefault = Object.freeze({
  PAGE_SIZE: 12,
  ADMIN_PAGE_SIZE: 20,
});

export const TargetType = Object.freeze({
  PLAYER: 'Player',
  TEAM: 'Team',
});

export const BoardLayoutOptions = Object.freeze([4, 6, 8, 12, 16]);
