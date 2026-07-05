import { dataStore } from './dataStore.js';

export const HallOfFameService = {
  async list({ tournamentId } = {}) { return dataStore.list('hallOfFame', tournamentId ? { tournamentId } : {}); },
  async create(data, adminId) {
    const record = await dataStore.add('hallOfFame', data, 'hof');
    await dataStore.logActivity({ adminId, action: 'Create', targetType: 'HallOfFame', targetId: record.id, description: `เพิ่ม Hall of Fame: ${record.title}` });
    return record;
  },
  async update(id, patch, adminId) {
    const record = await dataStore.update('hallOfFame', id, patch);
    await dataStore.logActivity({ adminId, action: 'Edit', targetType: 'HallOfFame', targetId: id, description: 'แก้ไข Hall of Fame' });
    return record;
  },
  async remove(id, adminId) { await dataStore.softDelete('hallOfFame', id, adminId); },
};
