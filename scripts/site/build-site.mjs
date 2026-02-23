import fs from "node:fs/promises";
import fssync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..", "..");
const outDir = path.resolve(rootDir, process.env.SITE_OUT_DIR || "site-dist");
const githubRepoUrl = "https://github.com/kasparsj/triode";

const sidebarGroups = [
  { key: "home", label: "Overview" },
  { key: "getting-started", label: "Getting Started" },
  { key: "concepts", label: "Core Concepts" },
  { key: "api", label: "API Reference" },
  { key: "recipes", label: "Cookbook" },
  { key: "workflow", label: "Livecoding Workflow" },
  { key: "interop", label: "Hydra Interop" },
  { key: "support", label: "Troubleshooting" },
  { key: "reference", label: "Reference" },
  { key: "project", label: "Project" },
];

const docPages = [
  {
    source: "docs/index.md",
    output: "index.html",
    label: "Home",
    group: "home",
  },

  {
    source: "docs/getting-started/index.md",
    output: "docs/getting-started/index.html",
    label: "Getting Started",
    group: "getting-started",
  },
  {
    source: "docs/getting-started/installation.md",
    output: "docs/getting-started/installation.html",
    label: "Installation",
    group: "getting-started",
  },
  {
    source: "docs/getting-started/quickstart.md",
    output: "docs/getting-started/quickstart.html",
    label: "Quickstart",
    group: "getting-started",
  },
  {
    source: "docs/getting-started/first-patch.md",
    output: "docs/getting-started/first-patch.html",
    label: "First Patch",
    group: "getting-started",
  },
  {
    source: "docs/getting-started.md",
    output: "docs/getting-started.html",
    label: "Legacy Getting Started",
    group: "getting-started",
    sidebar: false,
  },

  {
    source: "docs/concepts/index.md",
    output: "docs/concepts/index.html",
    label: "Concepts Overview",
    group: "concepts",
  },
  {
    source: "docs/concepts/hydra-to-3d-mental-model.md",
    output: "docs/concepts/hydra-to-3d-mental-model.html",
    label: "Hydra to 3D Mental Model",
    group: "concepts",
  },
  {
    source: "docs/concepts/evaluation-model.md",
    output: "docs/concepts/evaluation-model.html",
    label: "Evaluation Model",
    group: "concepts",
  },
  {
    source: "docs/concepts/timing-state.md",
    output: "docs/concepts/timing-state.html",
    label: "Timing and State",
    group: "concepts",
  },
  {
    source: "docs/concepts/scene-graph.md",
    output: "docs/concepts/scene-graph.html",
    label: "Scene Graph",
    group: "concepts",
  },
  {
    source: "docs/concepts/rendering-pipeline.md",
    output: "docs/concepts/rendering-pipeline.html",
    label: "Rendering Pipeline",
    group: "concepts",
  },
  {
    source: "docs/concepts/chaining-composition.md",
    output: "docs/concepts/chaining-composition.html",
    label: "Chaining Patterns",
    group: "concepts",
  },

  {
    source: "docs/api/index.md",
    output: "docs/api/index.html",
    label: "API Overview",
    group: "api",
  },
  {
    source: "docs/api.md",
    output: "docs/api.html",
    label: "Generated API",
    group: "api",
  },
  {
    source: "docs/reference/parameter-reference.md",
    output: "docs/reference/parameter-reference.html",
    label: "Parameter Reference",
    group: "api",
  },
  {
    source: "docs/reference/semantic-clarifications.md",
    output: "docs/reference/semantic-clarifications.html",
    label: "Semantic Clarifications",
    group: "api",
  },

  {
    source: "docs/recipes/index.md",
    output: "docs/recipes/index.html",
    label: "Cookbook Overview",
    group: "recipes",
  },
  {
    source: "docs/recipes/common-recipes.md",
    output: "docs/recipes/common-recipes.html",
    label: "Common Recipes",
    group: "recipes",
  },

  {
    source: "docs/workflows/livecoding.md",
    output: "docs/workflows/livecoding.html",
    label: "Livecoding Workflow",
    group: "workflow",
  },
  {
    source: "docs/playground.md",
    output: "docs/playground.html",
    label: "Playground Guide",
    group: "workflow",
  },

  {
    source: "docs/interop/hydra-in-triode.md",
    output: "docs/interop/hydra-in-triode.html",
    label: "Hydra in triode",
    group: "interop",
  },
  {
    source: "docs/interop/hydra-equivalents.md",
    output: "docs/interop/hydra-equivalents.html",
    label: "Hydra Equivalents",
    group: "interop",
  },
  {
    source: "docs/upstream-differences.md",
    output: "docs/upstream-differences.html",
    label: "Compatibility Differences",
    group: "interop",
  },

  {
    source: "docs/support/troubleshooting-faq.md",
    output: "docs/support/troubleshooting-faq.html",
    label: "Troubleshooting + FAQ",
    group: "support",
  },
  {
    source: "docs/support/glossary.md",
    output: "docs/support/glossary.html",
    label: "Glossary",
    group: "support",
  },

  {
    source: "docs/reference/index.md",
    output: "docs/reference/index.html",
    label: "Reference Index",
    group: "reference",
  },
  {
    source: "docs/reference/examples-index.md",
    output: "docs/reference/examples-index.html",
    label: "Examples Index",
    group: "reference",
  },
  {
    source: "docs/reference/live-key-migration.md",
    output: "docs/reference/live-key-migration.html",
    label: "Live-Key Migration",
    group: "reference",
  },
  {
    source: "docs/performance/advanced-performance.md",
    output: "docs/performance/advanced-performance.html",
    label: "Performance Notes",
    group: "reference",
  },
  {
    source: "docs/production-checklist.md",
    output: "docs/production-checklist.html",
    label: "Production Checklist",
    group: "reference",
  },
  {
    source: "docs/reference/release-notes.md",
    output: "docs/reference/release-notes.html",
    label: "Release Notes",
    group: "reference",
  },
  {
    source: "docs/release.md",
    output: "docs/release.html",
    label: "Release Process",
    group: "reference",
  },
  {
    source: "docs/reference/documentation-checklist.md",
    output: "docs/reference/documentation-checklist.html",
    label: "Documentation Checklist",
    group: "reference",
  },
  {
    source: "docs/reference/docs-audit.md",
    output: "docs/reference/docs-audit.html",
    label: "Documentation Audit",
    group: "reference",
  },
  {
    source: "docs/reference/information-architecture.md",
    output: "docs/reference/information-architecture.html",
    label: "Docs IA",
    group: "reference",
  },
  {
    source: "docs/search.md",
    output: "docs/search.html",
    label: "Search",
    group: "reference",
    sidebar: false,
  },

  {
    source: "examples/README.md",
    output: "docs/examples-source.html",
    label: "Examples Source Guide",
    group: "project",
  },
  {
    source: "CONTRIBUTING.md",
    output: "docs/contributing.html",
    label: "Contributing",
    group: "project",
  },
  {
    source: "SECURITY.md",
    output: "docs/security.html",
    label: "Security",
    group: "project",
  },
  {
    source: "CHANGELOG.md",
    output: "docs/changelog.html",
    label: "Changelog",
    group: "project",
  },
];

