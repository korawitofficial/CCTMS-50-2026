import { dataStore } from './dataStore.js';
import { MatchService } from './MatchService.js';

export const ResultService = {
  async get(matchId) {
    const rows = await dataStore.list('results', { matchId });
    return rows[0] || null;
  },
  async list({ tournamentId } = {}) {
    const results = await dataStore.list('results');
    if (!tournamentId) return results;
    const matches = await dataStore.list('matches', { tournamentId });
    const matchIds = new Set(matches.map((m) => m.id));
    return results.filter((r) => matchIds.has(r.matchId));
  },

  async submit({ matchId, winner, resultType, reason, note }, adminId) {
    const record = await dataStore.add('results', {
      matchId, winner, resultType, reason, note: note || '',
      approvedBy: null, approvedAt: null,
    }, 'result');
    await dataStore.update('matches', matchId, { resultId: record.id });
    await dataStore.logActivity({ adminId, action: 'Create', targetType: 'Result', targetId: record.id, description: `ส่งผลการแข่งขันรออนุมัติ (${resultType})` });
    return record;
  },

  async approve(resultId, adminId) {
    const result = await dataStore.update('results', resultId, { approvedBy: adminId, approvedAt: new Date().toISOString() });
    if (result) await MatchService.finish(result.matchId, adminId);
    await dataStore.logActivity({ adminId, action: 'Override', targetType: 'Result', targetId: resultId, description: 'กรรมการอนุมัติผลการแข่งขัน' });
    return result;
  },

  async amend(resultId, patch, adminId, reason) {
    const before = await dataStore.get('results', resultId);
    const after = await dataStore.update('results', resultId, patch);
    await dataStore.logAudit({ adminId, targetType: 'Result', targetId: resultId, oldValue: before, newValue: after, reason });
    await dataStore.logActivity({ adminId, action: 'Override', targetType: 'Result', targetId: resultId, description: `แก้ไขผลย้อนหลัง: ${reason || ''}` });
    return after;
  },

  subscribe(filters, callback) { return dataStore.subscribe('results', filters, callback); },
};
