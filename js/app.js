const FUNDING_LABELS = {
  full: { text: "Completo", class: "funding-full" },
  partial: { text: "Parcial", class: "funding-partial" },
  none: { text: "N/A", class: "funding-none" },
};

const AREA_OPTIONS = [
  "Ciencias Aplicadas",
  "Ciencias Sociales",
  "Ciencias Naturales",
];

const AREA_CLASSES = {
  "Ciencias Aplicadas": "area-aplicadas",
  "Ciencias Sociales": "area-sociales",
  "Ciencias Naturales": "area-naturales",
};

const FUNDING_OPTIONS = [
  { value: "full", label: "Completo" },
  { value: "partial", label: "Parcial" },
  { value: "none", label: "N/A" },
];

function isSelected(values, value) {
  return Array.isArray(values) && values.includes(value);
}

function renderTags(levels, activeLevels) {
  return (levels || []).map((l) => {
    const value = normalizeFilterLevel(l);
    const active = isSelected(activeLevels, value) ? " is-active" : "";
    return `<button type="button" class="tag filter-tag${active}" data-filter="nivel" data-value="${value}">${l}</button>`;
  }).join("");
}

function renderFunding(funding, activeFundings) {
  const f = FUNDING_LABELS[funding] || FUNDING_LABELS.none;
  const icon = funding === "full" ? "✓" : funding === "partial" ? "◐" : "✗";
  const active = isSelected(activeFundings, funding) ? " is-active" : "";
  return `<button type="button" class="funding-btn ${f.class} filter-tag${active}" data-filter="funding" data-value="${funding}">${icon} ${f.text}</button>`;
}

function rowAreas(row) {
  if (Array.isArray(row.area)) {
    const areas = row.area.filter((area) => area && area !== "General");
    return areas.length ? areas : AREA_OPTIONS;
  }
  if (!row.area || row.area === "General") return AREA_OPTIONS;
  return [row.area];
}

function renderArea(row, activeAreas) {
  return rowAreas(row)
    .map((area) => {
      const cls = AREA_CLASSES[area] || "area-aplicadas";
      const active = isSelected(activeAreas, area) ? " is-active" : "";
      return `<button type="button" class="area-tag ${cls} filter-tag${active}" data-filter="area" data-value="${area}">${area}</button>`;
    })
    .join("");
}

