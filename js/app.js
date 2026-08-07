const FUNDING_LABELS = {
  full: { text: "Completo", class: "funding-full" },
  partial: { text: "Parcial", class: "funding-partial" },
  none: { text: "N/A", class: "funding-none" },
};

function renderTags(levels) {
  return levels.map((l) => `<span class="tag">${l}</span>`).join("");
}

function renderFunding(funding) {
  const f = FUNDING_LABELS[funding] || FUNDING_LABELS.none;
  const icon = funding === "full" ? "✓" : funding === "partial" ? "◐" : "✗";
  return `<span class="${f.class}">${icon} ${f.text}</span>`;
}

function renderOpportunitiesTable(rows, isNational) {
  const headers = isNational
    ? ["Programa", "Ciudad-Estado", "Institución", "Nivel académico", "Financiamiento", "Link"]
    : ["Programa", "País", "Institución", "Nivel académico", "Financiamiento", "Link"];

  const body = rows
    .map((row) => {
      const location = isNational ? row.city : row.country;
      return `<tr>
        <td><strong>${row.program}</strong></td>
        <td>${location}</td>
        <td>${row.institution}</td>
        <td>${renderTags(row.level)}</td>
        <td>${renderFunding(row.funding)}</td>
        <td><a href="${row.link}" target="_blank" rel="noopener noreferrer">Ver convocatoria</a></td>
      </tr>`;
    })
    .join("");

  return `<div class="table-wrapper"><table>
    <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${body}</tbody>
  </table></div>`;
}

function renderOpportunities() {
  const { international, national } = SITE_DATA.opportunities;
  return `
    <div class="section-header">
      <h2>Oportunidades de estancias de investigación / veranos</h2>
      <p>Programas nacionales e internacionales para estudiantes de ciencias en México.</p>
    </div>
    <div class="panel-body">
      <h3 class="subsection-title">Internacional</h3>
      ${renderOpportunitiesTable(international, false)}
      <h3 class="subsection-title">Nacional</h3>
      ${renderOpportunitiesTable(national, true)}
    </div>
  `;
}

function formatDate(dateStr) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderBlog() {
  const posts = SITE_DATA.blog;
  if (!posts.length) {
    return `<div class="empty-state"><p>Próximamente se compartiran artículos y guías.</p></div>`;
  }

  const cards = posts
    .map(
      (post) => `
    <article class="blog-card">
      <time class="blog-date" datetime="${post.date}">${formatDate(post.date)}</time>
      <h3>${post.title}</h3>
      <div class="blog-tags">${post.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      <p>${post.excerpt}</p>
      <a class="main-button read-more" href="${post.link}" target="_blank" rel="noopener noreferrer">Leer más</a>
    </article>`
    )
    .join("");

  return `
    <div class="section-header">
      <h2>Blog</h2>
      <p>Artículos, guías y experiencias para ayudarte en tu camino hacia la ciencia en el extranjero.</p>
    </div>
    <div class="panel-body">
      <div class="blog-grid">${cards}</div>
    </div>
  `;
}

function renderCrashCourse() {
  const { steps } = SITE_DATA.intro;
  const stepItems = steps.map((text) => `<li>${text}</li>`).join("");
  return `
    <h3 class="subsection-title">Crash Course de Ciencia en el Extranjero</h3>
    <ol class="steps-list">${stepItems}</ol>
  `;
}

