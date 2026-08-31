// ============================================================
// Admin Dashboard JS — Full CRUD
// ============================================================

// ─── Toast ────────────────────────────────────────────────
function showToast(msg, type = 'info') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 300); }, 3500);
}

window.customConfirm = function(msg, onConfirm) {
  const modal = document.getElementById('confirm-modal');
  document.getElementById('confirm-modal-msg').textContent = msg;
  
  const okBtn = document.getElementById('confirm-ok-btn');
  const cancelBtn = document.getElementById('confirm-cancel-btn');
  
  const cleanUp = () => {
    modal.classList.add('hidden');
    // Remove event listeners by cloning
    const newOk = okBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newOk, okBtn);
    const newCancel = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);
  };
  
  okBtn.addEventListener('click', () => { cleanUp(); onConfirm(); }, { once: true });
  cancelBtn.addEventListener('click', () => { cleanUp(); }, { once: true });
  modal.onclick = function(e) { if(e.target===this) cleanUp(); };
  
  modal.classList.remove('hidden');
};

// ─── Tab Switching ────────────────────────────────────────
window.switchTab = function(tab) {
  document.querySelectorAll('.admin-tab').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.admin-nav-item').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  const titles = { dashboard:'Dashboard', site:'Site Settings', projects:'Projects', skills:'Skills', experience:'Experience', contact:'Contact Info' };
  document.getElementById('page-title').textContent = titles[tab] || tab;
  renderTab(tab);
};

function renderTab(tab) {
  switch(tab) {
    case 'dashboard':  renderDashboard(); break;
    case 'site':       renderSiteForm(); break;
    case 'projects':   renderProjectsTable(); break;
    case 'skills':     renderSkillsAdmin(); break;
    case 'experience': renderExpTable(); break;
    case 'contact':    renderContactForm(); break;
  }
}

window.toggleSidebar = function() {
  document.getElementById('admin-sidebar').classList.toggle('open');
};

// ─── Dashboard ────────────────────────────────────────────
function renderDashboard() {
  const d = getData();
  const stats = [
    { icon:'🚀', num: d.projects.length, label:'Projects' },
    { icon:'💡', num: d.skills.length,   label:'Skills' },
    { icon:'💼', num: d.experience.length, label:'Experience' },
    { icon:'⭐', num: d.projects.filter(p => p.featured).length, label:'Featured' }
  ];
  document.getElementById('admin-stats-cards').innerHTML = stats.map(s => `
    <div class="admin-stat">
      <div class="admin-stat-icon">${s.icon}</div>
      <div class="admin-stat-num">${s.num}</div>
      <div class="admin-stat-label">${s.label}</div>
    </div>
  `).join('');
  const tbody = document.getElementById('dash-projects-tbody');
  tbody.innerHTML = d.projects.slice(0,5).map(p => `
    <tr>
      <td><strong>${p.title}</strong></td>
      <td><span class="tag tag-pink">${p.category||'—'}</span></td>
      <td><span class="project-status ${p.status==='Live'?'status-live':'status-wip'}">${p.status||'WIP'}</span></td>
      <td class="text-muted text-mono">${p.year||'—'}</td>
    </tr>
  `).join('') || '<tr><td colspan="4" class="text-muted text-center" style="padding:2rem">No projects yet.</td></tr>';
}

// ─── Site Settings ────────────────────────────────────────
function renderSiteForm() {
  const d = getData();
  const s = d.site;
  const val = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
  val('si-name',        s.name);
  val('si-tagline',     s.tagline);
  val('si-avatar',      s.avatar);
  val('si-bio1',        s.bio1);
  val('si-bio2',        s.bio2);
  val('si-bio3',        s.bio3);
  val('si-roles',       (s.roles||[]).join(', '));
  val('si-github',      s.social?.github);
  val('si-linkedin',    s.social?.linkedin);
  val('si-twitter',     s.social?.twitter);
  val('si-email-social',s.social?.email);
}

document.getElementById('site-form').addEventListener('submit', e => {
  e.preventDefault();
  const d = getData();
  const v = id => document.getElementById(id).value.trim();
  d.site.name    = v('si-name')    || d.site.name;
  d.site.tagline = v('si-tagline') || d.site.tagline;
  d.site.avatar  = v('si-avatar');
  d.site.bio1    = v('si-bio1');
  d.site.bio2    = v('si-bio2');
  d.site.bio3    = v('si-bio3');
  d.site.roles   = v('si-roles').split(',').map(r => r.trim()).filter(Boolean);
  if (!d.site.social) d.site.social = {};
  d.site.social.github   = v('si-github');
  d.site.social.linkedin = v('si-linkedin');
  d.site.social.twitter  = v('si-twitter');
  d.site.social.email    = v('si-email-social');
  setData(d);
  showToast('Site settings saved!', 'success');
});

