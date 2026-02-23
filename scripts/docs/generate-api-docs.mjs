import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..", "..");

const checkMode = process.argv.includes("--check");

const readText = async (relativePath) => {
  return fs.readFile(path.join(rootDir, relativePath), "utf8");
};

const ensureDir = async (relativePath) => {
  await fs.mkdir(path.join(rootDir, relativePath), { recursive: true });
};

const toUniqueList = (values) => Array.from(new Set(values.filter(Boolean)));

const extractBraceBlock = (source, marker) => {
  const start = source.indexOf(marker);
  if (start === -1) {
    throw new Error(`Could not find marker: ${marker}`);
  }

  const openIndex = source.indexOf("{", start);
  if (openIndex === -1) {
    throw new Error(`Could not find opening brace for marker: ${marker}`);
  }

  let depth = 1;
  for (let index = openIndex + 1; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(openIndex + 1, index);
      }
    }
  }

  throw new Error(`Could not find closing brace for marker: ${marker}`);
};

const normalizeDocComment = (commentLines) => {
  if (!commentLines.length) {
    return "";
  }
  const joined = commentLines
    .join("\n")
    .replace(/^\s*\/\*\*\s*/, "")
    .replace(/\s*\*\/\s*$/, "");
  const cleaned = joined
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*\*\s?/, "").trim())
    .filter(Boolean)
    .join(" ")
    .trim();
  return cleaned;
};

const measureDepthDelta = (value) => {
  const stack = {
    paren: 0,
    brace: 0,
    bracket: 0,
  };
  const chars = value.split("");
  for (let index = 0; index < chars.length; index += 1) {
    const char = chars[index];
    if (char === "(") stack.paren += 1;
    if (char === ")") stack.paren -= 1;
    if (char === "{") stack.brace += 1;
    if (char === "}") stack.brace -= 1;
    if (char === "[") stack.bracket += 1;
    if (char === "]") stack.bracket -= 1;
  }
  return stack;
};

const extractEntryName = (signature) => {
  const normalized = signature.replace(/\s+/g, " ").trim().replace(/;$/, "");
  const match = normalized.match(/^([A-Za-z_][A-Za-z0-9_]*)\??\s*(?:\(|:)/);
  return match ? match[1] : null;
};

const extractTopLevelEntries = (block) => {
  const entries = [];
  const lines = block.split(/\r?\n/);
  let pendingCommentLines = [];
  let inComment = false;
  let pendingComment = "";
  let declarationLines = [];
  let depth = {
    paren: 0,
    brace: 0,
    bracket: 0,
  };

  const flushDeclaration = () => {
    if (!declarationLines.length) {
      return;
    }
    const signature = declarationLines.join(" ").replace(/\s+/g, " ").trim();
    const name = extractEntryName(signature);
    if (name) {
      entries.push({
        name,
        signature: signature.replace(/;$/, ""),
        description: pendingComment,
      });
    }
    declarationLines = [];
    depth = { paren: 0, brace: 0, bracket: 0 };
    pendingComment = "";
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!declarationLines.length) {
      if (!inComment && trimmed.startsWith("/**")) {
        inComment = true;
        pendingCommentLines = [line];
        if (trimmed.includes("*/")) {
          inComment = false;
          pendingComment = normalizeDocComment(pendingCommentLines);
          pendingCommentLines = [];
        }
        continue;
      }
      if (inComment) {
        pendingCommentLines.push(line);
        if (trimmed.includes("*/")) {
          inComment = false;
          pendingComment = normalizeDocComment(pendingCommentLines);
          pendingCommentLines = [];
        }
        continue;
      }
      if (!trimmed) {
        continue;
      }
    }

    declarationLines.push(trimmed);
    const lineDepth = measureDepthDelta(trimmed);
    depth.paren += lineDepth.paren;
    depth.brace += lineDepth.brace;
    depth.bracket += lineDepth.bracket;
    depth.paren = Math.max(0, depth.paren);
    depth.brace = Math.max(0, depth.brace);
    depth.bracket = Math.max(0, depth.bracket);

    if (
      /;\s*$/.test(trimmed) &&
      depth.paren === 0 &&
      depth.brace === 0 &&
      depth.bracket === 0
    ) {
      flushDeclaration();
    }
  }

  flushDeclaration();

  return entries;
};

