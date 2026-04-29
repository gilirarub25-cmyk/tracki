"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer 
      className="w-full py-6 px-8 flex flex-col md:flex-row items-center justify-between border-t border-slate-800 mt-auto" 
      style={{ background: "#020617" }}
    >
      <div className="text-slate-500 text-xs font-medium">
        © 2024 Tracki. Todos los derechos reservados.
      </div>
      
      <div className="flex space-x-6 text-slate-500 text-xs font-medium mt-4 md:mt-0">
        <Link href="#" className="hover:text-slate-300 transition-colors">Privacidad</Link>
        <Link href="#" className="hover:text-slate-300 transition-colors">Términos</Link>
        <Link href="#" className="hover:text-slate-300 transition-colors">Soporte</Link>
      </div>
    </footer>
  );
}