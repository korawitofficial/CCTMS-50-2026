import { dataStore } from './dataStore.js';
import { Visibility } from '../utils/enums.js';

export const TournamentService = {
  async list({ eventId, publicOnly = false, status } = {}) {
    const filters = {};
    if (eventId) filters.eventId = eventId;
    if (status) filters.status = status;
    if (publicOnly) filters.visibility = Visibility.PUBLIC;
    return dataStore.list('tournaments', filters);
  },
  async get(id) { return dataStore.get('tournaments', id); },
  async getBySlug(slug) { return dataStore.getBySlug('tournaments', slug); },
  async create(data, adminId) {
    const record = await dataStore.add('tournaments', { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: adminId, updatedBy: adminId }, 'tour');
    await dataStore.logActivity({ adminId, action: 'Create', targetType: 'Tournament', targetId: record.id, description: `สร้าง Tournament: ${record.name}` });
    return record;
  },
  async update(id, patch, adminId) {
    const record = await dataStore.update('tournaments', id, { ...patch, updatedAt: new Date().toISOString(), updatedBy: adminId });
    await dataStore.logActivity({ adminId, action: 'Edit', targetType: 'Tournament', targetId: id, description: `แก้ไข Tournament: ${record?.name || id}` });
    return record;
  },
  async setStatus(id, status, adminId) {
    const record = await dataStore.update('tournaments', id, { status, updatedAt: new Date().toISOString(), updatedBy: adminId });
    await dataStore.logActivity({ adminId, action: 'Publish', targetType: 'Tournament', targetId: id, description: `เปลี่ยนสถานะเป็น ${status}` });
    return record;
  },
  async hide(id, adminId) { await dataStore.softDelete('tournaments', id, adminId); await dataStore.logActivity({ adminId, action: 'Delete', targetType: 'Tournament', targetId: id, description: 'ซ่อน Tournament' }); },
  async restore(id, adminId) { await dataStore.restore('tournaments', id, adminId); await dataStore.logActivity({ adminId, action: 'Restore', targetType: 'Tournament', targetId: id, description: 'กู้คืน Tournament' }); },
};
