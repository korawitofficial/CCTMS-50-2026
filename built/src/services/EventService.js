import { dataStore } from './dataStore.js';
import { Visibility } from '../utils/enums.js';

export const EventService = {
  async list({ publicOnly = false } = {}) {
    const filters = publicOnly ? { visibility: Visibility.PUBLIC } : {};
    return dataStore.list('events', filters);
  },
  async get(id) { return dataStore.get('events', id); },
  async getBySlug(slug) { return dataStore.getBySlug('events', slug); },
  async create(data, adminId) {
    const record = await dataStore.add('events', { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: adminId, updatedBy: adminId }, 'event');
    await dataStore.logActivity({ adminId, action: 'Create', targetType: 'Event', targetId: record.id, description: `สร้าง Event: ${record.name}` });
    return record;
  },
  async update(id, patch, adminId) {
    const record = await dataStore.update('events', id, { ...patch, updatedAt: new Date().toISOString(), updatedBy: adminId });
    await dataStore.logActivity({ adminId, action: 'Edit', targetType: 'Event', targetId: id, description: `แก้ไข Event: ${record?.name || id}` });
    return record;
  },
  async hide(id, adminId) {
    await dataStore.softDelete('events', id, adminId);
    await dataStore.logActivity({ adminId, action: 'Delete', targetType: 'Event', targetId: id, description: 'ซ่อน Event' });
  },
  async restore(id, adminId) {
    await dataStore.restore('events', id, adminId);
    await dataStore.logActivity({ adminId, action: 'Restore', targetType: 'Event', targetId: id, description: 'กู้คืน Event' });
  },
};
