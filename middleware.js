import { NextResponse } from "next/server";

/**
 * Subdominio de producto: reservas.operonhub.com
 *
 * La landing de Operon Reservas vive en `/reservas` dentro de este mismo
 * proyecto — así comparte la identidad, el modal de contacto y un solo deploy.
 * Acá se reescribe la raíz del subdominio a esa ruta.
 *
 * Es `rewrite` y no `redirect` a propósito: el visitante ve la URL corta
 * (reservas.operonhub.com) mientras Next sirve el contenido de /reservas. Un
 * redirect lo mandaría a operonhub.com/reservas y se perdería el subdominio.
 *
 * Para que funcione en producción hay que agregar `reservas.operonhub.com`
 * como dominio del proyecto en Vercel (Settings → Domains) y crear el CNAME
 * correspondiente en Hostinger.
 */
const SUBDOMINIO = "reservas.";

export function middleware(request) {
  const host = (request.headers.get("host") || "").toLowerCase();
  if (!host.startsWith(SUBDOMINIO)) return NextResponse.next();

  // Sólo la raíz se reescribe. El resto de las rutas (por ejemplo /privacidad)
  // se siguen sirviendo tal cual, así el subdominio no queda con agujeros.
  if (request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/reservas";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Se excluyen los estáticos y las rutas internas: no hay nada que reescribir
  // ahí y evita gastar invocaciones de middleware en cada imagen.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|robots.txt|sitemap.xml).*)",
  ],
};
