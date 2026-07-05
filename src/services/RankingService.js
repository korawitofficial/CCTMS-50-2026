import { dataStore } from './dataStore.js';
import { TargetType } from '../utils/enums.js';
import { StatisticsService } from './StatisticsService.js';

export const RankingService = {
  async list({ tournamentId, targetType = TargetType.TEAM } = {}) {
    const filters = { targetType };
    if (tournamentId) filters.tournamentId = tournamentId;
    const rows = await dataStore.list('rankings', filters);
    return rows.sort((a, b) => a.rank - b.rank);
  },
  async recompute(tournamentId) {
    const stats = (await StatisticsService.listByTournament(tournamentId)).slice().sort((a, b) => b.score - a.score);
    for (let i = 0; i < stats.length; i++) {
      const s = stats[i];
      const existingRows = await dataStore.list('rankings', { tournamentId, targetId: s.targetId });
      const existing = existingRows[0];
      const patch = { rank: i + 1, score: s.score, updatedAt: new Date().toISOString() };
      if (existing) await dataStore.update('rankings', existing.id, patch);
      else await dataStore.add('rankings', { tournamentId, targetType: TargetType.TEAM, targetId: s.targetId, ...patch }, 'rank');
    }
  },
  subscribe(filters, callback) { return dataStore.subscribe('rankings', filters, callback); },
};
