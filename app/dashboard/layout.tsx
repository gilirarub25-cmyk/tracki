"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // <-- Esto detecta en qué página estamos
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const neonGlow: React.CSSProperties = {
  boxShadow: "0 0 20px rgba(78,222,163,0.2)",
};

const Icons = {
  dashboard: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" /></svg>,
  receipt: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  stats: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  goals: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  wallet: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  help: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  logout: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  add: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  home: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  person: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
};

// Hemos añadido "href" a cada ítem para saber a dónde debe navegar
const NAV_ITEMS = [
  { label: "Panel",  icon: Icons.dashboard, href: "/dashboard" },
  { label: "Movimientos", icon: Icons.receipt, href: "/dashboard/transacciones" },
  { label: "Estadísticas",  icon: Icons.stats, href: "/dashboard/estadisticas" },
  { label: "Objetivos",       icon: Icons.goals, href: "/dashboard/objetivos" },
  { label: "Cuentas",     icon: Icons.wallet, href: "/dashboard/cuentas" }, // Por si la creas más adelante
];

function Sidebar() {
  const pathname = usePathname(); // Lee la URL actual

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] w-64 p-6 space-y-4 z-40" style={{ background: "#020617", borderRight: "1px solid #1e293b" }}>
      <nav className="flex-1 space-y-2 mt-2">
        {NAV_ITEMS.map((item) => {
          // Comprueba si la ruta actual es igual al link del botón
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.label} 
              href={item.href}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${isActive ? "bg-emerald-500/10 text-[#4edea3] border-r-4 border-[#4edea3]" : "text-slate-500 hover:bg-slate-900 hover:text-slate-200"}`}
            >
              {item.icon}<span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto space-y-4 pt-8 border-t border-slate-800">
        <button className="w-full bg-[#4edea3] text-[#003824] py-3 rounded-lg font-bold flex items-center justify-center space-x-2 hover:bg-[#6ffbbe] transition-colors active:scale-95 duration-200" style={neonGlow}>
          {Icons.add}<span>Nueva Transacción</span>
        </button>
        <div className="space-y-1">
          <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-900 hover:text-slate-200 text-sm font-medium transition-all duration-300">
            {Icons.help}<span>Centro de Ayuda</span>
          </button>
          <Link href="/login" className="flex items-center space-x-3 px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-900 hover:text-slate-200 text-sm font-medium transition-all duration-300">
            {Icons.logout}<span>Cerrar Sesión</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

function BottomNav() {
  const pathname = usePathname();
  
  // Añadidos los enlaces también al menú móvil
  const tabs = [
    { label: "Inicio",     icon: Icons.home, href: "/dashboard" },
    { label: "Actividad", icon: Icons.stats, href: "/dashboard/transacciones" },
    { label: "Ahorros",  icon: Icons.goals, href: "/dashboard/objetivos" },
    { label: "Perfil",  icon: Icons.person, href: "#" }, // Perfil aún no lo tenemos
  ];

  return (
    <nav className="md:hidden flex justify-around items-center h-16 px-4 fixed bottom-0 w-full z-50 rounded-t-2xl" style={{ background: "rgba(2,6,23,0.9)", backdropFilter: "blur(16px)", borderTop: "1px solid #1e293b", boxShadow: "0 -8px 30px rgb(0,0,0,0.5)" }}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        
        return (
          <Link 
            key={tab.label} 
            href={tab.href}
            className={`flex flex-col items-center justify-center w-16 rounded-lg py-1 transition-colors ${isActive ? "text-emerald-400" : "text-slate-500"}`} 
            style={isActive ? { filter: "drop-shadow(0 0 8px rgba(16,185,129,0.4))" } : {}}
          >
            {tab.icon}<span className="text-[10px] uppercase tracking-widest mt-0.5">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0e1511] text-[#dde4dd] antialiased flex flex-col">
      <Navbar />
      <Sidebar />
      <div className="md:ml-64 pt-16 flex-grow flex flex-col">
        {children}
        <Footer />
      </div>
      <BottomNav />
    </div>
  );
}