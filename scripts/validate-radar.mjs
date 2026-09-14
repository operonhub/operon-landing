import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const rootDirectory = process.cwd();
const contentDirectory = path.join(rootDirectory, "content", "radar");
const publicDirectory = path.join(rootDirectory, "public");
const sourceRegistryPath = path.join(contentDirectory, "sources.json");
const documentationFiles = new Set(["README.md", "EDITORIAL_AUTOMATION.md"]);
const validStatuses = new Set(["draft", "review", "published"]);
const validSourceKinds = new Set(["primary", "institutional", "secondary"]);
const editorialFallback = "operon-operational-plate-v1";
const validCategories = new Set([
  "IA aplicada",
  "Automatización",
  "Ventas y CRM",
  "E-commerce",
  "Argentina y LatAm",
  "Datos y regulación",
]);
const initialEditorialSlugs = new Set();

const args = process.argv.slice(2);
const strict = args.includes("--strict");
const verifyUrls = args.includes("--verify-urls");
const autoPublish = args.includes("--auto-publish");
const filesIndex = args.indexOf("--files");
const requestedFiles = filesIndex === -1 ? [] : args.slice(filesIndex + 1).filter((value) => !value.startsWith("--"));
const errors = [];

function requiresAutoPublishContract(article) {
  return autoPublish && !initialEditorialSlugs.has(article.slug);
}

function addError(file, message) {
  errors.push(`${path.relative(rootDirectory, file)}: ${message}`);
}

function isIsoDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/.test(value) && !Number.isNaN(Date.parse(value));
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function normalize(value) {
  return String(value ?? "")
    .toLocaleLowerCase("es-AR")
    .normalize("NFD")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/[\s-]+/g, " ")
    .trim();
}

function similarity(left, right) {
  const leftTokens = new Set(normalize(left).split(" ").filter(Boolean));
  const rightTokens = new Set(normalize(right).split(" ").filter(Boolean));
  const union = new Set([...leftTokens, ...rightTokens]);
  const intersection = [...leftTokens].filter((token) => rightTokens.has(token));
  return union.size === 0 ? 0 : intersection.length / union.size;
}

function containsPlaceholder(value) {
  return /\b(?:todo|tbd|lorem ipsum|placeholder|texto de ejemplo|por definir|insertar|pendiente|xxx)\b/i.test(value);
}

function hasExternallyVerifiableClaim(body) {
  return /(?:\b\d+(?:[.,]\d+)?\s?(?:%|millones?|miles?|usuarios?|empresas?|d[ií]as?|meses?|a[nñ]os?)\b|\b(?:ley|decreto|resoluci[oó]n|regulaci[oó]n|normativa|entr[oó] en vigencia|anunci[oó]|report[oó]|seg[uú]n un estudio)\b)/i.test(body);
}

function isPublishedInLast90Days(article) {
  if (article.status !== "published" || !isIsoDate(article.publishedAt)) return false;
  const publishedAt = new Date(article.publishedAt);
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - 90);
  return publishedAt >= cutoff;
}

function parseArticle(source, file) {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);

  if (!match) {
    addError(file, "frontmatter JSON delimitado por --- ausente o inválido");
    return null;
  }

  try {
    return { ...JSON.parse(match[1]), body: match[2].trim() };
  } catch (error) {
    addError(file, `frontmatter JSON inválido (${error.message})`);
    return null;
  }
}

async function validateImage(file, image) {
  if (!image) return;

  if (typeof image !== "string") {
    addError(file, "seo.image debe ser una URL o una ruta local");
    return;
  }

  if (isHttpUrl(image)) {
    if (autoPublish) addError(file, "seo.image externo no está permitido en autopublicación; versionar el asset en public/radar/");
    return;
  }

  if (!image.startsWith("/")) {
    addError(file, "seo.image local debe comenzar con /");
    return;
  }

  const resolvedImage = path.resolve(publicDirectory, `.${image}`);
  if (!resolvedImage.startsWith(`${publicDirectory}${path.sep}`)) {
    addError(file, "seo.image local debe resolver dentro de public/");
    return;
  }

  try {
    await fs.access(resolvedImage);
  } catch {
    addError(file, `seo.image no existe: ${image}`);
  }
}

function validateClaimSources(file, article, sources) {
  if (!requiresAutoPublishContract(article)) return;

  if (!Array.isArray(article.claimSources)) {
    addError(file, "claimSources debe ser un array para autopublicación");
    return;
  }

  const sourceUrls = new Set(sources.map((source) => source.url));
  for (const [index, claimSource] of article.claimSources.entries()) {
    if (!claimSource || typeof claimSource.claim !== "string" || claimSource.claim.trim().length < 12) {
      addError(file, `claimSources[${index}].claim debe describir el claim con al menos 12 caracteres`);
    } else if (!normalize(article.body).includes(normalize(claimSource.claim))) {
      addError(file, `claimSources[${index}].claim debe existir en el cuerpo del artículo`);
    }

    if (!claimSource || !isHttpUrl(claimSource.sourceUrl) || !sourceUrls.has(claimSource.sourceUrl)) {
      addError(file, `claimSources[${index}].sourceUrl debe existir en sources`);
    }
  }

  if (hasExternallyVerifiableClaim(article.body) && article.claimSources.length === 0) {
    addError(file, "hay claims externamente verificables; declararlos en claimSources con su fuente");
  }
}

