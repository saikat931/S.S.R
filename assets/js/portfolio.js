// ============================================================
// Portfolio JS — Main Page Logic
// ============================================================

// ─── Loader ───────────────────────────────────────────────
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("page-loader").classList.add("hidden");
  }, 1200);
});

// ─── Reveal on Scroll ─────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("revealed");
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);
document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));

// ─── Navbar ───────────────────────────────────────────────
const navbar = document.getElementById("navbar");
const backTop = document.getElementById("back-top");
const progress = document.getElementById("scroll-progress");

window.addEventListener(
  "scroll",
  () => {
    const scrolled = window.scrollY;
    if (navbar) navbar.classList.toggle("scrolled", scrolled > 60);
    if (backTop) backTop.classList.toggle("visible", scrolled > 400);
    const total = document.body.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (scrolled / total) * 100 + "%";
    // Active nav link
    const sections = ["about", "skills", "projects", "experience", "contact"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const navEl = document.getElementById("nav-" + id);
      if (navEl)
        navEl.classList.toggle("active", rect.top <= 120 && rect.bottom >= 120);
    });
  },
  { passive: true },
);

// ─── Laptop Sequence Animation ─────────────────────────────
// ─── Laptop Sequence Animation ─────────────────────────────
window.addEventListener(
  "scroll",
  () => {
    const seq = document.getElementById("laptop-sequence");
    if (!seq) return;
    
    const wrapper = document.getElementById("laptop-wrapper");
    const text = document.getElementById("laptop-text");
    const vid = document.getElementById("laptop-video");
    
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      if (wrapper) {
        wrapper.style.position = "";
        wrapper.style.top = "";
        wrapper.style.left = "";
        wrapper.style.transform = "";
        wrapper.style.zIndex = "";
      }
      if (text) {
        text.style.opacity = "";
        text.style.transform = "";
      }
      return;
    }
    
    const rect = seq.getBoundingClientRect();
    const totalScroll = seq.scrollHeight - window.innerHeight;
    let progress = -rect.top / totalScroll;
    
    if (progress < 0) {
        // Above the section
        if (wrapper) {
            wrapper.style.position = "relative";
            wrapper.style.top = "auto";
            wrapper.style.left = "auto";
            wrapper.style.transform = `translate(0vw, 8vh) scale(0.75)`;
            wrapper.style.zIndex = "2";
        }
        if (text) {
            text.style.opacity = 1;
            text.style.transform = `translateY(0px)`;
        }
    } else if (progress >= 0 && progress <= 1) {
        // Inside the section (2 phases only: scale up and hold)
        if (wrapper) {
            wrapper.style.position = "relative";
            wrapper.style.top = "auto";
            wrapper.style.left = "auto";
            wrapper.style.zIndex = "2";
        }
        
        if (progress <= 0.8) {
            let p1 = progress / 0.8;
            let scale = 0.75 + (0.25 * p1); // Scales from 0.75 to 1
            let y = 8; // Shift laptop down vertically
            if (wrapper) wrapper.style.transform = `translate(0vw, ${y}vh) scale(${scale})`;
            if (text) {
                text.style.opacity = Math.max(0, 1 - (p1 * 2));
                text.style.transform = `translateY(${p1 * -50}px)`;
            }
        } else {
            if (wrapper) wrapper.style.transform = `translate(0vw, 0vh) scale(1)`;
            if (text) text.style.opacity = 0;
        }
    } else if (progress > 1) {
        // Below the section -> Fixed Widget
        // The About section is already scrolling into view. We animate the shrink here over the next 500px!
        
        if (window.innerWidth <= 1200) {
            // On laptops/tablets, do not float the widget. Just let it scroll away!
            if (wrapper) {
                wrapper.style.position = "relative";
                wrapper.style.top = "auto";
                wrapper.style.left = "auto";
                wrapper.style.zIndex = "2";
                wrapper.style.transform = "translate(0vw, 0vh) scale(1)";
            }
            if (text) text.style.opacity = 0;
            return;
        }

        let extraScroll = -rect.top - totalScroll;
        let p3 = extraScroll / 500;
        if (p3 > 1) p3 = 1;
        
        let scale = 1 - (0.65 * p3); // Scales from 1 down to 0.35
        let x = 36 * p3;
        let y = 36 * p3;
        
        if (wrapper) {
            wrapper.style.position = "fixed";
            wrapper.style.top = "50%";
            wrapper.style.left = "50%";
            wrapper.style.zIndex = "50";
            wrapper.style.transform = `translate(calc(-50% + ${x}vw), calc(-50% + ${y}vh)) scale(${scale})`;
        }
        if (text) text.style.opacity = 0;
    }
  },
  { passive: true },
);

