import { dataStore } from './dataStore.js';

export const NewsService = {
  async list({ tournamentId } = {}) {
    const rows = await dataStore.list('news', tournamentId ? { tournamentId } : {});
    return rows.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  },
  async get(id) { return dataStore.get('news', id); },
  async create(data, adminId) {
    const record = await dataStore.add('news', { publishedAt: new Date().toISOString(), ...data }, 'news');
    await dataStore.logActivity({ adminId, action: 'Create', targetType: 'News', targetId: record.id, description: `เผยแพร่ข่าว: ${record.title}` });
    return record;
  },
  async update(id, patch, adminId) {
    const record = await dataStore.update('news', id, patch);
    await dataStore.logActivity({ adminId, action: 'Edit', targetType: 'News', targetId: id, description: 'แก้ไขข่าว' });
    return record;
  },
  async remove(id, adminId) {
    await dataStore.softDelete('news', id, adminId);
    await dataStore.logActivity({ adminId, action: 'Delete', targetType: 'News', targetId: id, description: 'ลบข่าว' });
  },
};
