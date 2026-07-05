import { EventService } from '../services/EventService.js';

const NAV_ITEMS = [
  { href: 'index.html', label: 'หน้าแรก', match: ['index.html', ''] },
  { href: 'live.html', label: 'ถ่ายทอดสด', match: ['live.html'] },
  { href: 'tournaments.html', label: 'การแข่งขัน', match: ['tournaments.html', 'tournament.html'] },
  { href: 'teams.html', label: 'ทีม', match: ['teams.html', 'team.html'] },
  { href: 'players.html', label: 'ผู้เล่น', match: ['players.html', 'player.html'] },
  { href: 'statistics.html', label: 'สถิติ', match: ['statistics.html'] },
  { href: 'hall-of-fame.html', label: 'หอเกียรติยศ', match: ['hall-of-fame.html'] },
  { href: 'news.html', label: 'ข่าวสาร', match: ['news.html'] },
  { href: 'gallery.html', label: 'ภาพกิจกรรม', match: ['gallery.html'] },
];

function currentPage() {
  const path = window.location.pathname.split('/').pop();
  return path || 'index.html';
}

export function renderHeader() {
  const page = currentPage();
  const links = NAV_ITEMS.map((item) => {
    const active = item.match.includes(page);
    return `<li class="nav-item"><a class="nav-link ${active ? 'active' : ''}" href="${item.href}">${item.label}</a></li>`;
  }).join('');

  const header = document.createElement('header');
  header.className = 'app-header';
  header.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark container-xl py-2">
      <a class="navbar-brand" href="index.html">
        <span class="brand-mark"><span>♞</span></span>
        <span>CCTMS <small class="d-block fw-normal" style="font-size:.6rem;letter-spacing:.08em;opacity:.75;font-family:var(--font-mono)">CHESS &amp; CHECKERS TOURNAMENT</small></span>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-label="เปิดเมนู">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">${links}</ul>
      </div>
    </nav>`;
  document.body.prepend(header);
}

export function renderBreadcrumb(trail) {
  // trail: [{label, href}], last item has no href
  if (!trail || trail.length === 0) return;
  const bar = document.createElement('div');
  bar.className = 'breadcrumb-bar';
  const items = trail.map((t, i) => {
    if (i === trail.length - 1) return `<span class="current">${t.label}</span>`;
    return `<a href="${t.href}">${t.label}</a> <i class="bi bi-chevron-right mx-1" style="font-size:.6rem;"></i>`;
  }).join('');
  bar.innerHTML = `<div class="container-xl py-2">${items}</div>`;
  const header = document.querySelector('.app-header');
  header?.insertAdjacentElement('afterend', bar);
}

export async function renderFooter() {
  const events = await EventService.list({ publicOnly: true });
  const event = events[0];
  const footer = document.createElement('footer');
  footer.className = 'app-footer pt-5 pb-4';
  footer.innerHTML = `
    <div class="container-xl">
      <div class="row gy-4">
        <div class="col-lg-4">
          <div class="d-flex align-items-center gap-2 mb-2">
            <span class="brand-mark" style="width:28px;height:28px;background:var(--color-brass);border-radius:4px;display:inline-grid;place-items:center;color:var(--color-felt-dark);font-weight:700;transform:rotate(45deg)"><span style="transform:rotate(-45deg)">♞</span></span>
            <strong class="font-display" style="color:#fff">CCTMS</strong>
          </div>
          <p class="small mb-0">${event ? event.name : 'ระบบบริหารจัดการการแข่งขันหมากรุกและหมากฮอสประจำโรงเรียน'}</p>
        </div>
        <div class="col-6 col-lg-2">
          <h6>เมนู</h6>
          <ul class="list-unstyled small d-flex flex-column gap-2">
            <li><a href="live.html">ถ่ายทอดสด</a></li>
            <li><a href="tournaments.html">การแข่งขัน</a></li>
            <li><a href="statistics.html">สถิติ</a></li>
            <li><a href="hall-of-fame.html">หอเกียรติยศ</a></li>
          </ul>
        </div>
        <div class="col-6 col-lg-2">
          <h6>ข้อมูล</h6>
          <ul class="list-unstyled small d-flex flex-column gap-2">
            <li><a href="teams.html">ทีมทั้งหมด</a></li>
            <li><a href="players.html">ผู้เล่นทั้งหมด</a></li>
            <li><a href="news.html">ข่าวสาร</a></li>
            <li><a href="gallery.html">คลังภาพ</a></li>
          </ul>
        </div>
        <div class="col-lg-4">
          <h6>หมายเหตุ</h6>
          <p class="small mb-0">ระบบนี้เป็นแพลตฟอร์มจัดการการแข่งขัน ไม่ใช่ Chess Engine และไม่ตัดสินผลการแข่งขันแทนกรรมการ</p>
        </div>
      </div>
      <hr class="border-light border-opacity-10 my-4">
      <div class="d-flex justify-content-between flex-wrap gap-2 small">
        <span>&copy; ${new Date().getFullYear()} Chess &amp; Checkers Tournament Management System</span>
        <a href="../admin/index.html">เข้าสู่ระบบผู้ดูแล</a>
      </div>
    </div>`;
  document.body.appendChild(footer);
}

export async function mountPublicLayout({ breadcrumb } = {}) {
  renderHeader();
  if (breadcrumb) renderBreadcrumb(breadcrumb);
  await renderFooter();
}

export function skeletonCards(count = 3, height = 220) {
  return Array.from({ length: count }).map(() => `<div class="col"><div class="skeleton" style="height:${height}px;border-radius:14px;"></div></div>`).join('');
}

export function emptyState(message, icon = 'bi-inboxes') {
  return `<div class="empty-state"><div class="icon"><i class="bi ${icon}"></i></div><p class="mb-0">${message}</p></div>`;
}