// ─── Hamburger ────────────────────────────────────────────
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

// ─── Particle Canvas ──────────────────────────────────────
(function () {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [],
    W,
    H,
    animFrame;
  const isDark = () =>
    document.documentElement.getAttribute("data-theme") === "dark";

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function mkParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.6 + 0.1,
    };
  }

  for (let i = 0; i < 110; i++) particles.push(mkParticle());

  let mx = W / 2,
    my = H / 2;
  window.addEventListener(
    "mousemove",
    (e) => {
      mx = e.clientX;
      my = e.clientY;
    },
    { passive: true },
  );

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const col = isDark() ? "108,99,255" : "91,82,232";
    const col2 = isDark() ? "255,101,132" : "232,76,106";
    particles.forEach((p, i) => {
      p.x += p.vx + (mx - W / 2) * 0.00015;
      p.y += p.vy + (my - H / 2) * 0.00015;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${i % 3 === 0 ? col2 : col},${p.alpha})`;
      ctx.fill();
      // Connect nearby
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x,
          dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${col},${(0.12 * (1 - dist / 110)).toFixed(3)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });
    animFrame = requestAnimationFrame(draw);
  }
  draw();
  // Redraw on theme change
  const observer = new MutationObserver(() => { });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
})();

// ─── Typewriter ───────────────────────────────────────────
(function () {
  const d = getData();
  const siteRoles = d && d.site && d.site.roles ? d.site.roles : null;
  const roles = (siteRoles && siteRoles.length > 0) ? siteRoles : ["Full Stack Developer", "UI/UX Designer", "Creative Coder", "Problem Solver"];
  let ri = 0,
    ci = 0,
    del = false,
    timer;
  const el = document.getElementById("typewriter");
  if (!el) return; // Exit if the element doesn't exist to prevent crashing
  
  function tick() {
    const word = roles[ri];
    if (!del) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) {
        del = true;
        timer = setTimeout(tick, 1800);
        return;
      }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) {
        del = false;
        ri = (ri + 1) % roles.length;
      }
    }
    timer = setTimeout(tick, del ? 60 : 90);
  }
  tick();
})();

// Removed duplicate revealObserver

function renderPage() {
  const d = getData();
  renderHero(d);
  renderAbout(d);
  renderSkills(d);
  renderProjects(d);
  renderExperience(d);
  renderContact(d);
  renderFooter(d);
}

// ─── Hero ─────────────────────────────────────────────────
function renderHero(d) {
  const s = d.site || {};
  
  // Hero Big Name
  const nameEl = document.getElementById("hero-name-big");
  if (nameEl && s.name) {
    const parts = s.name.split(" ");
    if (parts.length > 1) {
      const first = parts.shift().toUpperCase();
      const rest = parts.join(" ").toUpperCase();
      nameEl.innerHTML = `${first}<br><span id="hero-name-outline" class="hero-name-outline">${rest}</span>`;
    } else {
      nameEl.innerHTML = s.name.toUpperCase();
    }
  }

  // Hero Availability Badge
  const availText = document.getElementById("hero-avail-text");
  const availInner = document.getElementById("hero-avail-dot-inner");
  const availPulse = document.getElementById("hero-avail-dot-pulse");
  
  if (availText && s.contact) {
    const isAvail = s.contact.available !== false;
    availText.textContent = isAvail ? "Available for new opportunities" : "Not available";
    if (availInner) availInner.style.background = isAvail ? "#22c55e" : "#ef4444";
    if (availPulse) availPulse.style.background = isAvail ? "#22c55e" : "#ef4444";
  }

  // Laptop Code Data
  const laptopName = document.getElementById("laptop-dev-name");
  if (laptopName && s.name) laptopName.textContent = `'${s.name}'`;
  
  const laptopPassion = document.getElementById("laptop-dev-passion");
  if (laptopPassion && s.tagline) {
    const tag = s.tagline.length > 60 ? s.tagline.substring(0, 60) + "..." : s.tagline;
    laptopPassion.textContent = `'${tag}'`;
  }
  
  const laptopFocus = document.getElementById("laptop-dev-focus");
  if (laptopFocus && s.roles && s.roles.length > 0) {
    const r1 = s.roles[0] || 'UI/UX';
    const r2 = s.roles[1] || 'Scalable Systems';
    laptopFocus.textContent = `'${r1}', '${r2}'`;
  }
}

// ─── About ────────────────────────────────────────────────
function renderAbout(d) {
  const s = d.site;
  if (document.getElementById("about-bio")) {
    document.title = `${s.name} — Full Stack Developer & UI/UX Designer`;
  }
  const ph = document.getElementById("about-avatar-placeholder");
  const img = document.getElementById("about-avatar-img");
  if (img) {
    if (s.avatar) {
      img.src = s.avatar;
      img.classList.remove("hidden");
      if (ph) ph.classList.add("hidden");
    } else if (ph) {
      ph.innerHTML = `<img src="assets/images/logo.png" alt="S.S.R Logo" style="width: 60%; height: auto;" />`;
    }
  }
  const bio = document.getElementById("about-bio");
  if (bio) {
    bio.innerHTML = [s.bio1, s.bio2, s.bio3]
      .filter(Boolean)
      .map((p) => `<p>${p}</p>`)
      .join("");
  }
  const soc = d.site.social;
  if (soc) {
    const setLink = (id, url, label) => {
      const el = document.getElementById(id);
      if (el) {
        el.href = url || "#";
        el.title = label;
      }
    };
    setLink("social-github", soc.github, "GitHub");
    setLink("social-linkedin", soc.linkedin, "LinkedIn");
    setLink("social-twitter", soc.twitter, "Twitter");
    setLink("social-email", `mailto:${soc.email}`, "Email");
  }
}

// ─── Skills ───────────────────────────────────────────────
let currentSkillsView = "grid";
let currentSkillsCat = "all";

function renderSkills(d) {
  const skills = (d.skills || []).filter(s => s && typeof s === 'object');
  const cats = ["all", ...new Set(skills.map((s) => s.category).filter(Boolean))];
  const filterEl = document.getElementById("skills-filter");
  if (filterEl) {
    filterEl.innerHTML = cats
      .map(
        (c) =>
          `<button class="filter-btn${c === "all" ? " active" : ""}" data-filter="${c}" onclick="filterSkills('${c}')">${c === "all" ? "All" : c}</button>`,
      )
      .join("");
  }
  renderSkillCards(skills, "all");
}

function renderSkillCards(skills, cat) {
  const grid = document.getElementById("skills-grid");
  if (!grid) return;
  const filtered = cat === "all" ? skills : skills.filter((s) => s.category === cat);
  const limit = grid.dataset && grid.dataset.limit ? parseInt(grid.dataset.limit, 10) : 0;
  const toRender = limit > 0 ? filtered.slice(0, limit) : filtered;
  
  if (currentSkillsView === "grid") {
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(250px, 1fr))";
    grid.style.flexDirection = "initial";
    grid.innerHTML = toRender.map((s, i) => `
      <div class="skill-card reveal reveal-delay-${(i % 5) + 1}">
        <div class="skill-top">
          <span class="skill-name">${s.name}</span>
          <span class="skill-pct">${s.level}%</span>
        </div>
        <div class="skill-cat">${s.category}</div>
        <div class="skill-bar" role="progressbar" aria-valuenow="${s.level}" aria-valuemin="0" aria-valuemax="100" aria-label="${s.name} proficiency">
          <div class="skill-fill" data-level="${s.level}"></div>
        </div>
      </div>
    `).join("");
  } else {
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(400px, 1fr))";
    grid.style.flexDirection = "initial";
    grid.innerHTML = toRender.map((s, i) => `
      <div class="skill-list-item reveal" style="display: flex; align-items: center; justify-content: space-between; padding: 1.2rem 1.5rem; background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 5px 15px rgba(0,0,0,0.1); gap: 1rem;">
        <div style="flex: 1; min-width: 150px;">
          <h4 style="font-size: 1.15rem; color: var(--text-primary); margin-bottom: 0.2rem; font-family: var(--font-head);">${s.name}</h4>
          <span style="font-size: 0.85rem; color: var(--accent); font-family: var(--font-mono);">${s.category}</span>
        </div>
        <div style="flex: 2; margin: 0 2rem; min-width: 150px;">
          <div class="skill-bar" style="margin-top: 0; background: var(--border); height: 8px; border-radius: 4px;">
            <div class="skill-fill" data-level="${s.level}" style="height: 100%; background: var(--accent); border-radius: 4px; width: 0; transition: width 1s ease;"></div>
          </div>
        </div>
        <div style="font-weight: bold; color: var(--text-primary); font-family: var(--font-mono);">${s.level}%</div>
      </div>
    `).join("");
  }

  // Re-observe new reveals
  grid.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
  if (typeof initTilt === "function" && currentSkillsView === "grid") initTilt();
  // Animate bars
  setTimeout(() => {
    grid.querySelectorAll(".skill-fill").forEach((bar) => {
      bar.style.width = bar.dataset.level + "%";
    });
  }, 300);
}

window.filterSkills = function (cat) {
  currentSkillsCat = cat;
  document
    .querySelectorAll("#skills-filter .filter-btn")
    .forEach((b) => b.classList.toggle("active", b.dataset.filter === cat));
  renderSkillCards(getData().skills || [], cat);
};

window.setSkillsView = function(view) {
  currentSkillsView = view;
  const gridBtn = document.getElementById("skills-view-grid");
  const listBtn = document.getElementById("skills-view-list");
  
  if (view === "grid") {
    gridBtn.style.background = "var(--bg-card)";
    gridBtn.style.color = "var(--text-primary)";
    gridBtn.style.borderColor = "var(--border)";
    listBtn.style.background = "transparent";
    listBtn.style.color = "var(--text-secondary)";
    listBtn.style.borderColor = "transparent";
  } else {
    listBtn.style.background = "var(--bg-card)";
    listBtn.style.color = "var(--text-primary)";
    listBtn.style.borderColor = "var(--border)";
    gridBtn.style.background = "transparent";
    gridBtn.style.color = "var(--text-secondary)";
    gridBtn.style.borderColor = "transparent";
  }
  
  renderSkillCards(getData().skills || [], currentSkillsCat);
};

// ─── Projects ─────────────────────────────────────────────
let currentView = "grid",
  currentCat = "all";

function renderProjects(d) {
  try {
    const grid = document.getElementById("projects-grid");
    if (!grid) return;
    
    const projects = (d.projects || []).filter(p => p && typeof p === 'object');
    const cats = [
      "all",
      ...new Set(projects.map((p) => p.category).filter(Boolean)),
    ];
    const catFilter = document.getElementById("cat-filter");
    if (catFilter) {
      catFilter.innerHTML = cats
        .map(
          (c) =>
            `<button class="cat-btn${c === "all" ? " active" : ""}" data-cat="${c}" onclick="filterProjects('${c}')">${c === "all" ? "All" : c}</button>`,
        )
        .join("");
    }
    renderProjectViews(projects, currentCat);
  } catch (err) {
    const grid = document.getElementById("projects-grid");
    if (grid) {
      grid.style.display = 'block';
      grid.innerHTML = `<div style="background: red; color: white; padding: 2rem; border-radius: 8px; font-family: monospace; z-index: 9999; position: relative;"><h3>Error in renderProjects:</h3><pre style="white-space: pre-wrap; font-size: 14px;">${err.stack || err.toString()}</pre></div>`;
    }
  }
}

function filterProjects(cat) {
  try {
    currentCat = cat;
    document
      .querySelectorAll("#cat-filter .cat-btn")
      .forEach((b) => b.classList.toggle("active", b.dataset.cat === cat));
    const projects = (getData().projects || []).filter(p => p && typeof p === 'object');
    renderProjectViews(projects, cat);
  } catch (err) {
    console.error(err);
  }
}

function renderProjectViews(projects, cat) {
  const filtered = cat === "all" ? projects : projects.filter((p) => p.category === cat);
  
  const grid = document.getElementById("projects-grid");
  const limit = grid && grid.dataset.limit ? parseInt(grid.dataset.limit, 10) : 0;
  
  const toRender = limit > 0 ? filtered.slice(0, limit) : filtered;
  
  renderProjectGrid(toRender);
  renderProjectTable(toRender);
}

window.setProjectView = function(view) {
  currentView = view;
  const gridBtn = document.getElementById("projects-view-grid");
  const listBtn = document.getElementById("projects-view-list");
  const gridWrap = document.getElementById("projects-grid");
  const tableWrap = document.getElementById("projects-table-wrap");
  
  if (view === "grid") {
    if (gridBtn) {
      gridBtn.style.background = "var(--bg-card)";
      gridBtn.style.color = "var(--text-primary)";
      gridBtn.style.borderColor = "var(--border)";
    }
    if (listBtn) {
      listBtn.style.background = "transparent";
      listBtn.style.color = "var(--text-secondary)";
      listBtn.style.borderColor = "transparent";
    }
    if (gridWrap) gridWrap.classList.remove("hidden");
    if (tableWrap) tableWrap.classList.add("hidden");
  } else {
    if (listBtn) {
      listBtn.style.background = "var(--bg-card)";
      listBtn.style.color = "var(--text-primary)";
      listBtn.style.borderColor = "var(--border)";
    }
    if (gridBtn) {
      gridBtn.style.background = "transparent";
      gridBtn.style.color = "var(--text-secondary)";
      gridBtn.style.borderColor = "transparent";
    }
    if (gridWrap) gridWrap.classList.add("hidden");
    if (tableWrap) tableWrap.classList.remove("hidden");
  }
}

function renderProjectGrid(projects) {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;
  
  if (!projects.length) {
    grid.innerHTML =
      '<div class="empty-state" style="padding:3rem;text-align:center;color:var(--text-muted)">No projects found</div>';
    return;
  }
  
  grid.innerHTML = projects
    .map((p, i) => {
      // Create a fallback image if none provided
      const imgSrc = p.image ? p.image : `https://placehold.co/600x400/111/333?text=${encodeURIComponent(p.title)}`;
      
      const techArray = Array.isArray(p.tech) ? p.tech : (typeof p.tech === 'string' ? p.tech.split(',') : []);
      
      // We will render up to 3 tech items as small pills or icons if needed, but for Eraf style we use small tags
      const tags = techArray
        .slice(0, 3)
        .map((t) => `<span style="font-size: 0.7rem; padding: 0.2rem 0.5rem; background: transparent; border-radius: 0; color: var(--text-secondary); font-weight: 600; border: 1px solid var(--border); white-space: nowrap;">${t.trim()}</span>`)
        .join("");
        
      const link = p.liveUrl || p.githubUrl || `#project?id=${p.id}`;

      return `
    <article class="project-card reveal revealed reveal-delay-${(i % 3) + 1}" onclick="openProject('${p.id}')" style="background: transparent; border-radius: 0; overflow: hidden; border: 1px solid var(--border); display: flex; flex-direction: column; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.background='var(--bg-glass)'; this.style.borderColor='var(--border-accent)'" onmouseout="this.style.background='transparent'; this.style.borderColor='var(--border)'">
      
      <div style="position: relative; height: 180px; width: 100%; overflow: hidden; background: var(--bg-tertiary); border-bottom: 1px solid var(--border);">
        <img src="${imgSrc}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.8; transition: opacity 0.3s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.8'" />
        
        <div style="position: absolute; top: 1rem; left: 1rem; background: var(--bg-card); padding: 0.3rem 0.8rem; border-radius: 0; font-size: 0.7rem; font-weight: 600; color: var(--text-primary); border: 1px solid var(--border);">
          ${p.category || 'Project'}
        </div>
      </div>
      
      <div style="padding: 1.5rem; display: flex; flex-direction: column; flex: 1;">
        <h3 style="font-family: var(--font-head); font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.5rem 0; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">
          ${p.title}
        </h3>
        <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; margin: 0 0 1rem 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">
          ${p.shortDesc || "A digital experience crafted with care and precision."}
        </p>
        
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; width: 100%; margin-bottom: 1.5rem;">
          ${tags}
        </div>
        
        <div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border); display: flex; align-items: center;">
          <a href="${link}" onclick="event.stopPropagation()" target="_blank" rel="noopener" style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem; transition: color 0.2s; white-space: nowrap;" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text-primary)'">
            View Project <span style="font-size: 1.1rem; line-height: 1;">→</span>
          </a>
        </div>
      </div>
    </article>`;
    })
    .join("");
    
  if (typeof revealObserver !== 'undefined' && revealObserver.observe) {
    grid.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
  }
  if (typeof initTilt === "function") initTilt();
}

