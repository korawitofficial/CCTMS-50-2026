import { dataStore } from './dataStore.js';

export const ScheduleService = {
  async list({ tournamentId } = {}) { return dataStore.list('schedules', tournamentId ? { tournamentId } : {}); },
  async get(id) { return dataStore.get('schedules', id); },
  async create(data, adminId) {
    const record = await dataStore.add('schedules', data, 'sched');
    await dataStore.logActivity({ adminId, action: 'Create', targetType: 'Schedule', targetId: record.id, description: `สร้างตารางแข่งขัน: ${record.name}` });
    return record;
  },
  async update(id, patch, adminId) {
    const record = await dataStore.update('schedules', id, patch);
    await dataStore.logActivity({ adminId, action: 'Edit', targetType: 'Schedule', targetId: id, description: 'แก้ไขตารางแข่งขัน' });
    return record;
  },
};