const extractTopLevelMembers = (block) => {
  return toUniqueList(extractTopLevelEntries(block).map((entry) => entry.name));
};

const extractModuleExports = (source) => {
  const exportMatches = [...source.matchAll(/export\s*\{([\s\S]*?)\}\s*;?/g)];
  if (!exportMatches.length) {
    return [];
  }

  const exportList = exportMatches[exportMatches.length - 1][1];
  return exportList
    .replace(/\n/g, " ")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => entry.replace(/\s+as\s+.*/, "").trim())
    .filter(Boolean);
};

const extractModuleSignatures = (source, exportNames) => {
  const signatures = {};

  exportNames.forEach((name) => {
    const functionMatch = source.match(
      new RegExp(`function\\s+${name}\\s*\\(([^)]*)\\)`, "m"),
    );
    if (functionMatch) {
      signatures[name] =
        `${name}(${functionMatch[1].replace(/\s+/g, " ").trim()})`;
      return;
    }

    const arrowMatch = source.match(
      new RegExp(
        `const\\s+${name}\\s*=\\s*(?:async\\s*)?\\(([^)]*)\\)\\s*=>`,
        "m",
      ),
    );
    if (arrowMatch) {
      signatures[name] =
        `${name}(${arrowMatch[1].replace(/\s+/g, " ").trim()})`;
      return;
    }

    const singleArgArrowMatch = source.match(
      new RegExp(
        `const\\s+${name}\\s*=\\s*(?:async\\s*)?([^=\\n]+?)\\s*=>`,
        "m",
      ),
    );
    if (singleArgArrowMatch) {
      signatures[name] = `${name}(${singleArgArrowMatch[1]
        .replace(/[()]/g, "")
        .replace(/\s+/g, " ")
        .trim()})`;
      return;
    }

    signatures[name] = `${name}(...)`;
  });

  return signatures;
};

const extractTransforms = (source) => {
  const lines = source.split(/\r?\n/);
  const startIndex = lines.findIndex((line) =>
    line.includes("export default () => ["),
  );
  if (startIndex === -1) {
    throw new Error("Could not find transform export list start");
  }

  const transforms = [];
  const seen = new Set();

  for (let index = startIndex; index < lines.length; index += 1) {
    const nameMatch = lines[index].match(/^\s{2,4}name:\s*'([^']+)'/);
    if (!nameMatch) {
      continue;
    }

    const name = nameMatch[1];
    if (seen.has(name)) {
      continue;
    }

    let type = "";
    for (
      let lookAhead = index + 1;
      lookAhead <= index + 12 && lookAhead < lines.length;
      lookAhead += 1
    ) {
      const typeMatch = lines[lookAhead].match(/^\s{2,4}type:\s*'([^']+)'/);
      if (typeMatch) {
        type = typeMatch[1];
        break;
      }
      if (lines[lookAhead].match(/^\s{2,4}name:\s*'/)) {
        break;
      }
    }

    if (!type) {
      continue;
    }

    seen.add(name);
    transforms.push({ name, type });
  }

  return transforms;
};

const toTransformTypeIndex = (transforms) => {
  const byType = {};
  transforms.forEach(({ name, type }) => {
    if (!byType[type]) {
      byType[type] = [];
    }
    byType[type].push(name);
  });

  Object.keys(byType).forEach((type) => {
    byType[type].sort((a, b) => a.localeCompare(b));
  });

  return byType;
};

