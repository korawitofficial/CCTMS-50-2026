import { dataStore } from './dataStore.js';
import { Visibility } from '../utils/enums.js';

export const PlayerService = {
  async list({ tournamentId, teamId, publicOnly = false } = {}) {
    const filters = {};
    if (tournamentId) filters.tournamentId = tournamentId;
    if (teamId) filters.teamId = teamId;
    if (publicOnly) filters.visibility = Visibility.PUBLIC;
    return dataStore.list('players', filters);
  },
  async get(id) { return dataStore.get('players', id); },
  async getBySlug(slug) { return dataStore.getBySlug('players', slug); },
  async create(data, adminId) {
    const displayName = data.displayName || `${data.firstName || ''} ${data.lastName || ''}`.trim();
    const record = await dataStore.add('players', { ...data, displayName, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: adminId, updatedBy: adminId }, 'player');
    await dataStore.logActivity({ adminId, action: 'Create', targetType: 'Player', targetId: record.id, description: `เพิ่มผู้เล่น: ${record.displayName}` });
    return record;
  },
  async update(id, patch, adminId) {
    const record = await dataStore.update('players', id, { ...patch, updatedAt: new Date().toISOString(), updatedBy: adminId });
    await dataStore.logActivity({ adminId, action: 'Edit', targetType: 'Player', targetId: id, description: `แก้ไขผู้เล่น: ${record?.displayName || id}` });
    return record;
  },
  async hide(id, adminId) { await dataStore.softDelete('players', id, adminId); await dataStore.logActivity({ adminId, action: 'Delete', targetType: 'Player', targetId: id, description: 'ซ่อนผู้เล่น' }); },
  async restore(id, adminId) { await dataStore.restore('players', id, adminId); },
  async matchHistory(playerId) {
    const matches = await dataStore.list('matches');
    return matches.filter((m) => m.whitePlayerId === playerId || m.blackPlayerId === playerId);
  },
};
