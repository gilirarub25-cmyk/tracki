/**
 * middleware.ts
 * ---------------------------------------------------------------------------
 * Middleware de Next.js que intercepta peticiones en el Edge Runtime antes
 * de que se renderice la página solicitada. Su objetivo es proporcionar una
 * primera capa de protección de rutas: si un visitante intenta acceder a
 * cualquier ruta bajo /dashboard sin tener una sesión activa, se le redirige
 * inmediatamente a la pantalla de login.
 *
 * IMPORTANTE: esta protección se basa en una cookie no httpOnly establecida
 * por el cliente tras un login exitoso (`tracki_session=true`). Por tanto
 * NO constituye una capa de seguridad real, sino una mejora de la experiencia
 * de usuario que evita que se sirva el HTML del dashboard a alguien sin
 * sesión. La seguridad efectiva se garantiza mediante las políticas de
 * Row Level Security configuradas en Supabase, que actúan a nivel de
 * motor de base de datos.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware
 */

import { NextResponse, type NextRequest } from "next/server";

/**
 * Función middleware ejecutada en cada petición que coincida con el matcher.
 *
 * @param request - Objeto NextRequest con información de la petición entrante
 * @returns       NextResponse: redirección a /login o continuación normal
 */
export function middleware(request: NextRequest) {
  // Lectura de la cookie de sesión establecida tras el login exitoso
  const session = request.cookies.get("tracki_session");
  const isAuthenticated = session?.value === "true";

  // Si el visitante no está autenticado, se le redirige a /login
  // preservando la URL de origen como parámetro opcional para un futuro
  // sistema de "redirect-after-login".
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Visitante autenticado: se permite continuar con la petición
  return NextResponse.next();
}

/**
 * Configuración del middleware: define las rutas en las que se ejecutará.
 * El patrón "/dashboard/:path*" cubre /dashboard y todas sus subrutas.
 */
export const config = {
  matcher: ["/dashboard/:path*"],
};
