/**
 * app/layout.tsx
 * ---------------------------------------------------------------------------
 * Root Layout de la aplicación. En el paradigma App Router de Next.js, este
 * componente es el ancestro común de todas las rutas: envuelve el elemento
 * <html> y el <body>, define la fuente tipográfica global y los metadatos
 * SEO por defecto.
 *
 * Al ser un Server Component (no lleva la directiva "use client"), se ejecuta
 * en el servidor durante el build y no envía JavaScript al cliente. Esta
 * decisión optimiza el tamaño del bundle inicial.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/layout
 */

import "./globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";

/**
 * Carga optimizada de la familia tipográfica Manrope desde Google Fonts.
 *
 * El helper `next/font/google` descarga la fuente en build-time, la
 * autohospeda y la inyecta sin causar parpadeos (FOUT). La variable CSS
 * resultante (--font-manrope) se aplica al elemento <html> y se referencia
 * desde `globals.css` y el sistema de utilidades de Tailwind.
 */
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

/**
 * Metadatos por defecto de la aplicación. Next.js los inyecta como etiquetas
 * <title> y <meta name="description"> en todas las rutas, salvo que una
 * página específica los sobreescriba mediante su propia exportación.
 */
export const metadata: Metadata = {
  title: "Tracki — Gestión de Finanzas",
  description: "Controla tus gastos e ingresos de forma sencilla y visual.",
};

/**
 * Componente raíz que envuelve toda la jerarquía de páginas.
 *
 * @param children - Sub-árbol de la aplicación renderizado dentro del body
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={manrope.variable}>
      <body className="antialiased min-h-screen flex flex-col bg-[#0e1511] text-[#dde4dd] font-sans">
        {children}
      </body>
    </html>
  );
}
