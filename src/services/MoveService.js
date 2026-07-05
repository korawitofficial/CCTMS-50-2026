import { dataStore } from './dataStore.js';
import { MatchService } from './MatchService.js';

export const MoveService = {
  async list(matchId) {
    const rows = await dataStore.list('moves', { matchId });
    return rows.filter((m) => !m.__deleted).sort((a, b) => a.moveNumber - b.moveNumber);
  },

  async record({ matchId, side, san, fen, isIllegal = false }, adminId) {
    const existing = await this.list(matchId);
    const moveNumber = existing.length + 1;
    const move = await dataStore.add('moves', {
      matchId, moveNumber, side, san, fen, isIllegal, judgeNote: '',
      createdAt: new Date().toISOString(),
    }, 'mv');
    await MatchService.updatePosition(matchId, { currentPosition: fen, moveCount: moveNumber });
    await dataStore.logActivity({ adminId, action: 'Edit', targetType: 'Move', targetId: move.id, description: `บันทึกการเดิน ${san} (${side})${isIllegal ? ' — มีคำเตือน Validation' : ''}` });
    return move;
  },

  async undoLast(matchId, adminId) {
    const moves = await this.list(matchId);
    const last = moves[moves.length - 1];
    if (!last) return null;
    await dataStore.update('moves', last.id, { __deleted: true });
    const remaining = await this.list(matchId);
    const newLast = remaining[remaining.length - 1];
    await MatchService.updatePosition(matchId, { currentPosition: newLast?.fen || null, moveCount: remaining.length });
    await dataStore.logActivity({ adminId, action: 'Edit', targetType: 'Move', targetId: last.id, description: 'Undo การเดินล่าสุด' });
    return last;
  },

  subscribe(matchId, callback) {
    return dataStore.subscribe('moves', { matchId }, (rows) => callback(rows.filter((m) => !m.__deleted).sort((a, b) => a.moveNumber - b.moveNumber)));
  },
};
