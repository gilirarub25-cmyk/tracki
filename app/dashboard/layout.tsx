/**
 * app/dashboard/layout.tsx
 * ---------------------------------------------------------------------------
 * Layout privado de la aplicación. En el App Router de Next.js, este archivo
 * se aplica automáticamente a `/dashboard` y a todas sus rutas hijas
 * (`/dashboard/transacciones`, `/dashboard/objetivos`...).
 *
 * Composición:
 *   1. <ModalProvider>          → Estado global de modales y refreshKey
 *   2.   <AccountFilterProvider> → Cuenta seleccionada (depende del anterior)
 *   3.     <DashboardShell>      → Navbar + Sidebar + Footer + BottomNav
 *   4.       <AccountGuard>      → Garantiza que el usuario tenga ≥1 cuenta
 *   5.         {children}        → Página actual
 *
 * Debe ser un Client Component porque consume hooks (usePathname, useModal).
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ModalProvider, useModal } from "@/contexts/ModalContext";
import { AccountFilterProvider } from "@/contexts/AccountFilterContext";
import AccountGuard from "@/components/AccountGuard";

/** Glow neón verde reutilizado en botones primarios. */
const neonGlow: React.CSSProperties = {
  boxShadow: "0 0 20px rgba(78,222,163,0.2)",
};

/**
 * Diccionario de iconos SVG inline. Se definen como JSX directamente para
 * evitar imports adicionales y mantener el bundle ligero. Cada icono es
 * autónomo (no comparte estado) y puede reutilizarse libremente.
 */
const Icons = {
  dashboard: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" /></svg>,
  receipt:   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  stats:     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  goals:     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  accounts:  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  help:      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  add:       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  home:      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
};

/** Definición declarativa de los items de navegación del sidebar. */
const NAV_ITEMS = [
  { label: "Panel",        icon: Icons.dashboard, href: "/dashboard" },
  { label: "Movimientos",  icon: Icons.receipt,   href: "/dashboard/transacciones" },
  { label: "Estadísticas", icon: Icons.stats,     href: "/dashboard/estadisticas" },
  { label: "Objetivos",    icon: Icons.goals,     href: "/dashboard/objetivos" },
  { label: "Cuentas",      icon: Icons.accounts,  href: "/dashboard/cuentas" },
];

/**
 * Barra lateral fija visible en escritorio (≥ md). Muestra la navegación
 * principal y un botón destacado para crear una nueva transacción.
 */
function Sidebar() {
  const pathname = usePathname();
  const { openTransactionModal } = useModal();

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] w-64 p-6 space-y-4 z-40 bg-[#161d19] border-r border-[#3c4a42]/40">
      {/* Lista de enlaces a las rutas del dashboard */}
      <nav className="flex-1 space-y-2 mt-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-[#4edea3]/10 text-[#4edea3] border-r-4 border-[#4edea3]"
                  : "text-[#bbcabf] hover:bg-[#1a211d] hover:text-[#dde4dd]"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sección inferior: CTA principal y enlaces secundarios */}
      <div className="mt-auto space-y-4 pt-8 border-t border-[#3c4a42]/40">
        <button
          onClick={openTransactionModal}
          className="w-full bg-[#4edea3] text-[#003824] py-3 rounded-lg font-bold flex items-center justify-center space-x-2 hover:bg-[#6ffbbe] transition-colors active:scale-95 duration-200 cursor-pointer"
          style={neonGlow}
        >
          {Icons.add}
          <span>Nueva Transacción</span>
        </button>
        <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-[#bbcabf] hover:bg-[#1a211d] hover:text-[#dde4dd] text-sm font-medium transition-all duration-300 cursor-pointer">
          {Icons.help}
          <span>Centro de Ayuda</span>
        </button>
      </div>
    </aside>
  );
}

/**
 * Barra de navegación inferior visible únicamente en móvil (< md).
 * Centra un FAB (Floating Action Button) que abre el modal de transacción.
 */
function BottomNav() {
  const pathname = usePathname();
  const { openTransactionModal } = useModal();

  return (
    <nav
      className="md:hidden flex justify-around items-center h-16 px-4 fixed bottom-0 w-full z-50 rounded-t-2xl border-t border-[#3c4a42]/40"
      style={{
        background: "rgba(22,29,25,0.9)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 -8px 30px rgb(0,0,0,0.3)",
      }}
    >
      <Link
        href="/dashboard"
        className={`flex flex-col items-center justify-center w-14 rounded-lg py-1 transition-colors ${
          pathname === "/dashboard" ? "text-[#4edea3]" : "text-[#bbcabf]"
        }`}
      >
        {Icons.home}
        <span className="text-[10px] uppercase tracking-widest mt-0.5">Inicio</span>
      </Link>
      <Link
        href="/dashboard/transacciones"
        className={`flex flex-col items-center justify-center w-14 rounded-lg py-1 transition-colors ${
          pathname === "/dashboard/transacciones" ? "text-[#4edea3]" : "text-[#bbcabf]"
        }`}
      >
        {Icons.receipt}
        <span className="text-[10px] uppercase tracking-widest mt-0.5">Mov.</span>
      </Link>

      {/* Floating Action Button: crear nueva transacción */}
      <button
        onClick={openTransactionModal}
        className="flex items-center justify-center -mt-6 w-14 h-14 rounded-full bg-[#4edea3] text-[#003824] shadow-lg cursor-pointer hover:bg-[#6ffbbe] transition-colors"
        style={{ boxShadow: "0 8px 20px rgba(78,222,163,0.3)" }}
        aria-label="Nueva transacción"
      >
        {Icons.add}
      </button>

      <Link
        href="/dashboard/objetivos"
        className={`flex flex-col items-center justify-center w-14 rounded-lg py-1 transition-colors ${
          pathname === "/dashboard/objetivos" ? "text-[#4edea3]" : "text-[#bbcabf]"
        }`}
      >
        {Icons.goals}
        <span className="text-[10px] uppercase tracking-widest mt-0.5">Obj.</span>
      </Link>
      <Link
        href="/dashboard/cuentas"
        className={`flex flex-col items-center justify-center w-14 rounded-lg py-1 transition-colors ${
          pathname === "/dashboard/cuentas" ? "text-[#4edea3]" : "text-[#bbcabf]"
        }`}
      >
        {Icons.accounts}
        <span className="text-[10px] uppercase tracking-widest mt-0.5">Cuent.</span>
      </Link>
    </nav>
  );
}

/**
 * Esqueleto del dashboard: ensambla Navbar superior, Sidebar lateral,
 * contenido principal con AccountGuard y Footer. En móvil sustituye el
 * Sidebar por la BottomNav inferior.
 */
function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[#dde4dd] antialiased flex flex-col flex-grow">
      <Navbar />
      <Sidebar />
      <div className="md:ml-64 pt-16 flex-grow flex flex-col pb-16 md:pb-0">
        <div className="flex-grow flex flex-col">
          <AccountGuard>{children}</AccountGuard>
        </div>
        <Footer />
      </div>
      <BottomNav />
    </div>
  );
}

/**
 * Layout exportado por defecto. Encapsula la jerarquía de Providers que
 * la zona privada necesita. El orden es relevante: `AccountFilterProvider`
 * consume `useModal()` para reaccionar al `refreshKey`, por lo que debe
 * ser un descendiente de `ModalProvider`.
 *
 * @param children - Página actual del dashboard
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      <AccountFilterProvider>
        <DashboardShell>{children}</DashboardShell>
      </AccountFilterProvider>
    </ModalProvider>
  );
}
