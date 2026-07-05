import { escapeHtml } from '../utils/helpers.js';

/* ---------- Status pill ---------- */
const STATUS_VARIANT = {
  Running: 'running', Published: 'scheduled', Scheduled: 'scheduled',
  Finished: 'finished', Draft: 'draft', Archived: 'finished',
  Paused: 'warning', Cancelled: 'danger', Withdrawn: 'danger', Disqualified: 'danger',
  Active: 'running', Idle: 'draft', Offline: 'danger',
};
export function statusPill(status) {
  const variant = STATUS_VARIANT[status] || 'draft';
  return `<span class="status-pill status-pill--${variant}">${escapeHtml(status)}</span>`;
}

/* ---------- Modal (single shared instance, per PART 11 §17) ---------- */
function ensureModalRoot() {
  let root = document.getElementById('appModalRoot');
  if (!root) {
    root = document.createElement('div');
    root.id = 'appModalRoot';
    root.className = 'app-modal-backdrop';
    root.innerHTML = `
      <div class="app-modal" role="dialog" aria-modal="true">
        <div class="app-modal__head"><h3 id="appModalTitle"></h3><button class="btn-close" id="appModalClose" aria-label="ปิด"></button></div>
        <div class="app-modal__body" id="appModalBody"></div>
        <div class="app-modal__foot" id="appModalFoot"></div>
      </div>`;
    document.body.appendChild(root);
    root.addEventListener('click', (e) => { if (e.target === root) closeModal(); });
    document.getElementById('appModalClose').addEventListener('click', closeModal);
  }
  return root;
}

export function closeModal() {
  document.getElementById('appModalRoot')?.classList.remove('is-open');
}

/**
 * openModal({ title, bodyHtml, danger, buttons:[{label,variant,onClick,close}] })
 */
export function openModal({ title, bodyHtml, danger = false, buttons = [] }) {
  const root = ensureModalRoot();
  root.classList.toggle('app-modal--danger', danger);
  document.getElementById('appModalTitle').textContent = title;
  document.getElementById('appModalBody').innerHTML = bodyHtml;
  const foot = document.getElementById('appModalFoot');
  foot.innerHTML = '';
  buttons.forEach((btn) => {
    const el = document.createElement('button');
    el.className = `btn ${btn.variant || 'btn-outline-secondary'} btn-sm`;
    el.textContent = btn.label;
    el.addEventListener('click', () => {
      btn.onClick?.();
      if (btn.close !== false) closeModal();
    });
    foot.appendChild(el);
  });
  root.classList.add('is-open');
  return root;
}

export function confirmModal({ title = 'ยืนยันการทำรายการ', message, confirmLabel = 'ยืนยัน', danger = true, onConfirm }) {
  openModal({
    title, danger,
    bodyHtml: `<p class="mb-0">${message}</p>`,
    buttons: [
      { label: 'ยกเลิก', variant: 'btn-outline-secondary' },
      { label: confirmLabel, variant: danger ? 'btn-danger' : 'btn-felt', onClick: onConfirm },
    ],
  });
}

/* ---------- Pagination ---------- */
export function paginate(items, page, pageSize) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return { rows: items.slice(start, start + pageSize), total, totalPages, page: safePage };
}

export function renderPagination(container, { page, totalPages }, onChange) {
  if (totalPages <= 1) { container.innerHTML = ''; return; }
  let html = '<nav><ul class="pagination pagination-sm mb-0">';
  for (let i = 1; i <= totalPages; i++) {
    html += `<li class="page-item ${i === page ? 'active' : ''}"><button class="page-link" data-page="${i}">${i}</button></li>`;
  }
  html += '</ul></nav>';
  container.innerHTML = html;
  container.querySelectorAll('[data-page]').forEach((btn) => {
    btn.addEventListener('click', () => onChange(Number(btn.dataset.page)));
  });
}

/* ---------- Empty / skeleton ---------- */
export function emptyRow(colspan, message) {
  return `<tr><td colspan="${colspan}"><div class="empty-state py-4"><div class="icon"><i class="bi bi-inboxes"></i></div><p class="mb-0">${message}</p></div></td></tr>`;
}
