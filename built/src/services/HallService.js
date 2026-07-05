import { dataStore } from './dataStore.js';

export const HallService = {
  async list({ roundId } = {}) { return dataStore.list('halls', roundId ? { roundId } : {}); },
  async get(id) { return dataStore.get('halls', id); },
  async create(data, adminId) {
    const record = await dataStore.add('halls', data, 'hall');
    await dataStore.logActivity({ adminId, action: 'Create', targetType: 'Hall', targetId: record.id, description: `สร้างพื้นที่แข่งขัน: ${record.name}` });
    return record;
  },
  async update(id, patch, adminId) {
    const record = await dataStore.update('halls', id, patch);
    await dataStore.logActivity({ adminId, action: 'Edit', targetType: 'Hall', targetId: id, description: 'แก้ไขพื้นที่แข่งขัน' });
    return record;
  },
};