const constructorOptionNotes = {
  width: "Initial canvas width.",
  height: "Initial canvas height.",
  numSources: "Number of source slots (`s0..sN`).",
  numOutputs: "Number of output slots (`o0..oN`).",
  makeGlobal:
    "Installs helpers globally when true; keep false for host-safe embedding.",
  autoLoop: "Starts the internal RAF loop automatically.",
  detectAudio: "Enables audio analysis helpers.",
  enableStreamCapture: "Enables recorder/capture setup.",
  webgl: "Renderer backend version selection.",
  canvas: "Use an existing canvas element instead of auto-creating one.",
  css2DElement: "Optional mount target for CSS2D renderer.",
  css3DElement: "Optional mount target for CSS3D renderer.",
  precision: "Shader precision hint.",
  onError: "Runtime error hook for update/afterUpdate/tick contexts.",
  liveMode:
    "`continuous` keeps runtime state; `restart` recreates runtime behavior.",
  legacy: "Compatibility mode restoring older defaults and warning behavior.",
  extendTransforms: "Registers additional transform definitions at startup.",
  pb: "Legacy integration surface.",
};

const rendererNotes = {
  eval: "Evaluates livecoding source against the runtime sandbox.",
  setResolution: "Resizes canvas, outputs, and source buffers.",
  resetRuntime:
    "Clears scene and runtime state without destroying the instance.",
  liveGlobals: "Toggles global helper installation at runtime.",
  stage: "Creates/reuses scene and applies stage presets.",
  dispose: "Fully disposes the runtime and related resources.",
};

const synthNotes = {
  scene: "Returns a scene handle for manual scene composition.",
  stage: "Convenience scene bootstrap with camera/lights/world/render options.",
  setFunction: "Registers a custom transform definition.",
  liveGlobals: "Toggles helper globals in the active runtime.",
  onFrame: "Installs an update callback receiving `(dt, time)`.",
  hush: "Clears outputs and reset frame hooks to no-op handlers.",
};

const sceneNotes = {
  render: "Compiles the scene into output passes.",
  texture: "Alias of `.tex(...)`.",
  group: "Creates or reuses a scene subgroup.",
  find: "Returns matching child objects by property filter.",
  instanced: "Creates an instanced mesh object.",
};

const transformNotes = {
  render: "Alias of `.out(...)`.",
  tex: "Renders the current chain to a texture.",
  texMat: "Returns a Three material with current chain texture attached.",
  material: "Material bridge for basic/lambert/phong/custom options.",
  clear: "Alias of `.autoClear(...)`.",
};

const moduleAliasNotes = {
  tx: "Alias: `tex`",
  gm: "Alias: `geom`",
  mt: "Alias: `mat`",
  cmp: "Alias: `compose`",
  rnd: "Alias: `random`",
  nse: "Alias: `noiseUtil`",
  arr: "Typed-array utilities",
  el: "DOM element helpers",
  gui: "GUI helpers",
  math: "Math helper namespace",
};

const toOptionRows = (entries) => {
  return entries
    .map((entry) => {
      const propertyMatch = entry.signature.match(
        /^([A-Za-z_][A-Za-z0-9_]*)(\?)?:\s*([\s\S]+)$/,
      );
      if (!propertyMatch) {
        return null;
      }
      const [, name, optional, typeValue] = propertyMatch;
      return {
        name,
        type: typeValue.trim(),
        optional: optional === "?" ? "yes" : "no",
        description: constructorOptionNotes[name] || "",
      };
    })
    .filter(Boolean);
};

const toSignatureList = (entries, notes = {}) => {
  if (!entries.length) {
    return "- _(none)_";
  }
  return entries
    .map((entry) => {
      const note = Object.prototype.hasOwnProperty.call(notes, entry.name)
        ? notes[entry.name]
        : entry.description || "";
      return `- \`${entry.signature}\`${note ? ` - ${note}` : ""}`;
    })
    .join("\n");
};

const escapeTableCell = (value) => {
  return String(value || "").replace(/\|/g, "\\|");
};

