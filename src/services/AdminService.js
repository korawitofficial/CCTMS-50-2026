import { dataStore } from './dataStore.js';

export const AdminService = {
  async listAdmins() {
    const admins = await dataStore.list('admins');
    const withRoles = [];
    for (const a of admins) withRoles.push({ ...a, role: await dataStore.get('roles', a.roleId) });
    return withRoles;
  },
  async createAdmin(data, byAdminId) {
    const record = await dataStore.add('admins', { status: 'Active', lastLogin: null, photoURL: '', ...data }, 'admin');
    await dataStore.logActivity({ adminId: byAdminId, action: 'Create', targetType: 'Admin', targetId: record.id, description: `เพิ่มผู้ดูแลระบบ: ${record.displayName}` });
    return record;
  },
  async updateAdmin(id, patch, byAdminId) {
    const record = await dataStore.update('admins', id, patch);
    await dataStore.logActivity({ adminId: byAdminId, action: 'Edit', targetType: 'Admin', targetId: id, description: 'แก้ไขผู้ดูแลระบบ' });
    return record;
  },
  async deactivateAdmin(id, byAdminId) {
    const record = await dataStore.update('admins', id, { status: 'Inactive' });
    await dataStore.logActivity({ adminId: byAdminId, action: 'Lock', targetType: 'Admin', targetId: id, description: 'ปิดใช้งานบัญชีผู้ดูแลระบบ' });
    return record;
  },
  async listRoles() { return dataStore.list('roles'); },
  async listPermissions(roleId) { return dataStore.list('permissions', roleId ? { roleId } : {}); },

  async listActivityLogs({ limit = 50 } = {}) {
    const rows = (await dataStore.list('activityLogs')).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit);
    const withAdmin = [];
    for (const log of rows) withAdmin.push({ ...log, admin: await dataStore.get('admins', log.adminId) });
    return withAdmin;
  },
  async listAuditLogs({ limit = 50 } = {}) {
    const rows = (await dataStore.list('auditLogs')).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit);
    const withAdmin = [];
    for (const log of rows) withAdmin.push({ ...log, admin: await dataStore.get('admins', log.adminId) });
    return withAdmin;
  },
  subscribeActivityLogs(callback) {
    return dataStore.subscribe('activityLogs', {}, async () => callback(await this.listActivityLogs()));
  },
};
