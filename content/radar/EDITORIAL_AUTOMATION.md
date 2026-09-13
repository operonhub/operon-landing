# Radar Operon — política `auto-publish`

Radar Operon publica contenido editorial controlado desde `main`. La automatización puede investigar, escribir, validar, generar o seleccionar una portada local, hacer commit y pushear una pieza dos veces por semana. El push a `main` es el único disparador de publicación: el deploy lo resuelve exclusivamente la integración ya conectada al repositorio.

No hay Pull Request ni aprobación humana obligatoria por artículo. Esto no habilita cambios fuera de `content/radar/`, sus assets versionados ni los controles editoriales de este documento.

## Cadencia y decisión de publicación

- Ejecutar los martes y viernes.
- Elegir un tema que responda qué cambió, qué proceso afecta, qué conviene revisar y qué límite importa para empresas de Argentina y Latinoamérica.
- Priorizar un hecho reciente y sólidamente documentado. Si no lo hay, elegir un evergreen de respaldo que resuelva una decisión operativa concreta.
- Si no existe ni un tema actual ni un evergreen que pase todas las validaciones, no publicar. Reportar el motivo, las fuentes evaluadas y la próxima acción sugerida; no forzar una pieza de relleno.
- No reescribir titulares, copetes o resúmenes de medios. Cada artículo debe sostener una tesis propia, aplicable y honesta.

## Categorías permitidas

- `IA aplicada`
- `Automatización`
- `Ventas y CRM`
- `E-commerce`
- `Argentina y LatAm`
- `Datos y regulación`

No inventar categorías nuevas. Si un tema no encaja, se descarta hasta que el contrato sea actualizado mediante una tarea explícita.

## Estructura y contrato obligatorios

Cada artículo nuevo es `content/radar/<slug>.md` con frontmatter JSON delimitado por `---` y `status: "published"`.

Debe contener:

1. `slug`, título, extracto, categoría, tags, `publishedAt`, autor, minutos de lectura y metadata SEO completa.
2. `seo.title`, `seo.description` y, además, una portada local real en `seo.image` o el fallback `seo.imageFallback: "operon-operational-plate-v1"`.
3. Dos o más fuentes reales, con URL verificable, `publisher` y `kind`. Una fuente `kind: "primary"` es obligatoria cuando existe una fuente primaria del hecho; una institución u organismo que publica su propia norma también cuenta como primaria.
4. `claimSources`: un array con cada claim externamente verificable, su URL de fuente incluida en `sources` y una cita breve que exista en el cuerpo. Si no hay claims externos, declarar `claimSources: []` y mantener el texto como análisis evergreen sin atribuciones fácticas.
5. Un copete distinto del título, introducción acotada, al menos dos secciones, un marco de decisión o ejemplo cuando aporte claridad, el bloque `:::operon` y una conclusión sin promesas.

No inventar datos, citas, fuentes, funcionalidades, regulaciones, estadísticas, testimonios, clientes, casos ni resultados. Si un dato verificable no tiene fuente primaria o institucional suficiente, se elimina o se reformula como una pregunta/criterio sin presentarlo como hecho.

## Fuentes y deduplicación

`sources.json` es un punto de partida curado y editable, no una lista exhaustiva. Priorizar la fuente primaria más específica disponible: documentación o blog oficial del proveedor, organismo regulador, entidad pública, norma o informe institucional. Complementar con una segunda fuente independiente cuando haga falta contexto.

No usar agregadores, resultados de buscadores, resúmenes de IA ni publicaciones de medios como sustituto de la fuente original. El validador comprueba que las URLs respondan y que cada claim registrado apunte a una fuente declarada.

Antes de publicar, comparar título, slug, tags, URLs, tesis y ángulo con piezas `published` de los últimos 90 días. Si se solapa claramente, descartar la pieza o cambiar a un ángulo materialmente distinto. No publicar dos veces el mismo hecho con una redacción diferente.

## Competidores directos

No publicar contenido centrado en agencias, estudios o consultoras que compitan directamente con Operon. No usar sus ofertas, casos, precios o anuncios como tema principal. Las fuentes técnicas, institucionales o regulatorias sólo se usan por su aporte operativo, no para comparar competidores.

## Título y CTA

El título debe nombrar una decisión, tensión o consecuencia operativa específica, con palabras propias. Evitar promesas, superlativos, alarmismo y clickbait.

El único CTA de cierre permitido es `/contanos-tu-proceso` con el texto `Contanos tu proceso`. No añadir formularios, newsletters, descuentos, reservas ni mensajes que prometan resultados.

## Assets y estilo: `operon-operational-plate-v1`

Las portadas individuales se guardan versionadas en `public/radar/` con el mismo slug: por ejemplo, `public/radar/<slug>.webp`, referenciado como `/radar/<slug>.webp` en `seo.image`. Usar WebP o PNG optimizado, con un nombre estable. Nunca guardar claves de OpenAI ni otros secretos en el repositorio.

Si el entorno tiene generación GPT de imágenes habilitada, generar una portada individual sobria: fondo crema o tinta, azul Operon, acento sol puntual, señal abstracta y ningún texto pequeño ilegible. Si no está habilitada, usar `seo.imageFallback: "operon-operational-plate-v1"`, que es la señal interna ya renderizada por Radar, y registrar en el reporte que la portada única quedó pendiente. Nunca enlazar imágenes externas no verificadas.

No introducir CSS, componentes, rutas ni cambios de diseño desde una publicación editorial. Mantener fondo crema, tinta/negro, bordes finos, azul Operon, display para títulos, mono para señales y metadatos, superficies sobrias sin gradientes o sombras pesadas, y texto escaneable en mobile.

## Protocolo de Git y publicación

1. Ejecutar `git fetch origin main` y `git pull --ff-only origin main` antes de investigar. Abortar si la rama no es `main`, el árbol contiene cambios locales inesperados o no se puede hacer fast-forward.
2. Crear sólo el artículo, su imagen local si existe y la metadata asociada. No modificar infraestructura, secretos, DNS, configuración de Vercel, dependencias ni rutas salvo una tarea futura explícita.
3. Ejecutar `npm run validate:radar`, `npm run validate:radar:pr`, `npm run validate:radar:publish`, `npm run build` y `git diff --check`.
4. Crear un commit atómico con formato exacto: `content(radar): publicar <slug>`.
5. Pushear a `origin main` sólo si todos los controles pasaron. Nunca hacer force-push, deploy manual ni merge de otra rama.

## Verificación post-publicación

Después del push, esperar un tiempo razonable para que el deploy conectado al repositorio propague. Verificar `https://operonhub.com/radar/<slug>` y confirmar:

- HTTP `200`;
- HTML que contiene el título esperado;
- canonical `https://operonhub.com/radar/<slug>`.

Si falla alguna comprobación, no revertir, borrar ni hacer cambios destructivos automáticamente. Reportar el hash del commit, la URL, el error observado y el estado de las comprobaciones para diagnóstico.
