// app/page.tsx
"use client";

import Link from "next/link";
import Footer from "@/components/Footer";

// Logo SVG reutilizable
const Logo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={`${className} text-[#4edea3]`} fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 3h2v18H3V3zm6 8h2v10H9V11zm6-5h2v15h-2V6zm6 4h2v11h-2V10z" />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Mockup del dashboard recreado en CSS (sin imagen externa)
// ─────────────────────────────────────────────────────────────
function DashboardMockup() {
  return (
    <div className="bg-[#0e1511] rounded-xl w-full border border-white/5 overflow-hidden">
      {/* Top bar simulando navbar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#3c4a42]/40">
        <Logo className="w-4 h-4" />
        <span className="text-xs font-bold text-[#dde4dd]">Tracki</span>
        <div className="hidden sm:flex gap-4 ml-4 text-[11px] font-medium">
          <span className="text-[#4edea3]">Panel</span>
          <span className="text-[#bbcabf]">Movimientos</span>
          <span className="text-[#bbcabf]">Estadísticas</span>
          <span className="text-[#bbcabf]">Objetivos</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#1a211d]" />
          <div className="w-5 h-5 rounded-full bg-[#1a211d] border border-[#3c4a42]" />
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/4 p-3 space-y-1 border-r border-[#3c4a42]/40 hidden sm:block">
          <div className="text-[10px] font-bold py-1.5 px-2 rounded bg-[#4edea3]/10 text-[#4edea3]">Panel</div>
          <div className="text-[10px] py-1.5 px-2 text-[#bbcabf]">Movimientos</div>
          <div className="text-[10px] py-1.5 px-2 text-[#bbcabf]">Estadísticas</div>
          <div className="text-[10px] py-1.5 px-2 text-[#bbcabf]">Objetivos</div>
          <div className="pt-4 mt-4 border-t border-[#3c4a42]/40">
            <div className="text-[10px] font-bold py-1.5 px-2 rounded bg-[#4edea3] text-[#003824] text-center">
              + Nueva
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 p-4 space-y-3">
          <div>
            <p className="text-sm font-semibold text-[#dde4dd]">Hola, Test</p>
            <p className="text-[10px] text-[#bbcabf]">Aquí tienes tu resumen financiero</p>
          </div>

          {/* 3 cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#161d19] border border-[#3c4a42]/40 rounded-lg p-2.5">
              <p className="text-[8px] uppercase font-bold text-[#bbcabf] mb-1 tracking-wider">Ingresos</p>
              <p className="text-xs font-bold text-[#dde4dd]">0,00 €</p>
            </div>
            <div className="bg-[#161d19] border border-[#3c4a42]/40 rounded-lg p-2.5">
              <p className="text-[8px] uppercase font-bold text-[#bbcabf] mb-1 tracking-wider">Gastos</p>
              <p className="text-xs font-bold text-[#dde4dd]">0,00 €</p>
            </div>
            <div className="bg-[#161d19] border border-[#3c4a42]/40 rounded-lg p-2.5">
              <p className="text-[8px] uppercase font-bold text-[#bbcabf] mb-1 tracking-wider">Balance</p>
              <p className="text-xs font-bold text-[#dde4dd]">0,00 €</p>
            </div>
          </div>

          {/* Gráfico + últimos movimientos */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 bg-[#161d19] border border-[#3c4a42]/40 rounded-lg p-3 h-24 flex flex-col items-center justify-center">
              <svg className="w-6 h-6 text-[#3c4a42] mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-[8px] text-[#bbcabf]">Aún no hay datos</p>
            </div>
            <div className="bg-[#161d19] border border-[#3c4a42]/40 rounded-lg p-3 h-24 flex flex-col items-center justify-center">
              <p className="text-[8px] font-semibold text-[#dde4dd] mb-1">Últimos</p>
              <p className="text-[8px] text-[#bbcabf]">Vacío</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tarjeta de feature
// ─────────────────────────────────────────────────────────────
function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-[#161d19] p-8 rounded-2xl border border-white/5 hover:border-[#4edea3]/30 transition-colors group">
      <div className="w-12 h-12 bg-[#1a211d] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#4edea3]/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-[#dde4dd]">{title}</h3>
      <p className="text-[#bbcabf] leading-relaxed">{text}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Página principal (landing)
// ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="flex flex-col flex-grow selection:bg-[#4edea3] selection:text-[#003824]">
      {/* ───── Header ───── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#161d19]/70 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-2xl font-bold text-[#dde4dd] tracking-tight">Tracki</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:block text-sm font-medium text-[#dde4dd] hover:text-[#4edea3] transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/registro"
              className="bg-[#4edea3] hover:bg-[#6ffbbe] text-[#003824] text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-[0_0_15px_rgba(78,222,163,0.3)] hover:shadow-[0_0_20px_rgba(78,222,163,0.4)]"
            >
              Empezar
            </Link>
          </div>
        </div>
      </header>

      {/* ───── Main ───── */}
      <main className="flex-grow pt-32 pb-20">

        {/* ── Hero ── */}
        <section className="max-w-7xl mx-auto px-6 pt-12 pb-24 flex flex-col lg:flex-row items-center gap-16 relative">
          {/* Glow de fondo */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#4edea3]/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

          {/* Texto y CTAs */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-[#dde4dd]">
              Controla tus gastos e ingresos de forma{" "}
              <span className="text-[#4edea3]">sencilla y visual.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#bbcabf] mb-10 max-w-2xl mx-auto lg:mx-0">
              Toma el control de tu futuro financiero hoy. Empieza a ahorrar, establecer objetivos y entender a dónde va tu dinero con nuestra plataforma intuitiva.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
              <Link
                href="/registro"
                className="w-full sm:w-auto bg-[#4edea3] hover:bg-[#6ffbbe] text-[#003824] text-base font-semibold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(78,222,163,0.2)] hover:shadow-[0_0_30px_rgba(78,222,163,0.4)] text-center"
              >
                Empieza gratis hoy
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto bg-[#161d19] hover:bg-[#1a211d] border border-white/10 text-[#dde4dd] text-base font-semibold px-8 py-4 rounded-xl transition-colors text-center flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ver demo
              </a>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-[#0e1511] flex items-center justify-center text-xs font-bold text-white">A</div>
                <div className="w-10 h-10 rounded-full bg-purple-500 border-2 border-[#0e1511] flex items-center justify-center text-xs font-bold text-white">B</div>
                <div className="w-10 h-10 rounded-full bg-pink-500 border-2 border-[#0e1511] flex items-center justify-center text-xs font-bold text-white">C</div>
              </div>
              <p className="text-sm text-[#bbcabf]">
                Únete a más de <strong className="text-[#dde4dd]">10,000</strong> usuarios
              </p>
            </div>
          </div>

          {/* Mockup del dashboard */}
          <div className="flex-1 relative w-full max-w-2xl lg:max-w-none">
            <div className="bg-[#161d19]/70 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-2xl relative z-10">
              <DashboardMockup />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#4edea3]/20 to-transparent blur-2xl -z-10 rounded-3xl" />
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#dde4dd]">
              Todo lo que necesitas para tu dinero
            </h2>
            <p className="text-[#bbcabf] max-w-2xl mx-auto">
              Herramientas poderosas diseñadas para darte claridad y control sobre tus finanzas personales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <svg className="w-6 h-6 text-[#4edea3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="Seguimiento Inteligente"
              text="Categorización automática y seguimiento en tiempo real de todos tus movimientos financieros."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6 text-[#4edea3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              title="Gráficos Intuitivos"
              text="Visualiza tus hábitos de gasto con gráficos claros y fáciles de entender que te dan una perspectiva real."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6 text-[#4edea3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V9a2 2 0 00-2-2m2 4v4a2 2 0 104 0v-1m-4-3H9m2 0h4m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Objetivos de Ahorro"
              text="Establece metas personalizadas y mira cómo tu progreso avanza mes a mes hacia tu libertad financiera."
            />
          </div>
        </section>

        {/* ── CTA final ── */}
        <section className="max-w-5xl mx-auto px-6 py-24">
          <div className="bg-gradient-to-b from-[#161d19] to-[#0e1511] rounded-3xl p-12 text-center border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4edea3]/10 via-transparent to-transparent opacity-50" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#dde4dd]">
                Toma el control hoy mismo
              </h2>
              <p className="text-lg text-[#bbcabf] mb-8 max-w-xl mx-auto">
                Únete a miles de personas que ya están mejorando su salud financiera con Tracki. Es gratis y solo toma un minuto empezar.
              </p>
              <Link
                href="/registro"
                className="inline-block bg-[#4edea3] hover:bg-[#6ffbbe] text-[#003824] text-lg font-bold px-10 py-4 rounded-xl transition-all shadow-lg shadow-[#4edea3]/20"
              >
                Crear mi cuenta gratis
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ───── Footer ───── */}
      <Footer />
    </div>
  );
}
