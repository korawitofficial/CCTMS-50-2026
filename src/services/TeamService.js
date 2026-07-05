import { dataStore } from './dataStore.js';
import { Visibility } from '../utils/enums.js';

export const TeamService = {
  async list({ tournamentId, publicOnly = false } = {}) {
    const filters = {};
    if (tournamentId) filters.tournamentId = tournamentId;
    if (publicOnly) filters.visibility = Visibility.PUBLIC;
    return dataStore.list('teams', filters);
  },
  async get(id) { return dataStore.get('teams', id); },
  async getBySlug(slug) { return dataStore.getBySlug('teams', slug); },
  async create(data, adminId) {
    const record = await dataStore.add('teams', { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: adminId, updatedBy: adminId }, 'team');
    await dataStore.logActivity({ adminId, action: 'Create', targetType: 'Team', targetId: record.id, description: `เพิ่มทีม: ${record.name}` });
    return record;
  },
  async update(id, patch, adminId) {
    const record = await dataStore.update('teams', id, { ...patch, updatedAt: new Date().toISOString(), updatedBy: adminId });
    await dataStore.logActivity({ adminId, action: 'Edit', targetType: 'Team', targetId: id, description: `แก้ไขทีม: ${record?.name || id}` });
    return record;
  },
  async hide(id, adminId) { await dataStore.softDelete('teams', id, adminId); await dataStore.logActivity({ adminId, action: 'Delete', targetType: 'Team', targetId: id, description: 'ซ่อนทีม' }); },
  async restore(id, adminId) { await dataStore.restore('teams', id, adminId); },
  async rosterOf(teamId) { return dataStore.list('players', { teamId }); },
};
