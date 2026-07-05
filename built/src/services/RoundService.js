import { dataStore } from './dataStore.js';

export const RoundService = {
  async list({ scheduleId } = {}) { return dataStore.list('rounds', scheduleId ? { scheduleId } : {}); },
  async get(id) { return dataStore.get('rounds', id); },
  async create(data, adminId) {
    const record = await dataStore.add('rounds', data, 'round');
    await dataStore.logActivity({ adminId, action: 'Create', targetType: 'Round', targetId: record.id, description: `สร้างรอบ: ${record.name}` });
    return record;
  },
  async update(id, patch, adminId) {
    const record = await dataStore.update('rounds', id, patch);
    await dataStore.logActivity({ adminId, action: 'Edit', targetType: 'Round', targetId: id, description: 'แก้ไขรอบการแข่งขัน' });
    return record;
  },
  async setStatus(id, status, adminId) { return this.update(id, { status }, adminId); },
};
