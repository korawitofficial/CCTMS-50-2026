import { AuthenticationService } from '../services/AuthenticationService.js';

const NAV_GROUPS = [
  {
    label: 'ภาพรวม',
    items: [{ href: 'dashboard.html', icon: 'bi-speedometer2', label: 'แดชบอร์ด' }],
  },
  {
    label: 'การแข่งขัน',
    items: [
      { href: 'events.html', icon: 'bi-flag', label: 'Event' },
      { href: 'tournaments.html', icon: 'bi-trophy', label: 'Tournament' },
      { href: 'schedule.html', icon: 'bi-calendar3', label: 'ตาราง / รอบ / ห้องแข่ง' },
      { href: 'boards.html', icon: 'bi-grid-3x3', label: 'กระดาน' },
      { href: 'matches.html', icon: 'bi-controller', label: 'คู่แข่งขัน' },
    ],
  },
  {
    label: 'ผู้เข้าแข่งขัน',
    items: [
      { href: 'teams.html', icon: 'bi-people', label: 'ทีม' },
      { href: 'players.html', icon: 'bi-person-badge', label: 'ผู้เล่น' },
    ],
  },
  {
    label: 'ผลและสถิติ',
    items: [
      { href: 'results.html', icon: 'bi-clipboard-check', label: 'ผลการแข่งขัน' },
      { href: 'statistics.html', icon: 'bi-bar-chart', label: 'สถิติ / อันดับ' },
      { href: 'hall-of-fame.html', icon: 'bi-award', label: 'หอเกียรติยศ' },
    ],
  },
  {
    label: 'เนื้อหา',
    items: [
      { href: 'news.html', icon: 'bi-newspaper', label: 'ข่าวสาร' },
    ],
  },
  {
    label: 'ระบบ',
    items: [
      { href: 'admins.html', icon: 'bi-shield-lock', label: 'ผู้ดูแล / สิทธิ์' },
      { href: 'activity-log.html', icon: 'bi-journal-text', label: 'Activity / Audit Log' },
    ],
  },
];

function currentPage() {
  return window.location.pathname.split('/').pop() || 'dashboard.html';
}

export function mountAdminLayout({ title } = {}) {
  const session = AuthenticationService.requireAuth('index.html');
  if (!session) return null; // redirected

  const page = currentPage();
  const navHtml = NAV_GROUPS.map((group) => `
    <div class="admin-nav__label">${group.label}</div>
    ${group.items.map((item) => `<a href="${item.href}" class="${page === item.href ? 'active' : ''}"><i class="bi ${item.icon}"></i><span>${item.label}</span></a>`).join('')}
  `).join('');

  document.body.classList.add('admin-body');
  document.body.innerHTML = `
    <div class="admin-shell">
      <aside class="admin-sidebar" id="adminSidebar">
        <div class="admin-sidebar__brand">
          <span class="brand-mark"><span>♞</span></span>
          <div>
            <strong>CCTMS Admin</strong>
            <small>CONTROL CENTER</small>
          </div>
        </div>
        <nav class="admin-nav">${navHtml}</nav>
        <div class="admin-sidebar__foot">
          <a href="../public/index.html" class="d-flex align-items-center gap-2 text-decoration-none" style="color:rgba(246,242,232,0.7);font-size:.85rem;">
            <i class="bi bi-box-arrow-up-right"></i> ดูเว็บไซต์สาธารณะ
          </a>
        </div>
      </aside>
      <div class="admin-main">
        <div class="admin-topbar">
          <div class="d-flex align-items-center gap-3">
            <button id="sidebarToggle" class="btn btn-sm btn-light border"><i class="bi bi-list"></i></button>
            <span class="admin-topbar__title">${title || ''}</span>
          </div>
          <div class="admin-topbar__user">
            <span class="role-chip">${session.roleName}</span>
            <div class="avatar-circle" title="${session.displayName}">${session.displayName?.[0] || '?'}</div>
            <div class="dropdown">
              <button class="btn btn-sm btn-light border" data-bs-toggle="dropdown" aria-label="เมนูผู้ใช้"><i class="bi bi-chevron-down"></i></button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><span class="dropdown-item-text small text-soft">${session.email}</span></li>
                <li><hr class="dropdown-divider"></li>
                <li><button class="dropdown-item" id="logoutBtn"><i class="bi bi-box-arrow-right me-2"></i>ออกจากระบบ</button></li>
              </ul>
            </div>
          </div>
        </div>
        <main class="admin-content" id="adminContent"></main>
        <div class="admin-statusbar">
          <span><span class="dot"></span>เชื่อมต่อระบบสำเร็จ — Mock Data Mode</span>
          <span>เข้าสู่ระบบในนาม ${session.displayName}</span>
        </div>
      </div>
    </div>
    <div class="toast-stack"></div>
  `;

  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await AuthenticationService.signOut();
    window.location.href = 'index.html';
  });
  document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    document.getElementById('adminSidebar').classList.toggle('is-open');
  });

  return { session, content: document.getElementById('adminContent') };
}