async function validateArticle(file) {
  const source = await fs.readFile(file, "utf8");
  const article = parseArticle(source, file);
  if (!article) return null;

  const fileSlug = path.basename(file, ".md");
  const requiredFields = ["slug", "status", "title", "excerpt", "category", "author", "readingMinutes", "sources", "seo"];
  for (const field of requiredFields) {
    if (article[field] === undefined || article[field] === null || article[field] === "") {
      addError(file, `falta ${field}`);
    }
  }

  if (article.slug !== fileSlug) addError(file, "slug debe coincidir con el nombre del archivo");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug ?? "")) addError(file, "slug inválido");
  if (!validStatuses.has(article.status)) addError(file, `status inválido: ${article.status}`);
  if (!validCategories.has(article.category)) addError(file, `categoría inválida: ${article.category}`);
  if (!Array.isArray(article.tags) || article.tags.length === 0 || !article.tags.every((tag) => typeof tag === "string" && tag.trim())) {
    addError(file, "tags debe contener al menos una etiqueta");
  }
  if (!article.author || typeof article.author.name !== "string" || !article.author.name.trim()) {
    addError(file, "author.name es obligatorio");
  }
  if (!Number.isInteger(article.readingMinutes) || article.readingMinutes < 1) {
    addError(file, "readingMinutes debe ser un entero mayor a cero");
  }
  if (article.publishedAt !== undefined && !isIsoDate(article.publishedAt)) addError(file, "publishedAt debe ser fecha ISO válida");
  if (article.updatedAt !== undefined && !isIsoDate(article.updatedAt)) addError(file, "updatedAt debe ser fecha ISO válida");
  if (article.status === "published" && !article.publishedAt) addError(file, "un artículo publicado requiere publishedAt");
  if (typeof article.body !== "string" || !article.body) addError(file, "el cuerpo del artículo está vacío");
  if (!article.seo || typeof article.seo !== "object") addError(file, "seo debe ser un objeto");
  await validateImage(file, article.seo?.image);

  const sources = Array.isArray(article.sources) ? article.sources : [];
  if (!Array.isArray(article.sources)) {
    addError(file, "sources debe ser un array");
  } else {
    for (const [index, item] of article.sources.entries()) {
      if (!item || typeof item.title !== "string" || !item.title.trim()) addError(file, `sources[${index}].title es obligatorio`);
      if (!item || !isHttpUrl(item.url)) addError(file, `sources[${index}].url debe ser una URL http(s) válida`);
    }
  }

  if (strict && article.status === "published" && !initialEditorialSlugs.has(article.slug) && sources.length < 2) {
    addError(file, "los artículos nuevos publicados requieren al menos dos fuentes");
  }

  if (requiresAutoPublishContract(article)) {
    if (article.status !== "published") addError(file, "autopublicación requiere status: published");
    if (!isIsoDate(article.publishedAt)) addError(file, "autopublicación requiere publishedAt ISO válido");
    if (sources.length < 2) addError(file, "autopublicación requiere al menos dos fuentes");
    if (!article.seo?.title || !article.seo?.description) addError(file, "autopublicación requiere seo.title y seo.description");
    if (!article.seo?.image && article.seo?.imageFallback !== editorialFallback) {
      addError(file, `autopublicación requiere seo.image local o seo.imageFallback: ${editorialFallback}`);
    }
    if (article.seo?.imageFallback && article.seo.imageFallback !== editorialFallback) {
      addError(file, `seo.imageFallback debe ser ${editorialFallback}`);
    }
    if (containsPlaceholder(`${article.title}\n${article.excerpt}\n${article.body}`)) {
      addError(file, "el contenido contiene placeholders o texto de ejemplo");
    }

    const primarySources = sources.filter((source) => source.kind === "primary");
    for (const [index, source] of sources.entries()) {
      if (typeof source.publisher !== "string" || !source.publisher.trim()) addError(file, `sources[${index}].publisher es obligatorio en autopublicación`);
      if (!validSourceKinds.has(source.kind)) addError(file, `sources[${index}].kind debe ser primary, institutional o secondary`);
    }
    if (primarySources.length === 0) addError(file, "autopublicación requiere al menos una fuente primary");
  }

  validateClaimSources(file, article, sources);

  return { file, ...article, sources };
}

