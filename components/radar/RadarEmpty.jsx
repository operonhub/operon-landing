import Link from "next/link";

export default function RadarEmpty({ filtered = false }) {
  return (
    <div className="rounded-2xl border border-line bg-cream/50 px-6 py-16 text-center lg:px-12 lg:py-24">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-line font-mono-up text-blue" aria-hidden>
        00
      </div>
      <h2 className="font-display text-[30px] font-semibold tracking-tight">
        {filtered ? "Todavía no hay lecturas en esta categoría." : "El Radar está preparando su primera señal."}
      </h2>
      <p className="mx-auto mt-4 max-w-[52ch] leading-[1.6] text-mute">
        {filtered ? "Podés volver a la vista completa para seguir explorando." : "Las piezas publicadas van a aparecer acá cuando estén revisadas y listas."}
      </p>
      {filtered && <Link href="/radar" className="mt-7 inline-flex min-h-11 items-center font-display font-semibold text-blue hover:text-blue-deep">Ver todo el Radar →</Link>}
    </div>
  );
}
