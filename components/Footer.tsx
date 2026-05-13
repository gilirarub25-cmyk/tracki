"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#0e1511] py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
          <svg className="w-5 h-5 text-[#4edea3]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 3h2v18H3V3zm6 8h2v10H9V11zm6-5h2v15h-2V6zm6 4h2v11h-2V10z" />
          </svg>
          <span className="text-xl font-bold text-[#dde4dd]">Tracki</span>
        </Link>

        {/* Copyright */}
        <p className="text-sm text-[#86948a]">
          © 2024 Tracki. Todos los derechos reservados.
        </p>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm text-[#86948a]">
          <Link href="#" className="hover:text-[#dde4dd] transition-colors">Privacidad</Link>
          <Link href="#" className="hover:text-[#dde4dd] transition-colors">Términos</Link>
          <Link href="#" className="hover:text-[#dde4dd] transition-colors">Soporte</Link>
        </div>
      </div>
    </footer>
  );
}