// ─── Projects CRUD ────────────────────────────────────────
function renderProjectsTable() {
  const projects = getData().projects || [];
  const tbody = document.getElementById('projects-tbody');
  tbody.innerHTML = projects.map(p => `
    <tr>
      <td><strong>${p.title}</strong><br><small class="text-muted">${(p.shortDesc||'').slice(0,60)}...</small></td>
      <td><span class="tag tag-pink">${p.category||'—'}</span></td>
      <td><span class="project-status ${p.status==='Live'?'status-live':'status-wip'}">${p.status||'WIP'}</span></td>
      <td>${p.featured ? '⭐ Yes' : '—'}</td>
      <td>
        <div class="admin-table-actions">
          <button class="btn btn-ghost btn-sm" onclick="editProject('${p.id}')">✏️ Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProjectConfirm('${p.id}','${p.title.replace(/'/g,"\\'")}')">🗑 Delete</button>
        </div>
      </td>
    </tr>
  `).join('') || `<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">📭</div><div class="empty-title">No projects</div><div class="empty-desc">Add your first project!</div></div></td></tr>`;
}

window.openProjectModal = function(id = null) {
  const modal = document.getElementById('project-modal');
  const form = document.getElementById('project-form');
  form.reset();
  document.getElementById('pf-id').value = '';
  document.getElementById('project-modal-title').textContent = 'Add Project';
  document.getElementById('pf-color').value = '#6c63ff';
  if (id) {
    const p = getProjectById(id);
    if (!p) return;
    document.getElementById('project-modal-title').textContent = 'Edit Project';
    document.getElementById('pf-id').value      = p.id;
    document.getElementById('pf-title').value   = p.title || '';
    document.getElementById('pf-category').value= p.category || 'Web App';
    document.getElementById('pf-status').value  = p.status || 'Live';
    document.getElementById('pf-year').value    = p.year || '';
    document.getElementById('pf-color').value   = p.color || '#6c63ff';
    document.getElementById('pf-short').value   = p.shortDesc || '';
    document.getElementById('pf-long').value    = p.longDesc || '';
    document.getElementById('pf-tech').value    = (p.tech||[]).join(', ');
    document.getElementById('pf-highlights').value = (p.highlights||[]).join('\n');
    document.getElementById('pf-live').value    = p.liveUrl || '';
    document.getElementById('pf-github').value  = p.githubUrl || '';
    document.getElementById('pf-image').value   = p.image || '';
    document.getElementById('pf-featured').checked = !!p.featured;
  }
  modal.classList.remove('hidden');
};

window.editProject = function(id) { openProjectModal(id); };

window.closeProjectModal = function() {
  document.getElementById('project-modal').classList.add('hidden');
};

window.deleteProjectConfirm = function(id, title) {
  customConfirm(`Delete "${title}"? This cannot be undone.`, () => {
    deleteProject(id);
    renderProjectsTable();
    renderDashboard();
    showToast('Project deleted.', 'error');
  });
};

document.getElementById('project-form').addEventListener('submit', e => {
  e.preventDefault();
  const v = id => document.getElementById(id).value.trim();
  if (!v('pf-title') || !v('pf-short')) { showToast('Title and short description are required.', 'error'); return; }
  const id = v('pf-id') || generateId('p');
  const project = {
    id,
    title:      v('pf-title'),
    category:   v('pf-category'),
    status:     v('pf-status'),
    year:       v('pf-year'),
    color:      v('pf-color'),
    shortDesc:  v('pf-short'),
    longDesc:   v('pf-long'),
    tech:       v('pf-tech').split(',').map(t=>t.trim()).filter(Boolean),
    highlights: v('pf-highlights').split('\n').map(h=>h.trim()).filter(Boolean),
    liveUrl:    v('pf-live'),
    githubUrl:  v('pf-github'),
    image:      v('pf-image'),
    featured:   document.getElementById('pf-featured').checked
  };
  saveProject(project);
  closeProjectModal();
  renderProjectsTable();
  renderDashboard();
  showToast(`Project "${project.title}" saved!`, 'success');
});

// ─── Skills CRUD ──────────────────────────────────────────
function renderSkillsAdmin() {
  const skills = getData().skills || [];
  const body = document.getElementById('skills-admin-body');
  body.innerHTML = skills.map(s => `
    <div class="skill-admin-row" id="skill-row-${s.id}">
      <div class="skill-admin-info">
        <div class="skill-admin-name">${s.name}</div>
        <div class="skill-admin-meta">${s.category}</div>
      </div>
      <div class="skill-admin-level">
        <div class="skill-admin-bar"><div class="skill-admin-fill" style="width:${s.level}%"></div></div>
        <span class="skill-admin-pct">${s.level}%</span>
      </div>
      <div style="display:flex;gap:.5rem">
        <button class="btn btn-ghost btn-sm" onclick="editSkill('${s.id}')">✏️</button>
        <button class="btn btn-danger btn-sm" onclick="deleteSkillById('${s.id}')">🗑</button>
      </div>
    </div>
  `).join('') || '<div class="empty-state"><div class="empty-icon">💡</div><div class="empty-title">No skills yet</div></div>';
}