const normalize = (value) => value.split(path.sep).join("/");

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const escapeAttr = (value) => escapeHtml(value);

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[`*_~()[\]{}:;,.!?/\\|"'<>]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

const relativeHref = (fromOutput, toOutput) => {
  const fromDir = path.posix.dirname(fromOutput);
  const rel = path.posix.relative(fromDir, toOutput);
  if (!rel) return "./";
  return rel.startsWith(".") ? rel : `./${rel}`;
};

const appendHash = (href, hash) => (hash ? `${href}#${hash}` : href);

const toTitleCase = (value) =>
  value
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const readText = async (relativePath) =>
  fs.readFile(path.join(rootDir, relativePath), "utf8");

const writeText = async (relativePath, content) => {
  const target = path.join(outDir, relativePath);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, content, "utf8");
};

const docOutputBySource = new Map(
  docPages.map((page) => [normalize(page.source), normalize(page.output)]),
);

const parseLinkTarget = (href) => {
  const [base, ...rest] = href.split("#");
  return {
    base,
    hash: rest.length > 0 ? rest.join("#") : "",
  };
};

const resolveMarkdownHref = (
  href,
  sourcePath,
  outputPath,
  exampleOutputBySource,
) => {
  if (!href) return href;
  if (/^(https?:|mailto:|tel:|#)/i.test(href)) return href;

  const { base, hash } = parseLinkTarget(href);
  const sourceDir = path.posix.dirname(normalize(sourcePath));
  const normalizedTarget = normalize(
    path.posix.normalize(path.posix.join(sourceDir, base)),
  );

  if (docOutputBySource.has(normalizedTarget)) {
    const toOutput = docOutputBySource.get(normalizedTarget);
    return appendHash(relativeHref(normalize(outputPath), toOutput), hash);
  }

  if (exampleOutputBySource.has(normalizedTarget)) {
    const toOutput = exampleOutputBySource.get(normalizedTarget);
    return appendHash(relativeHref(normalize(outputPath), toOutput), hash);
  }

  const absoluteTarget = path.join(rootDir, normalizedTarget);
  if (fssync.existsSync(absoluteTarget)) {
    const stat = fssync.statSync(absoluteTarget);
    const mode = stat.isDirectory() ? "tree" : "blob";
    return appendHash(
      `${githubRepoUrl}/${mode}/main/${normalizedTarget}`,
      hash,
    );
  }

  return href;
};

const formatInline = (line, context) => {
  const links = [];
  const codeTokens = [];

  let next = line;

  next = next.replace(/`([^`]+)`/g, (_match, code) => {
    const token = `@@CODE_${codeTokens.length}@@`;
    codeTokens.push(`<code>${escapeHtml(code)}</code>`);
    return token;
  });

  next = next.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => {
    const token = `@@LINK_${links.length}@@`;
    const resolved = resolveMarkdownHref(
      href,
      context.sourcePath,
      context.outputPath,
      context.exampleOutputBySource,
    );
    links.push(`<a href="${escapeAttr(resolved)}">${escapeHtml(label)}</a>`);
    return token;
  });

  next = escapeHtml(next);
  next = next.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  next = next.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  links.forEach((html, index) => {
    next = next.replace(`@@LINK_${index}@@`, html);
  });

  codeTokens.forEach((html, index) => {
    next = next.replace(`@@CODE_${index}@@`, html);
  });

  return next;
};

const parseTableCells = (line) =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());

const isTableSeparator = (line) => {
  const trimmed = line.trim();
  if (!trimmed.includes("|")) {
    return false;
  }
  const cells = trimmed
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim())
    .filter(Boolean);
  if (!cells.length) {
    return false;
  }
  return cells.every((cell) => /^:?-{3,}:?$/.test(cell));
};

const renderMarkdown = (markdown, context) => {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  const headingCount = new Map();
  let paragraph = [];
  let listType = null;
  let inCode = false;
  let codeLanguage = "";
  let codeBuffer = [];
  let table = null;

  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      html.push(`<p>${formatInline(paragraph.join(" "), context)}</p>`);
      paragraph = [];
    }
  };

  const flushCode = () => {
    const classAttr = codeLanguage
      ? ` class="language-${escapeAttr(codeLanguage)}"`
      : "";
    html.push(
      `<pre><code${classAttr}>${escapeHtml(codeBuffer.join("\n"))}</code></pre>`,
    );
    codeBuffer = [];
    codeLanguage = "";
  };

  const closeTable = () => {
    if (!table) {
      return;
    }
    const headRow = table.headers
      .map((cell) => `<th>${formatInline(cell, context)}</th>`)
      .join("");
    const bodyRows = table.rows
      .map(
        (row) =>
          `<tr>${row
            .map((cell) => `<td>${formatInline(cell, context)}</td>`)
            .join("")}</tr>`,
      )
      .join("\n");
    html.push(
      `<table><thead><tr>${headRow}</tr></thead><tbody>${bodyRows}</tbody></table>`,
    );
    table = null;
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (line.startsWith("```")) {
      if (inCode) {
        flushCode();
        inCode = false;
      } else {
        flushParagraph();
        closeList();
        closeTable();
        inCode = true;
        codeLanguage = line.replace(/^```/, "").trim();
      }
      continue;
    }

    if (inCode) {
      codeBuffer.push(line);
      continue;
    }

    if (table) {
      if (line.trim() && line.includes("|")) {
        table.rows.push(parseTableCells(line));
        continue;
      }
      closeTable();
    }

    if (/^\s*$/.test(line)) {
      flushParagraph();
      closeList();
      closeTable();
      continue;
    }

    const nextLine = lines[index + 1] || "";
    if (line.includes("|") && isTableSeparator(nextLine)) {
      flushParagraph();
      closeList();
      closeTable();
      table = {
        headers: parseTableCells(line),
        rows: [],
      };
      index += 1;
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      closeList();
      closeTable();
      const level = headingMatch[1].length;
      const headingText = headingMatch[2].trim();
      const baseId = slugify(headingText);
      const count = headingCount.get(baseId) || 0;
      headingCount.set(baseId, count + 1);
      const headingId = count > 0 ? `${baseId}-${count + 1}` : baseId;
      html.push(
        `<h${level} id="${escapeAttr(headingId)}">${formatInline(headingText, context)}</h${level}>`,
      );
      continue;
    }

    if (/^>\s?/.test(line)) {
      flushParagraph();
      closeList();
      closeTable();
      const quoteText = line.replace(/^>\s?/, "");
      html.push(`<blockquote>${formatInline(quoteText, context)}</blockquote>`);
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      closeTable();
      if (listType !== "ul") {
        closeList();
        listType = "ul";
        html.push("<ul>");
      }
      html.push(
        `<li>${formatInline(line.replace(/^[-*]\s+/, ""), context)}</li>`,
      );
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      flushParagraph();
      closeTable();
      if (listType !== "ol") {
        closeList();
        listType = "ol";
        html.push("<ol>");
      }
      html.push(
        `<li>${formatInline(line.replace(/^\d+\.\s+/, ""), context)}</li>`,
      );
      continue;
    }

    paragraph.push(line.trim());
  }

  if (inCode) {
    flushCode();
  }

  closeTable();
  flushParagraph();
  closeList();
  return html.join("\n");
};

const renderLayout = ({
  title,
  outputPath,
  activeKey,
  content,
  scripts = "",
}) => {
  const navItems = [
    { key: "overview", label: "Home", output: "index.html" },
    { key: "start", label: "Start", output: "docs/getting-started.html" },
    { key: "api", label: "API", output: "docs/api.html" },
    { key: "playground", label: "Playground", output: "playground/index.html" },
    { key: "examples", label: "Examples", output: "examples/index.html" },
  ];

  const cssHref = relativeHref(normalize(outputPath), "assets/site.css");
  const navHtml = navItems
    .map((item) => {
      const href = relativeHref(normalize(outputPath), item.output);
      const classes = item.key === activeKey ? "active" : "";
      return `<a class="${classes}" href="${escapeAttr(href)}">${escapeHtml(item.label)}</a>`;
    })
    .join("\n");

  const repoLink =
    '<a class="repo" href="https://github.com/kasparsj/triode">GitHub</a>';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)} | triode</title>
    <link rel="stylesheet" href="${escapeAttr(cssHref)}" />
  </head>
  <body>
    <div class="site-shell">
      <header class="topbar">
        <div class="topbar-inner">
          <a class="brand" href="${escapeAttr(relativeHref(normalize(outputPath), "index.html"))}">
            <span class="brand-dot" aria-hidden="true"></span>
            <span>triode</span>
          </a>
          <nav class="nav">
            ${navHtml}
            ${repoLink}
          </nav>
        </div>
      </header>
      ${content}
      <p class="footer-note">Generated from repository docs and examples.</p>
    </div>
    ${scripts}
  </body>
</html>
`;
};

const resolveActiveKey = (outputPath) => {
  const normalized = normalize(outputPath);
  if (normalized.includes("/playground")) return "playground";
  if (normalized.includes("/examples")) return "examples";
  if (normalized.includes("getting-started")) return "start";
  if (
    normalized.includes("/api/") ||
    normalized.endsWith("/api.html") ||
    normalized.includes("/reference/") ||
    normalized.includes("/support/") ||
    normalized.includes("/performance/") ||
    normalized.includes("release") ||
    normalized.includes("production")
  ) {
    return "api";
  }
  if (normalized.startsWith("docs/")) return "start";
  return "overview";
};

const paginationPages = docPages.filter((page) => page.sidebar !== false);

const renderDocSidebar = (currentPage) => {
  const sections = sidebarGroups
    .map((group) => {
      const groupedPages = docPages.filter(
        (page) => page.group === group.key && page.sidebar !== false,
      );
      if (!groupedPages.length) {
        return "";
      }
      const links = groupedPages
        .map((page) => {
          const href = relativeHref(
            normalize(currentPage.output),
            normalize(page.output),
          );
          const classes = page.output === currentPage.output ? "active" : "";
          return `<a class="${classes}" href="${escapeAttr(href)}">${escapeHtml(page.label)}</a>`;
        })
        .join("\n");
      return `<section class="doc-sidebar-group"><h3>${escapeHtml(group.label)}</h3>${links}</section>`;
    })
    .filter(Boolean)
    .join("\n");
  return sections;
};

const stripMarkdownSyntax = (value) =>
  value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/^>\s?/gm, "")
    .replace(/[|*_#]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const collectSearchEntries = (page, markdown) => {
  const entries = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let inCode = false;
  let current = {
    title: page.label,
    hash: "",
    text: [],
  };

  const flushEntry = () => {
    const excerpt = stripMarkdownSyntax(current.text.join(" ")).slice(0, 240);
    if (!current.title) {
      return;
    }
    const href = appendHash(
      relativeHref("docs/search.html", normalize(page.output)),
      current.hash,
    );
    entries.push({
      page: page.label,
      section: current.title,
      href,
      excerpt,
    });
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) {
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushEntry();
      const headingText = stripMarkdownSyntax(headingMatch[2].trim());
      current = {
        title: headingText || page.label,
        hash: slugify(headingText),
        text: [],
      };
      continue;
    }

    if (!line.trim()) {
      continue;
    }

    current.text.push(line.trim());
  }

  flushEntry();

  return entries.filter((entry) => entry.section && entry.href);
};

const buildDocPages = async (exampleOutputBySource) => {
  const searchEntries = [];

  for (const page of docPages) {
    const markdown = await readText(page.source);
    const body = renderMarkdown(markdown, {
      sourcePath: page.source,
      outputPath: page.output,
      exampleOutputBySource,
    });
    searchEntries.push(...collectSearchEntries(page, markdown));

    const sidebar = renderDocSidebar(page);
    const paginationIndex = paginationPages.findIndex(
      (entry) => entry.output === page.output,
    );
    const prevPage =
      paginationIndex > 0 ? paginationPages[paginationIndex - 1] : null;
    const nextPage =
      paginationIndex >= 0 && paginationIndex + 1 < paginationPages.length
        ? paginationPages[paginationIndex + 1]
        : null;
    const pagination = `
      <nav class="doc-pagination">
        ${
          prevPage
            ? `<a class="doc-pagination-link prev" href="${escapeAttr(
                relativeHref(
                  normalize(page.output),
                  normalize(prevPage.output),
                ),
              )}"><span>Previous</span><strong>${escapeHtml(prevPage.label)}</strong></a>`
            : '<span class="doc-pagination-empty"></span>'
        }
        ${
          nextPage
            ? `<a class="doc-pagination-link next" href="${escapeAttr(
                relativeHref(
                  normalize(page.output),
                  normalize(nextPage.output),
                ),
              )}"><span>Next</span><strong>${escapeHtml(nextPage.label)}</strong></a>`
            : '<span class="doc-pagination-empty"></span>'
        }
      </nav>
    `;

    const sourceHref = `${githubRepoUrl}/blob/main/${normalize(page.source)}`;
    const searchPanel =
      page.output === "docs/search.html"
        ? `
          <section class="search-panel">
            <label for="search-query-input">Query</label>
            <input id="search-query-input" type="search" placeholder="Search docs..." />
            <p id="search-status" class="search-status"></p>
            <ul id="search-results" class="search-results"></ul>
          </section>
        `
        : "";

    const content = `
      <main class="page doc-grid">
        <aside class="doc-sidebar">
          <h2>Documentation</h2>
          ${sidebar}
        </aside>
        <section class="doc-main">
          <div class="doc-meta">Source: <a href="${escapeAttr(sourceHref)}">${escapeHtml(page.source)}</a></div>
          <article class="prose">${body}${searchPanel}</article>
          ${pagination}
        </section>
      </main>
    `;

    const searchScript =
      page.output === "docs/search.html"
        ? `
          <script>
            (function () {
              const input = document.getElementById("search-query-input");
              const list = document.getElementById("search-results");
              const status = document.getElementById("search-status");
              if (!input || !list || !status) return;

              const searchParams = new URLSearchParams(window.location.search);
              const initialQuery = (searchParams.get("q") || "").trim();
              if (initialQuery) input.value = initialQuery;

              const indexUrl = new URL("${escapeAttr(
                relativeHref(page.output, "docs/search-index.json"),
              )}", window.location.href);

              const renderResults = (entries, query) => {
                list.innerHTML = "";
                const normalizedQuery = query.trim().toLowerCase();
                if (!normalizedQuery) {
                  status.textContent = "Enter a query to search docs pages and headings.";
                  return;
                }

                const terms = normalizedQuery.split(/\\s+/).filter(Boolean);
                const matches = entries.filter((entry) => {
                  const haystack = (entry.section + " " + (entry.excerpt || "") + " " + entry.page).toLowerCase();
                  return terms.every((term) => haystack.includes(term));
                });

                status.textContent = matches.length
                  ? matches.length + " result" + (matches.length === 1 ? "" : "s")
                  : "No results.";

                matches.slice(0, 80).forEach((entry) => {
                  const li = document.createElement("li");
                  const a = document.createElement("a");
                  a.href = entry.href;
                  a.textContent = entry.section;
                  const meta = document.createElement("p");
                  meta.textContent = entry.page + (entry.excerpt ? " - " + entry.excerpt : "");
                  li.appendChild(a);
                  li.appendChild(meta);
                  list.appendChild(li);
                });
              };

              fetch(indexUrl.toString())
                .then((response) => {
                  if (!response.ok) throw new Error("Search index unavailable");
                  return response.json();
                })
                .then((payload) => {
                  const entries = Array.isArray(payload.entries) ? payload.entries : [];
                  const run = () => {
                    const query = input.value || "";
                    const params = new URLSearchParams(window.location.search);
                    if (query.trim()) params.set("q", query.trim());
                    else params.delete("q");
                    history.replaceState({}, "", window.location.pathname + (params.toString() ? "?" + params.toString() : ""));
                    renderResults(entries, query);
                  };
                  input.addEventListener("input", run);
                  run();
                })
                .catch((error) => {
                  status.textContent = "Search index unavailable: " + error.message;
                });
            })();
          </script>
        `
        : "";

    const html = renderLayout({
      title: page.label,
      outputPath: page.output,
      activeKey: resolveActiveKey(page.output),
      content,
      scripts: searchScript,
    });

    await writeText(page.output, html);
  }

  return searchEntries;
};

const collectExampleSources = async () => {
  const root = path.join(rootDir, "examples");
  const queue = [root];
  const files = [];

  while (queue.length > 0) {
    const current = queue.shift();
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        queue.push(absolute);
        continue;
      }
      if (entry.isFile() && absolute.endsWith(".js")) {
        files.push(normalize(path.relative(rootDir, absolute)));
      }
    }
  }

  return files.sort();
};

const createExampleOutputMap = (exampleSources) => {
  const outputBySource = new Map();
  for (const source of exampleSources) {
    const output = normalize(
      source.replace(/^examples\//, "examples/").replace(/\.js$/, ".html"),
    );
    outputBySource.set(source, output);
  }
  return outputBySource;
};

const renderExamplesIndex = async (exampleSources, outputBySource) => {
  const grouped = new Map();
  for (const source of exampleSources) {
    const relative = source.replace(/^examples\//, "");
    const category = relative.includes("/")
      ? relative.split("/")[0]
      : "general";
    const list = grouped.get(category) || [];
    list.push({
      source,
      name: toTitleCase(path.basename(relative, ".js")),
      output: outputBySource.get(source),
    });
    grouped.set(category, list);
  }

  const categories = Array.from(grouped.keys()).sort();
  const sections = categories
    .map((category) => {
      const cards = grouped
        .get(category)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((item) => {
          const runHref = relativeHref("examples/index.html", item.output);
          const sourceHref = `${githubRepoUrl}/blob/main/${item.source}`;
          return `
          <article class="example-card">
            <span class="pill">${escapeHtml(category)}</span>
            <h3>${escapeHtml(item.name)}</h3>
            <p><code>${escapeHtml(item.source.replace(/^examples\//, ""))}</code></p>
            <div class="actions">
              <a class="btn primary" href="${escapeAttr(runHref)}">Run Example</a>
              <a class="btn ghost" href="${escapeAttr(sourceHref)}">View Source</a>
            </div>
          </article>
        `;
        })
        .join("\n");

      return `
      <section>
        <h2>${escapeHtml(toTitleCase(category))}</h2>
        <div class="examples-grid">
          ${cards}
        </div>
      </section>
    `;
    })
    .join("\n");

  const content = `
    <main class="page doc-main">
      <section class="hero">
        <h1>Examples Gallery</h1>
        <p>All runnable examples are discovered automatically from <code>/examples</code>.</p>
      </section>
      <div class="prose">
        ${sections}
      </div>
    </main>
  `;

  const html = renderLayout({
    title: "Examples",
    outputPath: "examples/index.html",
    activeKey: "examples",
    content,
  });

  await writeText("examples/index.html", html);
};

const renderExamplePages = async (exampleSources, outputBySource) => {
  for (const source of exampleSources) {
    const outputPath = outputBySource.get(source);
    const code = await readText(source);
    const relativeName = source.replace(/^examples\//, "");
    const title = toTitleCase(path.basename(relativeName, ".js"));
    const sourceHref = `${githubRepoUrl}/blob/main/${source}`;
    const distHref = relativeHref(outputPath, "dist/triode.js");
    const exampleCode = JSON.stringify(code);
    const codeBlock = escapeHtml(code);
    const backToExamples = relativeHref(outputPath, "examples/index.html");
    const backToDocs = relativeHref(
      outputPath,
      "docs/reference/examples-index.html",
    );

    const content = `
      <main class="page example-page">
        <section class="example-head">
          <div class="actions">
            <a class="btn ghost" href="${escapeAttr(backToExamples)}">Back To Examples</a>
            <a class="btn ghost" href="${escapeAttr(backToDocs)}">Examples Index</a>
            <a class="btn ghost" href="${escapeAttr(sourceHref)}">View Source</a>
          </div>
          <h1>${escapeHtml(title)}</h1>
          <p class="example-sub"><code>${escapeHtml(relativeName)}</code></p>
        </section>
        <section class="viewer">
          <canvas id="hydra-canvas"></canvas>
          <div id="error-banner" class="error-banner"></div>
        </section>
        <section class="example-code">
          <details>
            <summary>Show Example Source</summary>
            <pre><code>${codeBlock}</code></pre>
          </details>
        </section>
      </main>
      <script src="${escapeAttr(distHref)}"></script>
      <script>
        (function () {
          const errorBanner = document.getElementById('error-banner');
          const showError = (message) => {
            errorBanner.style.display = 'block';
            errorBanner.textContent = message;
          };
          const canvas = document.getElementById('hydra-canvas');
          canvas.width = window.innerWidth;
          canvas.height = Math.max(window.innerHeight * 0.68, 420);
          const code = ${exampleCode};

          try {
            window.triodeSynth = new Triode({
              canvas: canvas,
              detectAudio: false,
              makeGlobal: true
            });
            window.hydraSynth = window.triodeSynth;
            if (typeof canvas.setAutoResize === 'function') {
              canvas.setAutoResize(true);
            }
            (0, eval)(code);
          } catch (error) {
            showError(error && error.stack ? error.stack : String(error));
          }

          window.addEventListener('error', (event) => {
            showError(event.message || 'Unknown runtime error');
          });
        })();
      </script>
    `;

    const html = renderLayout({
      title: `${title} Example`,
      outputPath,
      activeKey: "examples",
      content,
    });

    await writeText(outputPath, html);
  }
};

const copyStaticAssets = async () => {
  await fs.mkdir(path.join(outDir, "assets"), { recursive: true });
  await fs.copyFile(
    path.join(rootDir, "site/static/site.css"),
    path.join(outDir, "assets/site.css"),
  );

  await fs.mkdir(path.join(outDir, "dist"), { recursive: true });
  await fs.copyFile(
    path.join(rootDir, "dist/triode.js"),
    path.join(outDir, "dist/triode.js"),
  );

  try {
    await fs.mkdir(path.join(outDir, "docs"), { recursive: true });
    await fs.copyFile(
      path.join(rootDir, "docs", "versions.json"),
      path.join(outDir, "docs", "versions.json"),
    );
  } catch (_error) {
    // Optional local versions manifest for non-versioned builds.
  }

  await fs.cp(
    path.join(rootDir, "site", "playground"),
    path.join(outDir, "playground"),
    {
      recursive: true,
    },
  );
};

const writeNotFoundPage = async () => {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=./index.html" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Redirecting...</title>
  </head>
  <body>
    Redirecting to <a href="./index.html">home page</a>.
  </body>
</html>
`;
  await writeText("404.html", html);
};

const build = async () => {
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });

  const exampleSources = await collectExampleSources();
  const exampleOutputBySource = createExampleOutputMap(exampleSources);

  await copyStaticAssets();
  const searchEntries = await buildDocPages(exampleOutputBySource);
  await writeText(
    "docs/search-index.json",
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        entries: searchEntries,
      },
      null,
      2,
    )}\n`,
  );
  await renderExamplesIndex(exampleSources, exampleOutputBySource);
  await renderExamplePages(exampleSources, exampleOutputBySource);
  await writeNotFoundPage();

  console.log(`Site generated at ${outDir}`);
  console.log(`Docs pages: ${docPages.length}`);
  console.log(`Example pages: ${exampleSources.length}`);
};

await build();