function renderProjectTable(projects) {
  const tbody = document.getElementById("projects-table-body");
  if (!tbody) return;
  
  if (!projects.length) {
    tbody.innerHTML =
      '<div class="empty-state" style="padding: 3rem; text-align: center; color: var(--text-muted);">No projects found</div>';
    return;
  }
  
  // Replace the parent table element with a div since we're using flexbox
  const wrap = document.getElementById("projects-table-wrap");
  if (wrap && wrap.querySelector("table")) {
    wrap.innerHTML = '<div id="projects-list-container" style="display: flex; flex-direction: column; gap: 1rem;"></div>';
  }
  
  const container = document.getElementById("projects-list-container") || tbody;
  
  container.innerHTML = projects
    .map((p, i) => {
      const techArray = Array.isArray(p.tech) ? p.tech : (typeof p.tech === 'string' ? p.tech.split(',') : []);
      const tags = techArray
        .slice(0, 4)
        .map((t) => `<span class="tag">${t.trim()}</span>`)
        .join("");
      
      const color = p.color || "#6c63ff";
        
      return `
      <div class="project-list-item reveal reveal-delay-${(i % 3) + 1}" onclick="openProject('${p.id}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter')openProject('${p.id}')" style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; padding: 1.5rem; background: var(--bg-glass); border: 1px solid var(--border); border-radius: var(--r-xl); cursor: pointer; transition: all var(--t-fast); gap: 1rem;" onmouseover="this.style.borderColor='${color}'; this.style.transform='translateX(5px)'" onmouseout="this.style.borderColor='var(--border)'; this.style.transform='translateX(0)'">
        
        <div style="display: flex; flex-direction: column; gap: 0.5rem; flex: 1; min-width: 250px;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin: 0;">${p.title}</h3>
            ${p.featured ? '<span style="font-size: 0.7rem; background: rgba(255, 215, 0, 0.1); color: gold; padding: 0.1rem 0.5rem; border-radius: 4px; font-weight: 600; text-transform: uppercase;">⭐ Featured</span>' : ""}
          </div>
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0; line-height: 1.4;">${p.shortDesc || ""}</p>
        </div>
        
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; flex: 1; min-width: 200px;">
          ${tags}
          ${techArray.length > 4 ? `<span class="tag tag-pink">+${techArray.length - 4}</span>` : ""}
        </div>
        
        <div style="display: flex; align-items: center; gap: 1.5rem;">
          <span class="project-status ${p.status === "Live" ? "status-live" : "status-wip"}">${p.status || "WIP"}</span>
          <div style="display: flex; gap: 0.5rem;" onclick="event.stopPropagation()">
            ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" rel="noopener" style="background: rgba(255,255,255,0.05); color: var(--text-primary); padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.85rem; text-decoration: none; border: 1px solid rgba(255,255,255,0.1); transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">🔗 Demo</a>` : ""}
            ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" rel="noopener" style="background: rgba(255,255,255,0.05); color: var(--text-primary); padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.85rem; text-decoration: none; border: 1px solid rgba(255,255,255,0.1); transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">🐙 Code</a>` : ""}
          </div>
        </div>
      </div>`;
    })
    .join("");
    
  // Re-observe new reveals
  container.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
}

window.openProject = function (id) {
  window.location.href = `project.html?id=${id}`;
};

window.setView = function (view) {
  currentView = view;
  document
    .getElementById("projects-grid")
    .classList.toggle("hidden", view !== "grid");
  document
    .getElementById("projects-table-wrap")
    .classList.toggle("hidden", view !== "table");
  document
    .getElementById("view-grid-btn")
    .classList.toggle("active", view === "grid");
  document
    .getElementById("view-table-btn")
    .classList.toggle("active", view === "table");
  document
    .getElementById("view-grid-btn")
    .setAttribute("aria-pressed", view === "grid");
  document
    .getElementById("view-table-btn")
    .setAttribute("aria-pressed", view === "table");
};

// ─── Experience ───────────────────────────────────────────
function renderExperience(d) {
  const timeline = document.getElementById("timeline");
  const exp = d.experience || [];
  if (!exp.length) {
    timeline.innerHTML =
      '<p class="text-muted text-center" style="font-size:1.1rem">No experience entries yet.</p>';
    return;
  }
  
  timeline.innerHTML = exp
    .map(
      (e, i) => `
      <div class="reveal reveal-delay-${(i % 3) + 1} exp-card" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 2rem; border-radius: 16px; transition: all 0.3s ease; position: relative; overflow: hidden;" onmouseover="this.style.transform='translateY(-5px)'; this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='rgba(255,255,255,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.background='rgba(255,255,255,0.03)'; this.style.borderColor='rgba(255,255,255,0.08)'">
        <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--accent);"></div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <h4 style="font-size: 1.4rem; color: #ffffff; margin: 0 0 0.4rem 0; font-family: var(--font-head); font-weight: 700;">${e.role}</h4>
            <div style="font-size: 1.05rem; color: var(--text-secondary); font-weight: 500;">${e.company}</div>
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--accent); background: rgba(255,255,255,0.05); padding: 0.4rem 1rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);">
            ${e.period}
          </div>
        </div>
        <p style="font-size: 1rem; color: #a0a0a0; line-height: 1.7; margin: 0;">${e.desc}</p>
      </div>
  `,
    )
    .join("");
  timeline
    .querySelectorAll(".reveal")
    .forEach((el) => revealObserver.observe(el));
  if (typeof initTilt === "function") initTilt();
}

// ─── Experience ───────────────────────────────────────────
function renderExperience(d) {
  const exp = d.experience || [];
  const timeline = document.getElementById("timeline");
  if (!timeline) return;

  if (!exp.length) {
    timeline.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 2rem;">No experience available.</div>';
    return;
  }

  timeline.innerHTML = '<div class="timeline-wrapper">' + exp.map((e, i) => {
    const isLeft = i % 2 === 0;
    const sideClass = isLeft ? 'left' : 'right';
    return `
      <div class="timeline-item ${sideClass} reveal reveal-delay-${(i % 3) + 1}">
        <div class="timeline-node">${i + 1}</div>
        <div class="timeline-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1.5rem; flex-direction: ${isLeft ? 'row' : 'row-reverse'};">
            <div style="width: 100%;">
              <h3 style="font-size: 1.8rem; font-family: var(--font-head); font-weight: 700; color: var(--text-primary); margin: 0 0 0.5rem 0; line-height: 1.2;">${e.role}</h3>
              <div style="font-size: 1rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.1em; font-family: var(--font-mono); font-weight: 600;">${e.company}</div>
            </div>
          </div>
          
          <div style="width: 100%; display: flex; justify-content: ${isLeft ? 'flex-end' : 'flex-start'};">
            <div style="font-family: var(--font-mono); font-size: 0.95rem; color: var(--text-primary); border: 1px solid var(--border); padding: 0.5rem 1rem; background: var(--bg-tertiary);">
              ${e.period}
            </div>
          </div>
          
          <div style="width: 100%; height: 1px; background: var(--border);"></div>
          
          <p style="font-size: 1.05rem; color: var(--text-secondary); line-height: 1.8; margin: 0;">
            ${e.desc}
          </p>
        </div>
      </div>
    `;
  }).join("") + '</div>';
  
  // Re-observe new reveals
  timeline.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
}

// ─── Contact ──────────────────────────────────────────────
function renderContact(d) {
  const c = d.site.contact || {};
  const el = (id) => document.getElementById(id);
  const emailLink = el("contact-email-link");
  if (emailLink) {
    emailLink.textContent = c.email || "—";
    emailLink.href = c.email ? `mailto:${c.email}` : "#";
  }
  const phoneEl = el("contact-phone");
  if (phoneEl) phoneEl.textContent = c.phone || "—";
  const locEl = el("contact-location");
  if (locEl) locEl.textContent = c.location || "—";
  const avail = c.available !== false;
  const statusIcon = el("contact-status-icon");
  if (statusIcon) statusIcon.textContent = avail ? "🟢" : "🔴";
  const availStatus = el("contact-avail-status");
  if (availStatus) availStatus.textContent = avail ? "Open to work" : "Not available";
}

function renderFooter(d) {
  const name = d.site.name || "Saikat Sasmal";
  document.getElementById("footer-copy").innerHTML =
    `© ${new Date().getFullYear()} ${name}. Crafted with ❤️ &amp; ☕`;
}

// ─── Contact Form ─────────────────────────────────────────
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("cf-name").value.trim();
    const email = document.getElementById("cf-email").value.trim();
    const subject = document.getElementById("cf-subject").value.trim();
    const message = document.getElementById("cf-message").value.trim();
    if (!name || !email || !subject || !message) {
      showToast("Please fill all fields", "error");
      return;
    }
    const to =
      getData().site.contact?.email || getData().site.social?.email || "saikatsasmal931@gmail.com";

    const bodyText = `Hi Saikat,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

    // Directly open Gmail compose tab with all details filled
    const win = window.open(gmailUrl, "_blank");

    if (!win || win.closed || typeof win.closed === "undefined") {
      // If browser blocked popup, open in same tab
      window.location.href = gmailUrl;
    } else {
      showToast("Opening Gmail with your message...", "success");
    }
  });
}

