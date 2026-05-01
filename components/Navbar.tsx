"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Función para determinar las clases CSS si el enlace está activo o no
  const getLinkClass = (href: string) => {
    const isActive = pathname === href;
    return `text-sm font-medium transition-colors cursor-pointer ${isActive ? "text-[#4edea3] font-bold" : "text-slate-400 hover:text-slate-200"}`;
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 z-50 flex items-center justify-between px-6" style={{ background: "#020617", borderBottom: "1px solid #1e293b" }}>
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-black tracking-tighter text-[#4edea3]">
          Tracki
        </Link>
        
        {/* Aquí aplicamos la comprobación dinámica a cada Link */}
        <div className="hidden md:flex items-center space-x-6 ml-4">
          <Link href="/dashboard" className={getLinkClass("/dashboard")}>Panel</Link>
          <Link href="/dashboard/transacciones" className={getLinkClass("/dashboard/transacciones")}>Movimientos</Link>
          <Link href="/dashboard/estadisticas" className={getLinkClass("/dashboard/estadisticas")}>Estadísticas</Link>
          <Link href="/dashboard/objetivos" className={getLinkClass("/dashboard/objetivos")}>Objetivos</Link>
        </div>
      </div>

      <div className="flex items-center space-x-4 md:space-x-5">
        <button className="text-slate-400 hover:text-slate-200 transition-colors hidden md:block">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>
        <button className="text-slate-400 hover:text-slate-200 transition-colors relative">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          <span className="absolute top-0 right-0 w-2 h-2 bg-[#4edea3] rounded-full border border-[#020617]"></span>
        </button>
        <div className="flex items-center gap-2 cursor-pointer md:border-l border-slate-700 md:pl-5">
          <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs text-slate-300 font-bold overflow-hidden">
            R
          </div>
          <span className="hidden md:block text-sm font-medium text-slate-200">Rubén</span>
        </div>
      </div>
    </nav>
  );
}