window.openSkillModal = function(id = null) {
  const form = document.getElementById('skill-form');
  form.reset();
  document.getElementById('sf-id').value = '';
  document.getElementById('sf-level').value = 80;
  document.getElementById('sf-level-val').textContent = '80';
  document.getElementById('skill-modal-title').textContent = 'Add Skill';
  if (id) {
    const s = (getData().skills||[]).find(sk => sk.id === id);
    if (!s) return;
    document.getElementById('skill-modal-title').textContent = 'Edit Skill';
    document.getElementById('sf-id').value    = s.id;
    document.getElementById('sf-name').value  = s.name;
    document.getElementById('sf-level').value = s.level;
    document.getElementById('sf-level-val').textContent = s.level;
    document.getElementById('sf-cat').value   = s.category;
  }
  document.getElementById('skill-modal').classList.remove('hidden');
};

window.editSkill = function(id) { openSkillModal(id); };

window.closeSkillModal = function() {
  document.getElementById('skill-modal').classList.add('hidden');
};

window.deleteSkillById = function(id) {
  customConfirm('Delete this skill?', () => {
    const d = getData();
    d.skills = d.skills.filter(s => s.id !== id);
    setData(d);
    renderSkillsAdmin();
    showToast('Skill deleted.', 'error');
  });
};

document.getElementById('skill-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('sf-name').value.trim();
  if (!name) { showToast('Skill name required.', 'error'); return; }
  const id = document.getElementById('sf-id').value || generateId('s');
  const skill = {
    id,
    name,
    level:    parseInt(document.getElementById('sf-level').value),
    category: document.getElementById('sf-cat').value
  };
  const d = getData();
  const idx = d.skills.findIndex(s => s.id === id);
  if (idx >= 0) d.skills[idx] = skill; else d.skills.push(skill);
  setData(d);
  closeSkillModal();
  renderSkillsAdmin();
  renderDashboard();
  showToast(`Skill "${skill.name}" saved!`, 'success');
});