// ─── Toast ────────────────────────────────────────────────
function showToast(msg, type = "info", duration = 3500) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all .3s";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ─── 3D Tilt Effect ─────────────────────────────────────────
function initTilt() {
  const cards = document.querySelectorAll(
    ".skill-card, .project-card, .stat-card, .timeline-card",
  );
  cards.forEach((el) => {
    if (el.dataset.tiltInit) return;
    el.dataset.tiltInit = "true";

    el.addEventListener("mouseenter", () => {
      el.style.transform = `scale(1.03)`;
      el.style.boxShadow = `0 15px 35px rgba(0,0,0,0.15)`;
      el.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
      el.style.zIndex = "10";
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = `scale(1)`;
      el.style.boxShadow = "";
      el.style.transition = "transform 0.4s ease, box-shadow 0.4s ease";
      el.style.zIndex = "1";
    });
  });
}

// ─── Dynamic Resume Fetcher ───────────────────────────────
function initDynamicResume() {
  const resumeBtn = document.getElementById("about-cta-resume");
  if (!resumeBtn) return;

  resumeBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const fallbackUrl = resumeBtn.getAttribute("href");
    
    try {
      // Attempt to fetch the directory listing (works on Local Live Server / Apache)
      const response = await fetch("assets/docs/");
      if (!response.ok) throw new Error("Directory listing not available");
      
      const text = await response.text();
      // Look for any .pdf file in the returned HTML index
      const pdfMatch = text.match(/href="([^"]+\.pdf)"/i) || text.match(/>([^<]+\.pdf)</i);
      
      if (pdfMatch && pdfMatch[1]) {
        let filename = pdfMatch[1];
        // Clean up filename just in case
        filename = filename.replace(/^\//, '').split('/').pop();
        
        // Trigger download dynamically
        const link = document.createElement("a");
        link.href = "assets/docs/" + filename;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // No PDF found, fallback to default
        window.location.href = fallbackUrl;
      }
    } catch (err) {
      console.log("Could not dynamically fetch directory, using fallback.", err);
      // If fetching folder index fails (e.g., on GitHub Pages / Vercel), just use the default fallback link
      const link = document.createElement("a");
      link.href = fallbackUrl;
      link.download = fallbackUrl.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });
}

// ─── Init ─────────────────────────────────────────────────
// Execute immediately since script is at the end of body
renderPage();
setTimeout(() => {
  if (typeof initTilt === "function") initTilt();
  initDynamicResume();
  window.dispatchEvent(new Event('scroll'));
}, 100);