const toModuleSections = (moduleDetails) => {
  return Object.entries(moduleDetails)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([moduleName, details]) => {
      const exportsList = details.exports
        .map((exportName) => {
          const signature =
            details.signatures[exportName] || `${exportName}(...)`;
          return `- \`${signature}\``;
        })
        .join("\n");
      const aliasNote = moduleAliasNotes[moduleName]
        ? `\n\n${moduleAliasNotes[moduleName]}`
        : "";
      return `### \`${moduleName}\`\n\n${exportsList}${aliasNote}`;
    })
    .join("\n\n");
};

const toMarkdown = ({
  manifest,
  moduleDetails,
  transforms,
  transformsByType,
}) => {
  const constructorRows = toOptionRows(manifest.constructorOptionEntries)
    .map(
      (row) =>
        `| \`${row.name}\` | \`${escapeTableCell(row.type)}\` | ${row.optional} | ${escapeTableCell(row.description)} |`,
    )
    .join("\n");

  const moduleRows = Object.entries(moduleDetails)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(
      ([moduleName, details]) =>
        `| \`${moduleName}\` | ${details.exports.length} | ${moduleAliasNotes[moduleName] || ""} |`,
    )
    .join("\n");

  const typeSections = Object.entries(transformsByType)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([type, names]) => {
      return `### \`${type}\`\n\n${names.map((name) => `- \`${name}\``).join("\n")}`;
    })
    .join("\n\n");

  return `# API Reference (Generated)

This file is generated by \`npm run docs:generate\` from source-of-truth APIs in:

- \`src/index.d.ts\`
- \`src/glsl/glsl-functions.js\`
- module export files in \`src/three/*.js\`, \`src/gui.js\`, and \`src/el.js\`

Do not edit this file manually.

## Surface Summary

- Constructor options: **${manifest.constructorOptions.length}**
- \`HydraRenderer\` members: **${manifest.hydraRendererMembers.length}**
- \`HydraSynthApi\` members: **${manifest.hydraSynthMembers.length}**
- \`HydraSceneApi\` members: **${manifest.sceneMembers.length}**
- Transform chain members: **${manifest.transformChainMembers.length}**
- Module namespaces: **${Object.keys(moduleDetails).length}**
- GLSL transforms: **${transforms.length}**

## Constructor Options (\`new Hydra(options)\`)

| Option | Type | Optional | Notes |
| --- | --- | --- | --- |
${constructorRows}

## \`HydraRenderer\` Members

${toSignatureList(manifest.hydraRendererEntries, rendererNotes)}

## \`HydraSynthApi\` Members

${toSignatureList(manifest.hydraSynthEntries, synthNotes)}

## \`HydraSceneApi\` Members

${toSignatureList(manifest.sceneEntries, sceneNotes)}

## Transform Chain Members

${toSignatureList(manifest.transformChainEntries, transformNotes)}

## Module Namespaces

| Namespace | Export Count | Notes |
| --- | ---: | --- |
${moduleRows}

${toModuleSections(moduleDetails)}

## Transform Catalog

${typeSections}

## Related Guides

- [API Overview](./api/index.md)
- [Parameter Reference](./reference/parameter-reference.md)
- [Semantic Clarifications](./reference/semantic-clarifications.md)
`;
};

const writeTargets = async (targets) => {
  const dirty = [];

  for (const { path: relativePath, content } of targets) {
    const absolutePath = path.join(rootDir, relativePath);
    let existingContent = null;
    try {
      existingContent = await fs.readFile(absolutePath, "utf8");
    } catch (_error) {
      existingContent = null;
    }

    if (existingContent !== content) {
      if (checkMode) {
        dirty.push(relativePath);
      } else {
        await fs.mkdir(path.dirname(absolutePath), { recursive: true });
        await fs.writeFile(absolutePath, content, "utf8");
      }
    }
  }

  if (checkMode && dirty.length > 0) {
    throw new Error(
      `Generated API docs are out of date:\n${dirty
        .map((entry) => `- ${entry}`)
        .join("\n")}\n\nRun: npm run docs:generate`,
    );
  }
};