// ─── Experience CRUD ──────────────────────────────────────
function renderExpTable() {
  const exp = getData().experience || [];
  const tbody = document.getElementById('exp-tbody');
  tbody.innerHTML = exp.map(e => `
    <tr>
      <td><strong>${e.role}</strong></td>
      <td>${e.company}</td>
      <td class="text-muted text-mono text-sm">${e.period||'—'}</td>
      <td>
        <div class="admin-table-actions">
          <button class="btn btn-ghost btn-sm" onclick="editExp('${e.id}')">✏️ Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteExpById('${e.id}')">🗑 Delete</button>
        </div>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="4" class="text-muted text-center" style="padding:2rem">No experience entries.</td></tr>';
}

window.openExpModal = function(id = null) {
  const form = document.getElementById('exp-form');
  form.reset();
  document.getElementById('ef-id').value = '';
  document.getElementById('exp-modal-title').textContent = 'Add Experience';
  if (id) {
    const e = (getData().experience||[]).find(ex => ex.id === id);
    if (!e) return;
    document.getElementById('exp-modal-title').textContent = 'Edit Experience';
    document.getElementById('ef-id').value      = e.id;
    document.getElementById('ef-role').value    = e.role;
    document.getElementById('ef-company').value = e.company;
    document.getElementById('ef-period').value  = e.period;
    document.getElementById('ef-desc').value    = e.desc;
  }
  document.getElementById('exp-modal').classList.remove('hidden');
};

window.editExp = function(id) { openExpModal(id); };

window.closeExpModal = function() {
  document.getElementById('exp-modal').classList.add('hidden');
};

window.deleteExpById = function(id) {
  customConfirm('Delete this experience?', () => {
    const d = getData();
    d.experience = d.experience.filter(e => e.id !== id);
    setData(d);
    renderExpTable();
    showToast('Experience deleted.', 'error');
  });
};

document.getElementById('exp-form').addEventListener('submit', e => {
  e.preventDefault();
  const role    = document.getElementById('ef-role').value.trim();
  const company = document.getElementById('ef-company').value.trim();
  if (!role || !company) { showToast('Role and company required.', 'error'); return; }
  const id = document.getElementById('ef-id').value || generateId('e');
  const entry = { id, role, company, period: document.getElementById('ef-period').value.trim(), desc: document.getElementById('ef-desc').value.trim() };
  const d = getData();
  const idx = d.experience.findIndex(ex => ex.id === id);
  if (idx >= 0) d.experience[idx] = entry; else d.experience.push(entry);
  setData(d);
  closeExpModal();
  renderExpTable();
  renderDashboard();
  showToast('Experience saved!', 'success');
});

// ─── Contact CRUD ─────────────────────────────────────────
function renderContactForm() {
  const c = getData().site.contact || {};
  document.getElementById('ca-email').value    = c.email    || '';
  document.getElementById('ca-phone').value    = c.phone    || '';
  document.getElementById('ca-location').value = c.location || '';
  document.getElementById('ca-available').checked = c.available !== false;
}

document.getElementById('contact-admin-form').addEventListener('submit', e => {
  e.preventDefault();
  const d = getData();
  if (!d.site.contact) d.site.contact = {};
  d.site.contact.email     = document.getElementById('ca-email').value.trim();
  d.site.contact.phone     = document.getElementById('ca-phone').value.trim();
  d.site.contact.location  = document.getElementById('ca-location').value.trim();
  d.site.contact.available = document.getElementById('ca-available').checked;
  setData(d);
  showToast('Contact info saved!', 'success');
});

// Close modals on overlay click
['project-modal','skill-modal','exp-modal'].forEach(id => {
  document.getElementById(id).addEventListener('click', function(e) {
    if (e.target === this) this.classList.add('hidden');
  });
});

window.resetAdminData = function() {
  customConfirm("Are you sure you want to reset all data to the original demo data? All unsaved changes will be lost.", () => {
    resetData();
    initData();
    showToast("Data reset to default successfully!", "success");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  });
};

// ─── Export Data ──────────────────────────────────────────
window.exportDataJs = function() {
  const data = getData();
  const fileContent = `// ============================================================
// S.S.R Portfolio — Data Layer (localStorage)
// ============================================================

const SSR_KEY = 'ssr_portfolio_data';

const DEFAULT_DATA = ${JSON.stringify(data, null, 2)};

// ─── API ──────────────────────────────────────────────────
function getData() {
  const raw = localStorage.getItem(SSR_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      let storedData = parsed;
      if (parsed && parsed.timestamp && parsed.data) {
         const ONE_DAY = 24 * 60 * 60 * 1000;
         if (Date.now() - parsed.timestamp > ONE_DAY) {
            resetData();
            return JSON.parse(JSON.stringify(DEFAULT_DATA));
         }
         storedData = parsed.data;
      }
      // Deep merge to ensure no top-level properties are ever undefined
      return {
        site: { ...DEFAULT_DATA.site, ...(storedData.site || {}) },
        skills: storedData.skills || DEFAULT_DATA.skills,
        projects: storedData.projects || DEFAULT_DATA.projects,
        experience: storedData.experience || DEFAULT_DATA.experience
      };
    } catch (e) {
      console.error("Data parse error", e);
    }
  }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function setData(data) {
  const payload = { timestamp: Date.now(), data: data };
  localStorage.setItem(SSR_KEY, JSON.stringify(payload));
  if (typeof window.updateDataButtons === 'function') window.updateDataButtons();
}

function resetData() {
  localStorage.removeItem(SSR_KEY);
  if (typeof window.updateDataButtons === 'function') window.updateDataButtons();
}

function initData() {
  // Do not set data immediately so we can detect actual changes.
}

function hasLocalChanges() {
  return !!localStorage.getItem(SSR_KEY);
}

// Helpers
function getProjectById(id) {
  return getData().projects.find(p => p.id === id) || null;
}

function saveProject(project) {
  const data = getData();
  const idx = data.projects.findIndex(p => p.id === project.id);
  if (idx >= 0) data.projects[idx] = project;
  else data.projects.unshift(project);
  setData(data);
}

function deleteProject(id) {
  const data = getData();
  data.projects = data.projects.filter(p => p.id !== id);
  setData(data);
}

function generateId(prefix = 'p') {
  return \`\${prefix}\${Date.now()}\`;
}

// Force reset data for this update to take effect immediately
// resetData();
initData();
`;

  const blob = new Blob([fileContent.replace(/\\`/g, '`').replace(/\\\$/g, '$')], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data.js";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("data.js exported successfully!", "success");
};

window.updateDataButtons = function() {
  const actionsDash = document.getElementById('admin-data-actions-dash');
  if (actionsDash) {
    if (typeof hasLocalChanges === 'function' && hasLocalChanges()) {
      actionsDash.style.display = 'flex';
    } else {
      actionsDash.style.display = 'none';
    }
  }
};

// ─── Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
  if (typeof window.updateDataButtons === 'function') window.updateDataButtons();
});
