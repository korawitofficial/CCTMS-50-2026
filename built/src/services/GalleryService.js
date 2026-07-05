import { dataStore } from './dataStore.js';

export const GalleryService = {
  async list({ tournamentId } = {}) {
    const rows = await dataStore.list('gallery', tournamentId ? { tournamentId } : {});
    return rows.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  },
  async add(data, adminId) {
    const record = await dataStore.add('gallery', { uploadedAt: new Date().toISOString(), ...data }, 'gal');
    await dataStore.logActivity({ adminId, action: 'Create', targetType: 'Gallery', targetId: record.id, description: 'เพิ่มรูปภาพ' });
    return record;
  },
  async remove(id, adminId) {
    await dataStore.softDelete('gallery', id, adminId);
    await dataStore.logActivity({ adminId, action: 'Delete', targetType: 'Gallery', targetId: id, description: 'ลบรูปภาพ' });
  },
};
