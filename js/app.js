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

function uniqueSorted(items) {
  return [...new Set(items.filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
}

function opportunityCountry(row, isNational) {
  return isNational ? "México" : row.country;
}

const LEVEL_FILTER_GROUPS = {
  Posgrado: ["Posgrado", "Maestría"],
  Maestría: ["Posgrado", "Maestría"],
};

function normalizeFilterLevel(level) {
  return level === "Maestría" ? "Posgrado" : level;
}

function rowMatchesLevel(rowLevels, filterLevel) {
  if (!filterLevel) return true;
  const accepted = LEVEL_FILTER_GROUPS[filterLevel] || [filterLevel];
  return (rowLevels || []).some((level) => accepted.includes(level));
}

function getOpportunityFilterOptions() {
  const { international, national } = SITE_DATA.opportunities;
  const countries = uniqueSorted([
    ...international.map((row) => row.country),
    ...(national.length ? ["México"] : []),
  ]);
  const levels = uniqueSorted([
    ...international.flatMap((row) => (row.level || []).map(normalizeFilterLevel)),
    ...national.flatMap((row) => (row.level || []).map(normalizeFilterLevel)),
  ]);
  return { countries, levels };
}

function rowMatchesFilters(row, isNational, filters) {
  const country = opportunityCountry(row, isNational);
  if (filters.country && country !== filters.country) return false;
  if (!rowMatchesLevel(row.level, filters.level)) return false;
  if (filters.funding && row.funding !== filters.funding) return false;
  return true;
}

function renderSelectOptions(values, allLabel) {
  return [`<option value="">${allLabel}</option>`]
    .concat(values.map((value) => `<option value="${value}">${value}</option>`))
    .join("");
}

function renderOpportunities() {
  const { countries, levels } = getOpportunityFilterOptions();
  const { international, national } = SITE_DATA.opportunities;

  return `
    <div class="section-header">
      <h2>Oportunidades de estancias de investigación / veranos</h2>
      <p>Programas nacionales e internacionales para estudiantes de ciencias en México/Latinoamérica.</p>
    </div>
    <div class="panel-body">
      <form class="opp-filters" id="opp-filters" aria-label="Filtrar oportunidades">
        <label class="opp-filter">
          <span>País</span>
          <select id="filter-pais" name="pais">
            ${renderSelectOptions(countries, "Todos los países")}
          </select>
        </label>
        <label class="opp-filter">
          <span>Nivel académico</span>
          <select id="filter-nivel" name="nivel">
            ${renderSelectOptions(levels, "Todos los niveles")}
          </select>
        </label>
        <label class="opp-filter">
          <span>Financiamiento</span>
          <select id="filter-financiamiento" name="financiamiento">
            <option value="">Todos</option>
            <option value="full">Completo</option>
            <option value="partial">Parcial</option>
            <option value="none">N/A</option>
          </select>
        </label>
        <button class="opp-filter-reset" id="filter-reset" type="reset">Limpiar filtros</button>
      </form>
      <h3 class="subsection-title">Internacional</h3>
      <div id="opp-international">${renderOpportunitiesTable(international, false)}</div>
      <h3 class="subsection-title">Nacional</h3>
      <div id="opp-national">${renderOpportunitiesTable(national, true)}</div>
    </div>
  `;
}

function applyOpportunityFilters() {
  const filters = {
    country: document.getElementById("filter-pais")?.value || "",
    level: document.getElementById("filter-nivel")?.value || "",
    funding: document.getElementById("filter-financiamiento")?.value || "",
  };
  const { international, national } = SITE_DATA.opportunities;
  const intl = international.filter((row) => rowMatchesFilters(row, false, filters));
  const nat = national.filter((row) => rowMatchesFilters(row, true, filters));

  const intlEl = document.getElementById("opp-international");
  const natEl = document.getElementById("opp-national");
  if (intlEl) {
    intlEl.innerHTML = intl.length
      ? renderOpportunitiesTable(intl, false)
      : `<p class="opp-empty">No hay programas internacionales con esos filtros.</p>`;
  }
  if (natEl) {
    natEl.innerHTML = nat.length
      ? renderOpportunitiesTable(nat, true)
      : `<p class="opp-empty">No hay programas nacionales con esos filtros.</p>`;
  }
}

function initOpportunityFilters() {
  const form = document.getElementById("opp-filters");
  if (!form) return;
  form.addEventListener("change", applyOpportunityFilters);
  form.addEventListener("reset", () => {
    requestAnimationFrame(applyOpportunityFilters);
  });
}

const GARY_QUOTE =
  " Si no tienes exito la primera vez, no te rindas, incluso si tienes que intentarlo unas 3000 veces -Gary.";

function formatClosingParagraph(text) {
  if (text.includes(GARY_QUOTE)) {
    const formatted = text.replace(
      GARY_QUOTE,
      `<span class="greeting-quote">${GARY_QUOTE}</span>`
    );
    return `<p>${formatted}</p>`;
  }
  return `<p>${text}</p>`;
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
    .map((post) => {
      const body = (post.body || []).map((p) => `<p>${p}</p>`).join("");
      const image = post.image
        ? `<img class="blog-image" src="${post.image}" alt="" width="220" height="220" />`
        : "";
      return `
    <article class="blog-card" data-post-id="${post.id}">
      <div class="blog-card-top">
        <div class="blog-card-copy">
          <time class="blog-date" datetime="${post.date}">${formatDate(post.date)}</time>
          <h3>${post.title}</h3>
          <div class="blog-tags">${post.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
          <p class="blog-excerpt">${post.excerpt}</p>
        </div>
        ${image}
      </div>
      <div class="blog-body">${body}</div>
      <button class="main-button read-more read-more--disabled" type="button" disabled aria-disabled="true">Disponible pronto</button>
    </article>`;
    })
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

function initBlogExpand() {
  document.getElementById("panel-blog").addEventListener("click", (event) => {
    const button = event.target.closest(".read-more");
    if (!button) return;
    const card = button.closest(".blog-card");
    const isOpen = card.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.textContent = isOpen ? "Cerrar" : "Leer más";
  });
}

function renderCrashCourse() {
  const { steps } = SITE_DATA.intro;
  const nodes = steps
    .map((step, index) => {
      const title = step.title || `Paso ${index + 1}`;
      const text = step.text || step;
      return `
        <li class="tree-node">
          <div class="tree-square">
            <span class="tree-index">${String(index).padStart(2, "0")}</span>
            <strong class="tree-title">${title}</strong>
            <p class="tree-text">${text}</p>
          </div>
        </li>`;
    })
    .join("");

  return `
    <h3 class="subsection-title">Crash Course de Ciencia en el Extranjero</h3>
    <div class="code-tree" aria-label="Árbol de decisión del crash course">
      <div class="code-tree-title">
        <span>crash_course.py - IDE</span>
        <span class="code-tree-win">_ □ X</span>
      </div>
      <div class="code-tree-menu">
        <span>Archivo</span>
        <span>Editar</span>
        <span>Ver</span>
        <span>Ayuda</span>
      </div>
      <div class="code-tree-editor">
        <ol class="decision-tree">${nodes}</ol>
      </div>
      <div class="code-tree-status">Ln 1, Col 1&nbsp;&nbsp;DOS&nbsp;&nbsp;Python</div>
    </div>
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
    <div class="external-feature${e.image ? " external-feature--with-image" : ""}">
      <div class="resource-card">
        <h3>${e.name}</h3>
        <p>${e.description}</p>
        <div class="resource-links">
          <a class="main-button" href="${e.link}" target="_blank" rel="noopener noreferrer">Abrir repositorio</a>
        </div>
      </div>
      ${e.image ? `<img class="external-feature-image" src="${e.image}" alt="" width="200" height="200" />` : ""}
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
      <div class="home-hero-brand">
        <img
          class="hero-logo-title"
          src="Logo_Ciencia_new_Letras.png"
          alt="Ciencia en el Extranjero"
          width="480"
          height="auto"
        />
      </div>
      <p class="home-subtitle">${subtitle}</p>
    </section>
  `;
}

function renderGreeting() {
  const greeting = SITE_DATA.intro.greeting;
  const intro = (greeting.paragraphs || []).map((text) => `<p>${text}</p>`).join("");
  const moreParagraphs = greeting.more || [];
  const moreFirst = moreParagraphs[0] ? `<p class="greeting-more-p1">${moreParagraphs[0]}</p>` : "";
  const moreSecond = moreParagraphs[1] ? `<p class="greeting-more-p2">${moreParagraphs[1]}</p>` : "";
  const moreRest = moreParagraphs.slice(2).map((text) => `<p>${text}</p>`).join("");
  const closing = (greeting.closing || []).map((text) => formatClosingParagraph(text)).join("");
  const linkedin = greeting.linkedin
    ? `<p class="greeting-linkedin">
        <a href="${greeting.linkedin}" target="_blank" rel="noopener noreferrer" class="linkedin-btn">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path fill="#ffffff" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn
        </a>
      </p>`
    : "";

  return `
    <section id="greeting" class="greeting-section" aria-label="Presentación">
      <div class="greeting-intro">
        <div class="greeting-photo-stack">
          <img
            class="greeting-photo"
            src="Me_photo_landing_page.jpeg"
            alt="Andrés Pérez-Hernández"
            width="320"
            height="290"
          />
          <img
            class="greeting-photo-accent"
            src="graphics/7628375_3695169_together_2.svg"
            alt=""
            width="320"
            height="120"
          />
        </div>
        <div class="greeting-lead">
          <h2>${greeting.title || "¡Hola! Me llamo Andrés"}</h2>
          ${intro}
        </div>
      </div>
      <div class="greeting-content">
        <div class="greeting-more">
          ${greeting.moreTitle ? `<h3 class="greeting-more-title">${greeting.moreTitle}</h3>` : ""}
          ${moreFirst}
          ${moreSecond}
          <div class="greeting-more-visual greeting-more-visual--ug">
            <img
              class="greeting-more-image"
              src="graphics/Primer_verano_UG.png"
              alt="Primer verano de investigación en la Universidad de Guanajuato"
              width="380"
              height="380"
            />
          </div>
          <div class="greeting-more-visual greeting-more-visual--ucsd">
            <img
              class="greeting-more-image"
              src="graphics/verano_ucsd.jpg"
              alt="Verano de investigación en UC San Diego"
              width="300"
              height="200"
            />
          </div>
          ${moreRest}
        </div>
        <div class="greeting-after">
          ${greeting.share ? `<h2 class="greeting-share">${greeting.share}</h2>` : ""}
          ${closing}
          ${linkedin}
        </div>
      </div>
    </section>
  `;
}

function initTabs() {
  const panels = {
    inicio: document.getElementById("panel-inicio"),
    oportunidades: document.getElementById("panel-oportunidades"),
    recursos: document.getElementById("panel-recursos"),
    blog: document.getElementById("panel-blog"),
  };

  document.getElementById("panel-inicio").innerHTML = renderInicio();
  document.getElementById("panel-oportunidades").innerHTML = renderOpportunities();
  document.getElementById("panel-blog").innerHTML = renderBlog();
  document.getElementById("panel-recursos").innerHTML = renderResources();
  initOpportunityFilters();
  initBlogExpand();

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