function renderResources() {
  const { cvTemplates, organizations, files, external } = SITE_DATA.resources;

  const cvCards = cvTemplates
    .map(
      (t) => `
    <div class="resource-card">
      <h3>${t.name}</h3>
      <p>${t.description}</p>
      <div class="resource-links">
        <a class="main-button" href="${t.link}" target="_blank" rel="noopener noreferrer">Visitar sitio</a>
      </div>
    </div>`
    )
    .join("");

  const orgCards = organizations
    .map(
      (o) => `
    <div class="resource-card">
      <h3>${o.name}</h3>
      <p>${o.description}</p>
      <div class="resource-links">
        <a class="main-button" href="${o.link}" target="_blank" rel="noopener noreferrer">Visitar</a>
      </div>
    </div>`
    )
    .join("");

  const fileItems = files
    .map(
      (f) => `
    <li>
      <a href="${f.link}" target="_blank" rel="noopener noreferrer">${f.name}</a>
      <span class="file-type">${f.type}</span>
    </li>`
    )
    .join("");

  const externalItems = external
    .map(
      (e) => `
    <div class="resource-card">
      <h3>${e.name}</h3>
      <p>${e.description}</p>
      <div class="resource-links">
        <a class="main-button" href="${e.link}" target="_blank" rel="noopener noreferrer">Abrir repositorio</a>
      </div>
    </div>`
    )
    .join("");

  return `
    <div class="section-header">
      <h2>Recursos adicionales</h2>
      <p>Plantillas, organizaciones de apoyo y archivos útiles para tu aplicación.</p>
    </div>
    <div class="panel-body">
      ${renderCrashCourse()}

      <h3 class="subsection-title">Plantillas de CV</h3>
      <div class="resources-grid">${cvCards}</div>

      <h3 class="subsection-title">Organizaciones y mentorías</h3>
      <div class="resources-grid">${orgCards}</div>

      <h3 class="subsection-title">Archivos</h3>
      <ul class="file-list">${fileItems}</ul>

      <h3 class="subsection-title">Enlaces externos</h3>
      <div class="resources-grid">${externalItems}</div>
    </div>
  `;
}

function renderInicio() {
  return renderHome() + renderGreeting();
}

function renderHome() {
  const { subtitle } = SITE_DATA.intro;
  return `
    <section class="home-section" aria-label="Bienvenida">
      <img
        class="hero-logo-title"
        src="Logo_Ciencia_new_Letras.png"
        alt="Ciencia en el Extranjero"
        width="480"
        height="auto"
      />
      <p class="home-subtitle">${subtitle}</p>
    </section>
  `;
}

function renderGreeting() {
  const { greeting } = SITE_DATA.intro;
  const paragraphs = greeting.map((text) => `<p>${text}</p>`).join("");
  return `
    <section id="greeting" class="greeting-section" aria-label="Presentación">
      <img
        class="greeting-photo"
        src="Me_photo_landing_page.jpeg"
        alt="Andrés Pérez-Hernández"
        width="280"
        height="280"
      />
      <div class="greeting-content">
        <h2>¡Hola! Me llamo Andrés</h2>
        ${paragraphs}
      </div>
    </section>
  `;
}

function initTabs() {
  const panels = {
    inicio: document.getElementById("panel-inicio"),
    oportunidades: document.getElementById("panel-oportunidades"),
    blog: document.getElementById("panel-blog"),
    recursos: document.getElementById("panel-recursos"),
  };

  document.getElementById("panel-inicio").innerHTML = renderInicio();
  document.getElementById("panel-oportunidades").innerHTML = renderOpportunities();
  document.getElementById("panel-blog").innerHTML = renderBlog();
  document.getElementById("panel-recursos").innerHTML = renderResources();

  const buttons = document.querySelectorAll(".tab-btn");
  const validTabs = Object.keys(panels);

  function activateTab(tabId) {
    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tabId);
    });
    Object.entries(panels).forEach(([id, panel]) => {
      panel.classList.toggle("active", id === tabId);
    });
    history.replaceState(null, "", `#${tabId}`);
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => activateTab(btn.dataset.tab));
  });

  window.addEventListener("hashchange", () => {
    const tabFromHash = location.hash.replace("#", "");
    const resolved = tabFromHash === "home" ? "inicio" : tabFromHash;
    if (validTabs.includes(resolved)) activateTab(resolved);
  });

  const hash = location.hash.replace("#", "");
  const tabFromHash = hash === "home" ? "inicio" : hash;
  activateTab(validTabs.includes(tabFromHash) ? tabFromHash : "inicio");
}

document.addEventListener("DOMContentLoaded", initTabs);
