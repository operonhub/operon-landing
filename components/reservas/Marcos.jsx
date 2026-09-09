"use client";
import Image from "next/image";

/**
 * Marco de navegador para las capturas del panel.
 *
 * La barra superior encuadra la captura como "una app que está corriendo" en
 * vez de "una imagen de una app". Sin URL: cualquiera que pusiéramos sería
 * inventada y el visitante la lee como tal.
 */
export function MarcoNavegador({
  src,
  alt,
  priority = false,
  ancho = 2200,
  alto = 1375,
  className = "",
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-ink/10 bg-cream shadow-[0_24px_80px_-24px_rgba(20,19,15,0.28)] ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-ink/10 bg-cream px-3.5 py-2.5" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
      </div>
      <Image
        src={src}
        alt={alt}
        width={ancho}
        height={alto}
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 60vw"
        className="block h-auto w-full"
      />
    </div>
  );
}

/** Marco de teléfono. Mismo criterio que el de navegador, para la vista móvil. */
export function MarcoTelefono({ src, alt, className = "" }) {
  return (
    <div
      className={`relative rounded-[2.2rem] border-[7px] border-ink bg-ink p-0 shadow-[0_30px_90px_-30px_rgba(20,19,15,0.5)] ${className}`}
    >
      <div className="absolute left-1/2 top-2 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-paper/25" aria-hidden />
      <div className="overflow-hidden rounded-[1.7rem]">
        <Image
          src={src}
          alt={alt}
          width={900}
          height={1948}
          sizes="(max-width: 768px) 60vw, 300px"
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}
