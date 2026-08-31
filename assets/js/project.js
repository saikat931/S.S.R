// ============================================================
// Project Detail Page JS
// ============================================================

window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('page-loader').classList.add('hidden'), 900);
});

// Scroll
const navbar = document.getElementById('navbar');
const backTop = document.getElementById('back-top');
const progress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  if (navbar) navbar.classList.toggle('scrolled', s > 60);
  if (backTop) backTop.classList.toggle('visible', s > 400);
  if (progress) progress.style.width = (s / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
}, { passive: true });

// Hamburger
const ham = document.getElementById("hamburger");
const mob = document.getElementById("mobile-menu");
if (ham && mob) {
  ham.addEventListener("click", () => {
    const open = mob.classList.toggle("open");
    ham.classList.toggle("open", open);
    ham.setAttribute("aria-expanded", open);
  });
}
function closeMobileMenu() {
  if (mob) mob.classList.remove("open");
  if (ham) {
    ham.classList.remove("open");
    ham.setAttribute("aria-expanded", false);
  }
}
document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

// Reveal observer
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1 });

// ─── Load Project ─────────────────────────────────────────
const params = new URLSearchParams(window.location.search);
const projectId = params.get('id');
const main = document.getElementById('project-main');

const COLORS = ['#6c63ff','#ff6584','#43e97b','#f7971e','#43c6ac','#a29bfe'];
const ICONS  = ['🚀','💡','🎨','⚡','🔮','🛠','📱','🤖'];

