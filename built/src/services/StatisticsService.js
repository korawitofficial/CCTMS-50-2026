import { dataStore } from './dataStore.js';
import { TargetType, ResultType } from '../utils/enums.js';

export const StatisticsService = {
  async forTeam(teamId) {
    const rows = await dataStore.list('statistics', { targetType: TargetType.TEAM, targetId: teamId });
    return rows[0] || null;
  },
  async forPlayer(playerId) {
    const rows = await dataStore.list('statistics', { targetType: TargetType.PLAYER, targetId: playerId });
    return rows[0] || null;
  },
  async listByTournament(tournamentId) {
    const teams = await dataStore.list('teams', { tournamentId });
    const teamIds = new Set(teams.map((t) => t.id));
    const stats = await dataStore.list('statistics', { targetType: TargetType.TEAM });
    return stats.filter((s) => teamIds.has(s.targetId));
  },
  async recomputeTeam(teamId) {
    const allMatches = await dataStore.list('matches');
    const matches = allMatches.filter((m) => m.whiteTeamId === teamId || m.blackTeamId === teamId);
    let win = 0, draw = 0, lose = 0;
    for (const m of matches) {
      const result = m.resultId ? await dataStore.get('results', m.resultId) : null;
      if (!result) continue;
      const isWhite = m.whiteTeamId === teamId;
      if (result.resultType === ResultType.DRAW) draw++;
      else if ((result.winner === 'White') === isWhite) win++;
      else lose++;
    }
    const total = win + draw + lose;
    const existing = await this.forTeam(teamId);
    const patch = { totalMatch: total, win, draw, lose, score: win * 3 + draw, winRate: total ? Math.round((win / total) * 100) : 0, updatedAt: new Date().toISOString() };
    if (existing) return dataStore.update('statistics', existing.id, patch);
    return dataStore.add('statistics', { targetType: TargetType.TEAM, targetId: teamId, ...patch }, 'stat');
  },
  subscribe(filters, callback) { return dataStore.subscribe('statistics', filters, callback); },
};
