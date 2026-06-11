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
    <h3 class="subsection-title">Internacional</h3>
    ${renderOpportunitiesTable(international, false)}
    <h3 class="subsection-title">Nacional</h3>
    ${renderOpportunitiesTable(national, true)}
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
    return `<div class="empty-state"><h2>Blog</h2><p>Próximamente publicaremos artículos y guías.</p></div>`;
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
    <div class="blog-grid">${cards}</div>
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

    <h3 class="subsection-title">Plantillas de CV</h3>
    <div class="resources-grid">${cvCards}</div>

    <h3 class="subsection-title">Organizaciones y mentorías</h3>
    <div class="resources-grid">${orgCards}</div>

    <h3 class="subsection-title">Archivos</h3>
    <div class="resource-card">
      <ul class="file-list">${fileItems}</ul>
    </div>

    <h3 class="subsection-title">Enlaces externos</h3>
    <div class="resources-grid">${externalItems}</div>
  `;
}

function renderHero() {
  const { title, subtitle, steps } = SITE_DATA.intro;
  const stepCards = steps
    .map(
      (text, i) => `
    <div class="step-card">
      <span class="step-number">${i + 1}</span>
      <p>${text}</p>
    </div>`
    )
    .join("");

  return `
    <section class="greet-main">
      <div class="greeting-main">
        <div class="greeting-text-div">
          <h1 class="greeting-text">${title}</h1>
          <p class="greeting-text-p">${subtitle}</p>
        </div>
        <div class="greeting-image-div">
          <img src="Logo_Ciencia.png" alt="Logo Ciencia en el Extranjero" width="220" height="220" />
        </div>
      </div>
      <div class="steps-grid">${stepCards}</div>
    </section>
  `;
}

function initTabs() {
  const panels = {
    oportunidades: document.getElementById("panel-oportunidades"),
    blog: document.getElementById("panel-blog"),
    recursos: document.getElementById("panel-recursos"),
  };

  document.getElementById("panel-oportunidades").innerHTML = renderOpportunities();
  document.getElementById("panel-blog").innerHTML = renderBlog();
  document.getElementById("panel-recursos").innerHTML = renderResources();
  document.getElementById("hero").innerHTML = renderHero();

  const buttons = document.querySelectorAll(".tab-btn");

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

  const hash = location.hash.replace("#", "");
  const validTabs = Object.keys(panels);
  activateTab(validTabs.includes(hash) ? hash : "oportunidades");
}

document.addEventListener("DOMContentLoaded", initTabs);
