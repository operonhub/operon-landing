# Radar Operon — contrato de contenido

Radar usa política `auto-publish`: una automatización publica directamente desde
`main` sólo después de superar todos los controles del repositorio. El deploy no
se ejecuta manualmente; el push a `main` usa la integración existente.

Cada pieza vive en `content/radar/<slug>.md`. El frontmatter usa JSON entre
delimitadores `---`: es determinista para una automatización y no requiere un
parser YAML adicional.

La interfaz sólo consume `lib/radar.js`. Si más adelante se adopta un CMS o un
canal autenticado, ese adaptador es el punto de reemplazo: las páginas y cards
no deben leer archivos ni conocer el proveedor de contenido.

La política operativa completa está en
[EDITORIAL_AUTOMATION.md](./EDITORIAL_AUTOMATION.md). La lista inicial y
editable de fuentes está en [sources.json](./sources.json).

## Contrato mínimo

```ts
type RadarSource = {
  title: string
  url: string
  publisher: string
  kind: "primary" | "institutional" | "secondary"
}

type RadarArticle = {
  slug: string
  status: "draft" | "review" | "published"
  title: string
  excerpt: string
  category:
    | "IA aplicada"
    | "Automatización"
    | "Ventas y CRM"
    | "E-commerce"
    | "Argentina y LatAm"
    | "Datos y regulación"
  tags: string[]
  publishedAt?: string
  updatedAt?: string
  author: { name: string; role?: string }
  readingMinutes: number
  featured?: boolean
  sources: RadarSource[]
  claimSources?: Array<{ claim: string; sourceUrl: string }>
  seo: {
    title?: string
    description?: string
    image?: string
    imageFallback?: "operon-operational-plate-v1"
  }
  body: string
}
```

## Reglas editoriales y de publicación

- El archivo se llama exactamente `<slug>.md`; el slug es único.
- Toda pieza nueva autopublicada usa `status: "published"`, `publishedAt` ISO
  8601, título, extracto, categoría, tags, autor, minutos de lectura y metadata
  SEO completa (`seo.title` y `seo.description`).
- Toda pieza nueva publicada tiene dos o más fuentes reales, URLs verificables y
  por lo menos una fuente primaria cuando exista. No inventar fuentes, citas,
  datos, regulaciones, funcionalidades, métricas, testimonios ni casos.
- `claimSources` vincula cada claim externamente verificable con una URL presente
  en `sources`. Para un evergreen sin claims externos, declarar `claimSources: []`.
- La portada es `/radar/<slug>.webp` o `/radar/<slug>.png` bajo `public/radar/`.
  Si no hay generación de imagen disponible, declarar el fallback interno
  `seo.imageFallback: "operon-operational-plate-v1"`. Nunca usar imágenes externas
  no verificadas ni guardar secretos en el repositorio.
- Las tres piezas editoriales iniciales son una excepción histórica cerrada a
  fuentes, metadata SEO completa y portada. No usar esa excepción para piezas nuevas.
- Sólo `published` aparece en la home, `/radar`, sitemap y rutas públicas.
- Usar `updatedAt` sólo cuando hubo un cambio editorial real.
- `featured: true` prioriza una pieza en la portada; si no hay ninguna, se usa
  la publicación más reciente.
- No existe endpoint público de escritura. No cambiar componentes, rutas,
  estilos, infraestructura, secretos, DNS, configuración de Vercel ni
  dependencias desde una publicación editorial.

El cuerpo acepta Markdown deliberadamente acotado: `##`/`###`, párrafos,
listas, citas, links externos, negritas y código inline. Para el bloque propio
usar:

```md
:::operon
Texto de la lectura editorial.
:::
```

## Flujo de autopublicación

1. Ejecutar `git fetch origin main` y `git pull --ff-only origin main`. Abortar
   si no se está sobre `main`, hay cambios locales inesperados o el pull no puede
   ser fast-forward.
2. Elegir un tema actual con fuentes sólidas o un evergreen de respaldo. Si no
   hay una pieza que pase los controles, no publicar y reportar el motivo.
3. Crear sólo el artículo y, si corresponde, `public/radar/<slug>.webp` o `.png`.
   Usar el fallback interno si no hay una portada local real.
4. Ejecutar, reemplazando `<slug>` por el archivo nuevo:

   ```bash
   npm run validate:radar -- --files content/radar/<slug>.md
   npm run validate:radar:pr -- --files content/radar/<slug>.md
   npm run validate:radar:publish -- --files content/radar/<slug>.md
   npm run build
   git diff --check
   ```

5. Crear el commit atómico `content(radar): publicar <slug>` y pushear sólo si
   todo pasó. Nunca hacer force-push, Pull Request obligatorio, merge de otra
   rama ni deploy manual.
6. Tras el push, esperar la propagación del deploy conectado y comprobar que
   `https://operonhub.com/radar/<slug>` responde HTTP 200, contiene el título y
   declara el canonical correcto. Si falla, no hacer cambios destructivos:
   reportar commit, URL y error.

`npm run validate:radar` mantiene el control general. `validate:radar:pr` queda
como compatibilidad para validación remota de URLs. Para autopublicar, el comando
obligatorio es `npm run validate:radar:publish`.
