import { dataStore } from './dataStore.js';
import { BoardStatus } from '../utils/enums.js';

export const BoardService = {
  async list({ hallId } = {}) { return dataStore.list('boards', hallId ? { hallId } : {}); },
  async get(id) { return dataStore.get('boards', id); },
  async create(data, adminId) {
    const record = await dataStore.add('boards', { status: BoardStatus.IDLE, currentMatchId: null, ...data }, 'board');
    await dataStore.logActivity({ adminId, action: 'Create', targetType: 'Board', targetId: record.id, description: `สร้างกระดาน: ${record.name}` });
    return record;
  },
  async update(id, patch, adminId) {
    const record = await dataStore.update('boards', id, patch);
    await dataStore.logActivity({ adminId, action: 'Edit', targetType: 'Board', targetId: id, description: 'แก้ไขกระดาน' });
    return record;
  },
  async setCurrentMatch(boardId, matchId, status, adminId) {
    return this.update(boardId, { currentMatchId: matchId, status }, adminId);
  },
  subscribe(filters, callback) { return dataStore.subscribe('boards', filters, callback); },
};
