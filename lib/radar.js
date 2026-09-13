import "server-only";

import fs from "node:fs";
import path from "node:path";

export const RADAR_CATEGORIES = [
  "IA aplicada",
  "Automatización",
  "Ventas y CRM",
  "E-commerce",
  "Argentina y LatAm",
  "Datos y regulación",
];

const RADAR_DIRECTORY = path.join(process.cwd(), "content", "radar");
const VALID_STATUSES = new Set(["draft", "review", "published"]);

/**
 * Contrato de contenido de Radar. La UI consume siempre este adaptador y no
 * conoce el formato físico de los archivos.
 *
 * @typedef {Object} RadarArticle
 * @property {string} slug
 * @property {"draft"|"review"|"published"} status
 * @property {string} title
 * @property {string} excerpt
 * @property {typeof RADAR_CATEGORIES[number]} category
 * @property {string[]} tags
 * @property {string=} publishedAt
 * @property {string=} updatedAt
 * @property {{name: string, role?: string}} author
 * @property {number} readingMinutes
 * @property {boolean=} featured
 * @property {Array<{title: string, url: string, publisher?: string}>} sources
 * @property {{title?: string, description?: string, image?: string}} seo
 * @property {string} body
 */

function splitFrontmatter(source, fileName) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(`[Radar] ${fileName} no tiene frontmatter delimitado por ---.`);
  }

  try {
    return { data: JSON.parse(match[1]), body: match[2].trim() };
  } catch (error) {
    throw new Error(`[Radar] Frontmatter JSON inválido en ${fileName}: ${error.message}`);
  }
}

function isIsoDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value) && !Number.isNaN(Date.parse(value));
}

function validateArticle(article, fileName) {
  const requiredStrings = ["slug", "status", "title", "excerpt", "category"];
  requiredStrings.forEach((key) => {
    if (typeof article[key] !== "string" || !article[key].trim()) {
      throw new Error(`[Radar] ${fileName}: falta ${key}.`);
    }
  });

  if (!VALID_STATUSES.has(article.status)) {
    throw new Error(`[Radar] ${fileName}: status no válido.`);
  }
  if (!RADAR_CATEGORIES.includes(article.category)) {
    throw new Error(`[Radar] ${fileName}: categoría no válida.`);
  }
  if (!Array.isArray(article.tags) || article.tags.some((tag) => typeof tag !== "string")) {
    throw new Error(`[Radar] ${fileName}: tags debe ser un array de textos.`);
  }
  if (!article.author || typeof article.author.name !== "string" || !article.author.name.trim()) {
    throw new Error(`[Radar] ${fileName}: author.name es obligatorio.`);
  }
  if (!Number.isInteger(article.readingMinutes) || article.readingMinutes < 1) {
    throw new Error(`[Radar] ${fileName}: readingMinutes debe ser un entero positivo.`);
  }
  if (!Array.isArray(article.sources)) {
    throw new Error(`[Radar] ${fileName}: sources debe ser un array.`);
  }
  article.sources.forEach((source) => {
    if (!source.title || !source.url || !/^https?:\/\//.test(source.url)) {
      throw new Error(`[Radar] ${fileName}: cada fuente necesita title y URL http(s).`);
    }
  });
  if (!article.seo || typeof article.seo !== "object" || Array.isArray(article.seo)) {
    throw new Error(`[Radar] ${fileName}: seo debe ser un objeto.`);
  }
  if (article.status === "published" && !isIsoDate(article.publishedAt)) {
    throw new Error(`[Radar] ${fileName}: un artículo publicado necesita publishedAt ISO 8601.`);
  }
  if (article.updatedAt && !isIsoDate(article.updatedAt)) {
    throw new Error(`[Radar] ${fileName}: updatedAt debe usar ISO 8601.`);
  }
  if (!article.body) {
    throw new Error(`[Radar] ${fileName}: el cuerpo no puede estar vacío.`);
  }

  const fileSlug = fileName.replace(/\.md$/, "");
  if (article.slug !== fileSlug) {
    throw new Error(`[Radar] ${fileName}: el slug debe coincidir con el nombre del archivo.`);
  }

  return article;
}

function readArticleFile(fileName) {
  const source = fs.readFileSync(path.join(RADAR_DIRECTORY, fileName), "utf8");
  const { data, body } = splitFrontmatter(source, fileName);
  return validateArticle({ ...data, body }, fileName);
}

/** @returns {RadarArticle[]} */
export function getAllArticles() {
  if (!fs.existsSync(RADAR_DIRECTORY)) return [];

  return fs
    .readdirSync(RADAR_DIRECTORY)
    .filter((fileName) => fileName.endsWith(".md") && fileName !== "README.md")
    .map(readArticleFile);
}

/** @returns {RadarArticle[]} */
export function getPublishedArticles() {
  return getAllArticles()
    .filter((article) => article.status === "published")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** @returns {RadarArticle|undefined} */
export function getPublishedArticleBySlug(slug) {
  return getPublishedArticles().find((article) => article.slug === slug);
}

/** @returns {RadarArticle[]} */
export function getRelatedArticles(article, limit = 3) {
  const others = getPublishedArticles().filter((candidate) => candidate.slug !== article.slug);

  return others
    .map((candidate) => ({
      candidate,
      score:
        (candidate.category === article.category ? 3 : 0) +
        candidate.tags.filter((tag) => article.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score || b.candidate.publishedAt.localeCompare(a.candidate.publishedAt))
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export function formatRadarDate(value) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}