function renderOpportunitiesTable(rows, isNational, filters = {}) {
  const headers = isNational
    ? ["Programa", "Ciudad-Estado", "Institución", "Nivel académico", "Área", "Financiamiento", "Link"]
    : ["Programa", "País", "Institución", "Nivel académico", "Área", "Financiamiento", "Link"];

  const body = rows
    .map((row) => {
      const location = isNational ? row.city : row.country;
      return `<tr>
        <td><strong>${row.program}</strong></td>
        <td>${location}</td>
        <td>${row.institution}</td>
        <td>${renderTags(row.level, filters.levels)}</td>
        <td>${renderArea(row, filters.areas)}</td>
        <td>${renderFunding(row.funding, filters.fundings)}</td>
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

function rowMatchesLevel(rowLevels, filterLevels) {
  if (!filterLevels || !filterLevels.length) return true;
  return filterLevels.some((filterLevel) => {
    const accepted = LEVEL_FILTER_GROUPS[filterLevel] || [filterLevel];
    return (rowLevels || []).some((level) => accepted.includes(level));
  });
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
  if (!rowMatchesLevel(row.level, filters.levels)) return false;
  if (filters.areas.length && !rowAreas(row).some((area) => filters.areas.includes(area))) return false;
  if (filters.fundings.length && !filters.fundings.includes(row.funding)) return false;
  return true;
}

function renderSelectOptions(values, allLabel) {
  return [`<option value="">${allLabel}</option>`]
    .concat(values.map((value) => `<option value="${value}">${value}</option>`))
    .join("");
}

function renderFilterChips(options) {
  const chips = options
    .map((option) => {
      const value = typeof option === "string" ? option : option.value;
      const label = typeof option === "string" ? option : option.label;
      return `<button type="button" class="opp-chip" data-value="${value}">${label}</button>`;
    })
    .join("");

  return `<div class="opp-chip-row" role="group">${chips}</div>`;
}

function renderFaq(items) {
  if (!items || !items.length) return "";
  const entries = items
    .map(
      (item) => `
      <details class="faq-item">
        <summary>${item.q}</summary>
        <p>${item.a}</p>
      </details>`
    )
    .join("");

  return `
    <h3 class="subsection-title">Preguntas frecuentes</h3>
    <div class="faq-list">${entries}</div>
  `;
}

function renderOpportunities() {
  const { countries, levels } = getOpportunityFilterOptions();
  const { international, national, faq } = SITE_DATA.opportunities;

  return `
    <div class="section-header">
      <h2>Oportunidades de estancias de investigación / veranos</h2>
      <p>Programas nacionales e internacionales para estudiantes de ciencias en México/Latinoamérica.</p>
      <p class="opp-meta">Última actualización: agosto 2026</p>
      <p class="opp-disclaimer">Las convocatorias cambian. Verifica fechas, requisitos y financiamiento en el sitio oficial de cada programa.</p>
    </div>
    <div class="panel-body">
      <form class="opp-filters" id="opp-filters" aria-label="Filtrar oportunidades">
        <div class="opp-filter">
          <span>País</span>
          <select id="filter-pais" name="pais">
            ${renderSelectOptions(countries, "Todos los países")}
          </select>
        </div>
        <div class="opp-filter" data-filter="nivel">
          <span>Nivel académico</span>
          ${renderFilterChips(levels)}
        </div>
        <div class="opp-filter" data-filter="area">
          <span>Área</span>
          ${renderFilterChips(AREA_OPTIONS)}
        </div>
        <div class="opp-filter" data-filter="funding">
          <span>Financiamiento</span>
          ${renderFilterChips(FUNDING_OPTIONS)}
        </div>
        <div class="opp-filters-foot">
          <button class="opp-filter-reset" id="filter-reset" type="reset">Limpiar</button>
        </div>
      </form>
      <h3 class="subsection-title">Internacional</h3>
      <div id="opp-international">${renderOpportunitiesTable(international, false)}</div>
      <h3 class="subsection-title">Nacional</h3>
      <div id="opp-national">${renderOpportunitiesTable(national, true)}</div>
      ${renderFaq(faq)}
    </div>
  `;
}

function getChipValues(name) {
  return [...document.querySelectorAll(`[data-filter="${name}"] .opp-chip.is-active`)]
    .map((chip) => chip.dataset.value)
    .filter(Boolean);
}

function toggleChipValue(name, value) {
  const chip = document.querySelector(`[data-filter="${name}"] .opp-chip[data-value="${value}"]`);
  if (chip) chip.classList.toggle("is-active");
}

function getOpportunityFilters() {
  return {
    country: document.getElementById("filter-pais")?.value || "",
    levels: getChipValues("nivel"),
    areas: getChipValues("area"),
    fundings: getChipValues("funding"),
  };
}

function applyOpportunityFilters() {
  const filters = getOpportunityFilters();
  const { international, national } = SITE_DATA.opportunities;
  const intl = international.filter((row) => rowMatchesFilters(row, false, filters));
  const nat = national.filter((row) => rowMatchesFilters(row, true, filters));

  const intlEl = document.getElementById("opp-international");
  const natEl = document.getElementById("opp-national");
  if (intlEl) {
    intlEl.innerHTML = intl.length
      ? renderOpportunitiesTable(intl, false, filters)
      : `<p class="opp-empty">No hay programas internacionales con esos filtros.</p>`;
  }
  if (natEl) {
    natEl.innerHTML = nat.length
      ? renderOpportunitiesTable(nat, true, filters)
      : `<p class="opp-empty">No hay programas nacionales con esos filtros.</p>`;
  }
}

function initOpportunityFilters() {
  const form = document.getElementById("opp-filters");
  const panel = document.getElementById("panel-oportunidades");
  if (!form || !panel) return;

  form.addEventListener("change", applyOpportunityFilters);
  form.addEventListener("click", (event) => {
    const chip = event.target.closest(".opp-chip");
    if (!chip) return;
    chip.classList.toggle("is-active");
    applyOpportunityFilters();
  });
  form.addEventListener("reset", () => {
    form.querySelectorAll(".opp-chip").forEach((chip) => {
      chip.classList.remove("is-active");
    });
    requestAnimationFrame(applyOpportunityFilters);
  });

  panel.addEventListener("click", (event) => {
    const tag = event.target.closest(".filter-tag");
    if (!tag) return;
    toggleChipValue(tag.dataset.filter, tag.dataset.value);
    applyOpportunityFilters();
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
    <div id="crash-course" class="crash-course">
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
    </div>
  `;
}

function renderCrashCoursePreview() {
  const { steps } = SITE_DATA.intro;
  const items = steps
    .map((step, index) => {
      const title = step.title || `Paso ${index + 1}`;
      return `<li><span class="start-here-index">${String(index).padStart(2, "0")}</span> ${title}</li>`;
    })
    .join("");

  return `
    <aside class="start-here" aria-label="Empieza aquí">
      <h2>¿No sabes por dónde empezar?</h2>
      <p>Sigue mi crash course 101: una guía breve para empezar tu aplicación.</p>
      <ol class="start-here-steps">${items}</ol>
      <a class="main-button" href="#crash-course">Empieza aquí</a>
    </aside>
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
      ${renderCrashCoursePreview()}
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

  const shareUrl = "https://andres8ezau.github.io/";
  const shareText = encodeURIComponent(
    "Ciencia en el Extranjero — oportunidades de estancias de investigación para estudiantes de México y Latinoamérica."
  );
  const shareButtons = greeting.share
    ? `<div class="share-buttons">
        <a class="share-btn share-btn--whatsapp" href="https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path fill="currentColor" d="M12.04 2C6.5 2 2.004 6.486 2.004 12.02c0 1.77.463 3.45 1.268 4.91L2 22l5.204-1.247A10.01 10.01 0 0 0 12.04 22C17.58 22 22 17.514 22 11.98 22 6.486 17.58 2 12.04 2zm0 18.15c-1.64 0-3.21-.44-4.58-1.27l-.33-.2-3.09.74.73-3.01-.21-.34A8.13 8.13 0 0 1 3.86 12.02c0-4.5 3.68-8.16 8.18-8.16 4.5 0 8.18 3.66 8.18 8.16 0 4.5-3.68 8.13-8.18 8.13z"/>
          </svg>
          WhatsApp
        </a>
        <a class="share-btn share-btn--x" href="https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M18.244 2H21.5l-7.5 8.57L22.5 22h-6.59l-5.16-6.74L4.8 22H1.54l8.02-9.17L1 2h6.75l4.66 6.18L18.244 2zm-1.16 18.06h1.8L6.99 3.84H5.06l12.02 16.22z"/>
          </svg>
          X
        </a>
      </div>`
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
          ${shareButtons}
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
  const hashAliases = { home: "inicio", "crash-course": "recursos" };

  function activateTab(tabId, options = {}) {
    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tabId);
    });
    Object.entries(panels).forEach(([id, panel]) => {
      panel.classList.toggle("active", id === tabId);
    });
    history.replaceState(null, "", `#${options.hash || tabId}`);
    if (options.scrollTo) {
      requestAnimationFrame(() => {
        document.getElementById(options.scrollTo)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }

  function activateFromHash(hashValue) {
    const hash = hashValue.replace("#", "");
    const resolved = hashAliases[hash] || hash;
    if (!validTabs.includes(resolved)) {
      activateTab("inicio");
      return;
    }
    activateTab(resolved, hash === "crash-course" ? { hash, scrollTo: "crash-course" } : {});
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => activateTab(btn.dataset.tab));
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href="#crash-course"]');
    if (!link) return;
    event.preventDefault();
    activateTab("recursos", { hash: "crash-course", scrollTo: "crash-course" });
  });

  window.addEventListener("hashchange", () => {
    activateFromHash(location.hash);
  });

  activateFromHash(location.hash);
}

document.addEventListener("DOMContentLoaded", initTabs);