async function validateSourceRegistry() {
  let registry;
  try {
    registry = JSON.parse(await fs.readFile(sourceRegistryPath, "utf8"));
  } catch (error) {
    addError(sourceRegistryPath, `sources.json inválido (${error.message})`);
    return;
  }

  if (!Array.isArray(registry.sources) || registry.sources.length === 0) {
    addError(sourceRegistryPath, "sources debe contener al menos una fuente");
    return;
  }

  const ids = new Set();
  const urls = new Set();
  for (const [index, source] of registry.sources.entries()) {
    if (!source?.id || !source?.name || !isHttpUrl(source?.url)) {
      addError(sourceRegistryPath, `sources[${index}] requiere id, name y URL http(s)`);
      continue;
    }
    if (ids.has(source.id)) addError(sourceRegistryPath, `id duplicado: ${source.id}`);
    if (urls.has(source.url)) addError(sourceRegistryPath, `URL duplicada: ${source.url}`);
    ids.add(source.id);
    urls.add(source.url);
  }
}

async function verifyRemoteUrl(file, url, label) {
  if (!isHttpUrl(url)) return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  const options = {
    method: "HEAD",
    redirect: "follow",
    signal: controller.signal,
    headers: { "user-agent": "OperonRadarValidator/1.0" },
  };

  try {
    let response = await fetch(url, options);
    if ([405, 501].includes(response.status)) {
      response = await fetch(url, { ...options, method: "GET" });
    }
    if (!response.ok) addError(file, `${label} no respondió correctamente (${response.status}): ${url}`);
  } catch (error) {
    addError(file, `${label} no pudo verificarse: ${url} (${error.name})`);
  } finally {
    clearTimeout(timeout);
  }
}

function resolveRequestedFiles(allFiles) {
  if (requestedFiles.length === 0) return allFiles;

  const byAbsolutePath = new Map(allFiles.map((file) => [path.resolve(file), file]));
  const selected = [];
  for (const requestedFile of requestedFiles) {
    const resolved = path.resolve(rootDirectory, requestedFile);
    if (!byAbsolutePath.has(resolved)) {
      addError(path.join(rootDirectory, requestedFile), "no es un artículo de content/radar");
      continue;
    }
    selected.push(byAbsolutePath.get(resolved));
  }
  return [...new Set(selected)];
}

function validateDuplicates(articles, targets) {
  const targetFiles = new Set(targets.map((article) => article.file));
  for (let leftIndex = 0; leftIndex < articles.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < articles.length; rightIndex += 1) {
      const left = articles[leftIndex];
      const right = articles[rightIndex];
      if (!targetFiles.has(left.file) && !targetFiles.has(right.file)) continue;

      if (autoPublish) {
        const target = targetFiles.has(left.file) ? left : right;
        const comparison = target === left ? right : left;
        if (target.status !== "published" || comparison.status !== "published" || !isPublishedInLast90Days(comparison)) continue;
      }

      if (normalize(left.title) === normalize(right.title)) {
        addError(left.file, `título duplicado con ${path.basename(right.file)}`);
        continue;
      }

      const titleSimilarity = similarity(left.title, right.title);
      const sharedTags = (left.tags ?? []).filter((tag) => (right.tags ?? []).includes(tag));
      const sharedSources = (left.sources ?? []).filter((source) => right.sources?.some((item) => item.url === source.url));
      if (titleSimilarity >= 0.72 || (sharedTags.length >= 3 && sharedSources.length >= 1)) {
        addError(left.file, `posible duplicación con ${path.basename(right.file)}; revisar ángulo editorial`);
      }
    }
  }
}

async function main() {
  const files = (await fs.readdir(contentDirectory))
    .filter((file) => file.endsWith(".md") && !documentationFiles.has(file))
    .map((file) => path.join(contentDirectory, file));
  const targetFiles = resolveRequestedFiles(files);

  await validateSourceRegistry();
  const articles = (await Promise.all(files.map(validateArticle))).filter(Boolean);
  const targetArticles = articles.filter((article) => targetFiles.includes(article.file));

  const slugs = new Map();
  for (const article of articles) {
    if (slugs.has(article.slug)) addError(article.file, `slug duplicado con ${path.basename(slugs.get(article.slug).file)}`);
    else slugs.set(article.slug, article);
  }
  validateDuplicates(articles, targetArticles);

  if (verifyUrls) {
    for (const article of targetArticles) {
      if (article.status !== "published" || initialEditorialSlugs.has(article.slug)) continue;
      for (const [index, source] of article.sources.entries()) {
        await verifyRemoteUrl(article.file, source.url, `sources[${index}].url`);
      }
      if (isHttpUrl(article.seo?.image)) await verifyRemoteUrl(article.file, article.seo.image, "seo.image");
    }
  }

  if (errors.length > 0) {
    console.error("Radar validation failed:\n");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
    return;
  }

  console.log(`Radar validation passed: ${articles.length} article(s), ${targetArticles.length} target(s), strict=${strict}, verifyUrls=${verifyUrls}, autoPublish=${autoPublish}.`);
}

await main();
