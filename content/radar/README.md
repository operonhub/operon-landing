# Radar Operon — contrato de contenido

Cada pieza vive en un archivo `.md` cuyo nombre coincide con su `slug`. El
frontmatter usa JSON entre delimitadores `---`; JSON es una sintaxis válida y
determinista para que una futura automatización pueda crear o actualizar
archivos sin depender de un parser YAML adicional.

La interfaz sólo consume `lib/radar.js`. Si más adelante se adopta un CMS o un
canal autenticado, ese adaptador es el punto de reemplazo: las páginas y cards
no deben leer archivos ni conocer el proveedor de contenido.

## Contrato mínimo

```ts
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
  sources: Array<{ title: string; url: string; publisher?: string }>
  seo: { title?: string; description?: string; image?: string }
  body: string
}
```

## Reglas editoriales y de publicación

- El archivo debe llamarse exactamente `<slug>.md`.
- Sólo `published` aparece en la home, `/radar`, sitemap y rutas públicas.
- Un artículo `published` requiere `publishedAt` ISO 8601.
- Usar `updatedAt` sólo cuando hubo un cambio editorial real.
- `featured: true` prioriza una pieza en la portada; si no hay ninguna, se usa
  la publicación más reciente.
- `sources` puede quedar vacío en piezas editoriales propias. Nunca agregar una
  fuente que no haya sido consultada realmente.
- `seo.image` es opcional y sólo debe apuntar a un recurso real.
- No existe endpoint público de escritura. La automatización futura deberá
  trabajar vía pull request/repositorio, CMS o un canal autenticado.

El cuerpo acepta Markdown deliberadamente acotado: `##`/`###`, párrafos,
listas, citas, links externos, negritas y código inline. Para el bloque propio
usar:

```md
:::operon
Texto de la lectura editorial.
:::
```

Antes de pasar una pieza a `published`, revisar título, extracto, afirmaciones,
fuentes, fecha, links y metadata.
