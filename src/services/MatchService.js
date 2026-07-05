import { dataStore } from './dataStore.js';
import { MatchStatus, BoardStatus } from '../utils/enums.js';
import { BoardService } from './BoardService.js';

export const MatchService = {
  async list({ tournamentId, boardId, roundId, status } = {}) {
    const filters = {};
    if (tournamentId) filters.tournamentId = tournamentId;
    if (boardId) filters.boardId = boardId;
    if (roundId) filters.roundId = roundId;
    if (status) filters.status = status;
    return dataStore.list('matches', filters);
  },
  async get(id) { return dataStore.get('matches', id); },

  async create(data, adminId) {
    const record = await dataStore.add('matches', {
      moveCount: 0, status: MatchStatus.SCHEDULED, currentPosition: null,
      resultId: null, startedAt: null, finishedAt: null, ...data,
    }, 'match');
    await dataStore.logActivity({ adminId, action: 'Create', targetType: 'Match', targetId: record.id, description: 'สร้างคู่แข่งขันใหม่' });
    return record;
  },

  async start(matchId, adminId) {
    const match = await dataStore.get('matches', matchId);
    if (!match) throw new Error('ไม่พบการแข่งขัน');
    const runningOnBoard = await dataStore.list('matches', { boardId: match.boardId, status: MatchStatus.RUNNING });
    if (runningOnBoard.length > 0 && runningOnBoard[0].id !== matchId) {
      throw new Error('กระดานนี้มีการแข่งขันที่กำลังดำเนินอยู่แล้ว');
    }
    const updated = await dataStore.update('matches', matchId, { status: MatchStatus.RUNNING, startedAt: new Date().toISOString() });
    await BoardService.setCurrentMatch(match.boardId, matchId, BoardStatus.RUNNING, adminId);
    await dataStore.logActivity({ adminId, action: 'Edit', targetType: 'Match', targetId: matchId, description: 'เริ่มการแข่งขัน' });
    return updated;
  },

  async finish(matchId, adminId) {
    const match = await dataStore.get('matches', matchId);
    const updated = await dataStore.update('matches', matchId, { status: MatchStatus.FINISHED, finishedAt: new Date().toISOString() });
    if (match) await BoardService.setCurrentMatch(match.boardId, null, BoardStatus.FINISHED, adminId);
    await dataStore.logActivity({ adminId, action: 'Edit', targetType: 'Match', targetId: matchId, description: 'จบการแข่งขัน' });
    return updated;
  },

  async updatePosition(matchId, { currentPosition, moveCount }) {
    return dataStore.update('matches', matchId, { currentPosition, moveCount });
  },

  subscribe(filters, callback) { return dataStore.subscribe('matches', filters, callback); },
};
