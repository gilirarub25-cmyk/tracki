// components/Footer.tsx
"use client";

import Link from "next/link";

export default function Footer() {
  // Footer minimalista, sin logo y sin borde:
  // se mimetiza con el contenido del dashboard.
  return (
    <footer className="w-full py-6 px-6 md:px-8 bg-[#0e1511]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-xs text-[#86948a]">
          © 2026 Tracki. Todos los derechos reservados.
        </p>
        <div className="flex items-center gap-6 text-xs text-[#86948a]">
          <Link href="#" className="hover:text-[#dde4dd] transition-colors">Privacidad</Link>
          <Link href="#" className="hover:text-[#dde4dd] transition-colors">Términos</Link>
          <Link href="#" className="hover:text-[#dde4dd] transition-colors">Soporte</Link>
        </div>
      </div>
    </footer>
  );
}
