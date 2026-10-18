# Intro de Operon Reservas

Versión elegida: **Despegue v4**. Globo completo que asciende, entrada de la yema con pulso y dos ondas, cierre Operon + RESERVAS. Duración de 3 segundos.

## Implementación

- `components/reservas/IntroReservas.jsx` administra la entrada, sesión, sonido, foco y cierre.
- `IntroReservas.module.css` reproduce la secuencia mediante transformaciones y opacidad, con SVG de geometría fija. No agrega dependencias ni descarga el MP4 de la demo.
- `public/brand/reservas-intro/` contiene dos fuentes locales y la firma sonora aprobada, comprimida a MP3. Aproximadamente 99 KB en total, más el código del componente.
- Se usa solo en `/reservas`; el rewrite del subdominio de Reservas también sirve esta ruta.

## Comportamiento

Se muestra en pantallas de al menos 1024 px, una vez por pestaña tras completarla u omitirla. Se omite con movimiento reducido y al entrar por un ancla. La adaptación de la animación a móvil queda pendiente.

Durante la entrada, el contenido real permanece montado e inerte. Al terminar, se restituyen el scroll y el foco. Se puede omitir con el botón o Escape; los botones mantienen el foco dentro de la entrada. Un temporizador independiente cierra el overlay si la animación no emite su evento final.

La página y sus metadatos se renderizan en el servidor. Sin JavaScript no aparece el overlay. La indisponibilidad de sessionStorage no impide ver ni cerrar la entrada.

El audio intenta comenzar con la animación; si el navegador lo bloquea, la entrada continúa sin sonido. El botón de sonido permite activarlo con un gesto y sincroniza la posición del audio con el tiempo transcurrido. No se garantiza audio automático en una visita directa.

## Validación

Build de producción correcto. Comprobaciones en navegador sobre el build: entrada directa, navegación desde la home, final automático, una reproducción por pestaña, botón Omitir, Escape, restitución de scroll e inert, página sin JavaScript, móvil, movimiento reducido y cierre de seguridad con almacenamiento bloqueado y animación cancelada. Sin errores JavaScript.

El build y la prueba completa se ejecutaron en un checkout aislado: el checkout principal contiene un archivo editorial local sin seguimiento (`content/radar/EDITORIAL_PLAN.md`) que el lector de Radar intenta interpretar como artículo. Ese archivo se preservó y no forma parte de este cambio.