function renderProject() {
  if (!projectId) { renderNotFound(); return; }
  const project = getProjectById(projectId);
  if (!project) { renderNotFound(); return; }

  const d = getData();
  const color = project.color || COLORS[0];
  const idx = (d.projects || []).findIndex(p => p.id === projectId);
  const icon = ICONS[idx >= 0 ? idx % ICONS.length : 0];

  // Update meta
  document.getElementById('meta-title').textContent = `${project.title} — Saikat Sasmal`;
  document.getElementById('meta-desc').content = project.shortDesc || '';
  document.title = `${project.title} — Saikat Sasmal`;

  const techTags = (project.tech || []).map(t => `<span class="tag">${t}</span>`).join('');
  const highlights = (project.highlights || []).map(h => `<li>${h}</li>`).join('');

  main.innerHTML = `
    <!-- Hero -->
    <section class="project-hero" aria-label="${project.title} hero" style="padding-top:80px">
      <div class="project-hero-bg" style="background:radial-gradient(ellipse at 30% 50%,${color}30 0%,transparent 60%),var(--bg-primary)">
        ${project.image ? `<img src="${project.image}" alt="${project.title}" style="width:100%;height:100%;object-fit:cover;opacity:.25;position:absolute;inset:0"/>` : ''}
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:8rem;opacity:.06;pointer-events:none">${icon}</div>
      </div>
      <div class="project-hero-overlay" aria-hidden="true"></div>
      <div class="container project-hero-content">
        <nav class="project-breadcrumb" aria-label="Breadcrumb">
          <a href="index.html">Home</a>
          <span>/</span>
          <a href="index.html#projects">Projects</a>
          <span>/</span>
          <span>${project.title}</span>
        </nav>
        <h1 class="project-hero-title" style="background:linear-gradient(135deg,var(--text-primary),${color});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">
          ${project.title}
        </h1>
        <div class="project-hero-meta">
          <span class="project-status ${project.status==='Live'?'status-live':'status-wip'}">${project.status||'WIP'}</span>
          <span class="tag tag-pink">${project.category||'Web App'}</span>
          <span class="text-muted text-mono text-sm">📅 ${project.year||new Date().getFullYear()}</span>
        </div>
        <div class="project-hero-tags" aria-label="Technologies used">${techTags}</div>
      </div>
    </section>

    <!-- Body -->
    <div class="project-body">
      <div class="container project-layout">
        <!-- Main Content -->
        <article>
          <a href="index.html#projects" class="back-btn" aria-label="Back to projects">← Back to Projects</a>

          <h2 class="project-section-head">About the Project</h2>
          <p class="project-desc reveal">${project.longDesc || project.shortDesc || ''}</p>

          ${highlights ? `
          <h2 class="project-section-head reveal">Key Highlights</h2>
          <ul class="highlights-list reveal reveal-delay-1" aria-label="Project highlights">
            ${highlights}
          </ul>` : ''}

          <h2 class="project-section-head reveal">Tech Stack</h2>
          <div class="flex flex-wrap gap-3 reveal reveal-delay-1" aria-label="Technologies">
            ${(project.tech||[]).map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
        </article>

        <!-- Sidebar -->
        <aside class="project-sidebar" aria-label="Project info">
          <div class="sidebar-card">
            <div class="sidebar-title">Links</div>
            <div class="sidebar-links">
              ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noopener" class="sidebar-link" aria-label="View live demo">🔗 <span>Live Demo</span></a>` : '<span class="text-muted text-sm">No live link</span>'}
              ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener" class="sidebar-link" aria-label="View on GitHub">🐙 <span>View on GitHub</span></a>` : ''}
            </div>
          </div>

          <div class="sidebar-card">
            <div class="sidebar-title">Project Info</div>
            <div class="sidebar-meta-item"><span class="sidebar-meta-key">Status</span><span class="sidebar-meta-val">${project.status||'WIP'}</span></div>
            <div class="sidebar-meta-item"><span class="sidebar-meta-key">Category</span><span class="sidebar-meta-val">${project.category||'—'}</span></div>
            <div class="sidebar-meta-item"><span class="sidebar-meta-key">Year</span><span class="sidebar-meta-val">${project.year||'—'}</span></div>
            <div class="sidebar-meta-item"><span class="sidebar-meta-key">Stack</span><span class="sidebar-meta-val">${(project.tech||[]).length} Technologies</span></div>
          </div>

          <div class="sidebar-card">
            <div class="sidebar-title">Share</div>
            <div class="flex gap-3">
              <button class="btn btn-ghost btn-sm" onclick="shareProject()" aria-label="Share project">📤 Share</button>
              <button class="btn btn-ghost btn-sm" onclick="copyLink()" aria-label="Copy link">🔗 Copy Link</button>
            </div>
          </div>
        </aside>
      </div>

      <!-- More Projects -->
      <div class="container" style="margin-top:4rem">
        <div class="divider-gradient"></div>
        <h2 style="font-family:var(--font-head);font-size:1.5rem;font-weight:700;margin-bottom:1.5rem">More Projects</h2>
        <div id="more-projects" class="projects-grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))"></div>
      </div>
    </div>
  `;

  // Observe reveals
  main.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // Render more projects
  const all = (d.projects || []).filter(p => p.id !== projectId).slice(0, 3);
  renderMoreProjects(all);
}

function renderMoreProjects(projects) {
  const container = document.getElementById('more-projects');
  if (!container || !projects.length) return;
  container.innerHTML = projects.map((p, i) => {
    const color = p.color || COLORS[i % COLORS.length];
    const icon = ICONS[i % ICONS.length];
    return `
    <div class="card" style="cursor:pointer;padding:1.5rem" onclick="window.location.href='project.html?id=${p.id}'" role="button" tabindex="0" aria-label="View ${p.title}" onkeydown="if(event.key==='Enter')window.location.href='project.html?id=${p.id}'">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem">
        <div style="width:48px;height:48px;border-radius:.75rem;background:${color}22;display:flex;align-items:center;justify-content:center;font-size:1.5rem;border:1px solid ${color}33">${icon}</div>
        <div>
          <div style="font-weight:700;font-size:.95rem">${p.title}</div>
          <div style="font-size:.78rem;color:var(--text-muted);font-family:var(--font-mono)">${p.category||''}</div>
        </div>
      </div>
      <p style="font-size:.875rem;color:var(--text-muted);line-height:1.6;margin-bottom:1rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${p.shortDesc||''}</p>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap">${(p.tech||[]).slice(0,3).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
    </div>`;
  }).join('');
}

function renderNotFound() {
  main.innerHTML = `
    <div style="padding-top:100px" class="container">
      <div class="not-found">
        <div style="font-size:5rem;margin-bottom:1rem">🔍</div>
        <h1>Project Not Found</h1>
        <p>The project you're looking for doesn't exist or has been removed.</p>
        <a href="index.html#projects" class="btn btn-primary">← Back to Projects</a>
      </div>
    </div>`;
}

window.shareProject = function() {
  if (navigator.share) {
    navigator.share({ title: document.title, url: window.location.href });
  } else { copyLink(); }
};

window.copyLink = function() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast('Link copied to clipboard!', 'success');
  });
};

function showToast(msg, type = 'info') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; t.style.transition='opacity .3s'; setTimeout(()=>t.remove(),300); }, 3000);
}

document.addEventListener('DOMContentLoaded', renderProject);