const main = async () => {
  const typesSource = await readText("src/index.d.ts");
  const transformSource = await readText("src/glsl/glsl-functions.js");

  const moduleFiles = {
    gm: "src/three/gm.js",
    mt: "src/three/mt.js",
    tx: "src/three/tx.js",
    cmp: "src/three/cmp.js",
    rnd: "src/three/rnd.js",
    nse: "src/three/noise.js",
    arr: "src/three/arr.js",
    el: "src/el.js",
    gui: "src/gui.js",
    math: "src/three/math.js",
  };

  const constructorOptionEntries = extractTopLevelEntries(
    extractBraceBlock(typesSource, "export interface HydraOptions {"),
  );
  const hydraRendererEntries = extractTopLevelEntries(
    extractBraceBlock(typesSource, "declare class HydraRenderer {"),
  );
  const hydraSynthEntries = extractTopLevelEntries(
    extractBraceBlock(typesSource, "export interface HydraSynthApi {"),
  );
  const sceneEntries = extractTopLevelEntries(
    extractBraceBlock(typesSource, "export interface HydraSceneApi {"),
  );
  const transformChainEntries = extractTopLevelEntries(
    extractBraceBlock(typesSource, "export interface HydraTransformChain {"),
  );

  const modules = {};
  const moduleDetails = {};
  const moduleEntries = Object.entries(moduleFiles);
  for (let index = 0; index < moduleEntries.length; index += 1) {
    const [moduleName, modulePath] = moduleEntries[index];
    const moduleSource = await readText(modulePath);
    const exportsList = extractModuleExports(moduleSource);
    modules[moduleName] = exportsList;
    moduleDetails[moduleName] = {
      exports: exportsList,
      signatures: extractModuleSignatures(moduleSource, exportsList),
    };
  }

  const transforms = extractTransforms(transformSource).sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name);
    }
    return a.type.localeCompare(b.type);
  });
  const transformsByType = toTransformTypeIndex(transforms);

  const apiManifest = {
    constructorOptions: toUniqueList(
      constructorOptionEntries.map((entry) => entry.name),
    ),
    hydraRendererMembers: toUniqueList(
      hydraRendererEntries.map((entry) => entry.name),
    ),
    hydraSynthMembers: toUniqueList(
      hydraSynthEntries.map((entry) => entry.name),
    ),
    sceneMembers: toUniqueList(sceneEntries.map((entry) => entry.name)),
    transformChainMembers: toUniqueList(
      transformChainEntries.map((entry) => entry.name),
    ),
    constructorOptionEntries,
    hydraRendererEntries,
    hydraSynthEntries,
    sceneEntries,
    transformChainEntries,
    modules,
    counts: {
      constructorOptions: constructorOptionEntries.length,
      hydraRendererMembers: hydraRendererEntries.length,
      hydraSynthMembers: hydraSynthEntries.length,
      sceneMembers: sceneEntries.length,
      transformChainMembers: transformChainEntries.length,
      modules: Object.keys(modules).length,
      transforms: transforms.length,
    },
  };

  const markdown = await prettier.format(
    toMarkdown({
      manifest: apiManifest,
      moduleDetails,
      transforms,
      transformsByType,
    }),
    { parser: "markdown" },
  );

  await ensureDir("docs/.generated");

  await writeTargets([
    {
      path: "docs/.generated/api-manifest.json",
      content: `${JSON.stringify(apiManifest, null, 2)}\n`,
    },
    {
      path: "docs/.generated/transforms.json",
      content: `${JSON.stringify({ transforms, byType: transformsByType }, null, 2)}\n`,
    },
    {
      path: "docs/api.md",
      content: markdown,
    },
  ]);

  if (!checkMode) {
    console.log("Generated API docs and manifests.");
  } else {
    console.log("Generated API docs are in sync.");
  }
};

await main();
