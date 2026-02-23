import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..", "..");

const MARKDOWN_CODE_BLOCK_RE = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
const JS_LANGUAGES = new Set([
  "js",
  "javascript",
  "ts",
  "typescript",
  "jsx",
  "tsx",
]);

const STATIC_MD_FILES = ["README.md", "examples/README.md"];

const walkMarkdownFiles = async (relativeDir) => {
  const absoluteDir = path.join(rootDir, relativeDir);
  const result = [];

  const walk = async (dir) => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index];
      const absolutePath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(absolutePath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        result.push(path.relative(rootDir, absolutePath));
      }
    }
  };

  await walk(absoluteDir);
  return result;
};

const readText = async (relativePath) => {
  return fs.readFile(path.join(rootDir, relativePath), "utf8");
};

const toLineNumber = (value, offset) => {
  return value.slice(0, offset).split(/\r?\n/).length;
};

const shouldSkipSnippet = (code) => {
  return /@illustrative|illustrative snippet/i.test(code);
};

const checkSnippet = (code, file, line) => {
  const result = ts.transpileModule(code, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      allowJs: true,
      checkJs: false,
      noEmit: true,
    },
    reportDiagnostics: true,
  });

  const diagnostics = (result.diagnostics || []).filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  );

  return diagnostics.map((diagnostic) => {
    const message = ts.flattenDiagnosticMessageText(
      diagnostic.messageText,
      "\n",
    );
    return `${file}:${line} - ${message}`;
  });
};

const main = async () => {
  const docsMarkdown = await walkMarkdownFiles("docs");
  const files = Array.from(new Set([...docsMarkdown, ...STATIC_MD_FILES])).sort(
    (a, b) => a.localeCompare(b),
  );

  const failures = [];
  let checked = 0;
  let skipped = 0;

  for (let fileIndex = 0; fileIndex < files.length; fileIndex += 1) {
    const file = files[fileIndex];
    const content = await readText(file);
    const matches = [...content.matchAll(MARKDOWN_CODE_BLOCK_RE)];

    for (let matchIndex = 0; matchIndex < matches.length; matchIndex += 1) {
      const match = matches[matchIndex];
      const language = (match[1] || "").toLowerCase();
      const code = match[2] || "";

      if (!JS_LANGUAGES.has(language)) {
        continue;
      }

      if (shouldSkipSnippet(code)) {
        skipped += 1;
        continue;
      }

      checked += 1;
      const offset = match.index || 0;
      const line = toLineNumber(content, offset);
      failures.push(...checkSnippet(code, file, line));
    }
  }

  if (failures.length > 0) {
    throw new Error(
      `Code snippet syntax check failed:\n${failures
        .slice(0, 120)
        .map((entry) => `- ${entry}`)
        .join("\n")}${failures.length > 120 ? "\n- ..." : ""}`,
    );
  }

  console.log(
    `Snippet syntax check passed (${checked} checked, ${skipped} marked illustrative).`,
  );
};

await main();
