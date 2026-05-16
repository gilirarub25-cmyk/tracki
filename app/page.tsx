// app/page.tsx
"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import Footer from "@/components/Footer";

// ──────────────────────────────────────────────────────────────
// Easing premium tipo Apple
// ──────────────────────────────────────────────────────────────
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

// Variants reutilizables
const heroContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT_EXPO } },
};

const scrollReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT_EXPO } },
};

const scrollRevealScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: EASE_OUT_EXPO } },
};

// Tap/hover springs
const buttonHover = { scale: 1.05 };
const buttonTap = { scale: 0.95 };
const buttonSpring = { type: "spring" as const, stiffness: 400, damping: 17 };

// ──────────────────────────────────────────────────────────────
// Logo
// ──────────────────────────────────────────────────────────────
const Logo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={`${className} text-[#4edea3]`} fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 3h2v18H3V3zm6 8h2v10H9V11zm6-5h2v15h-2V6zm6 4h2v11h-2V10z" />
  </svg>
);

// ──────────────────────────────────────────────────────────────
// Mockup del dashboard (flotando)
// ──────────────────────────────────────────────────────────────
function DashboardMockup() {
  return (
    <div className="bg-[#0e1511] rounded-xl w-full border border-white/10 overflow-hidden">
      {/* Top bar */}
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

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#161d19] border border-[#3c4a42]/40 rounded-lg p-2.5">
              <p className="text-[8px] uppercase font-bold text-[#bbcabf] mb-1 tracking-wider">Ingresos</p>
              <p className="text-xs font-bold text-[#4edea3]">2.450 €</p>
            </div>
            <div className="bg-[#161d19] border border-[#3c4a42]/40 rounded-lg p-2.5">
              <p className="text-[8px] uppercase font-bold text-[#bbcabf] mb-1 tracking-wider">Gastos</p>
              <p className="text-xs font-bold text-[#ffb4ab]">1.200 €</p>
            </div>
            <div className="bg-[#161d19] border border-[#3c4a42]/40 rounded-lg p-2.5">
              <p className="text-[8px] uppercase font-bold text-[#bbcabf] mb-1 tracking-wider">Balance</p>
              <p className="text-xs font-bold text-[#4edea3]">1.250 €</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 bg-[#161d19] border border-[#3c4a42]/40 rounded-lg p-3 h-24 flex items-end gap-1.5">
              {[40, 70, 55, 90, 65, 80, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-[#4edea3]/30 to-[#4edea3] rounded-sm"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="bg-[#161d19] border border-[#3c4a42]/40 rounded-lg p-3 h-24 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full border-[3px] border-[#4edea3] border-t-transparent" style={{ transform: "rotate(45deg)" }} />
              <p className="text-[8px] text-[#bbcabf] mt-1">75%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Mini gráfico animado para la card grande del Bento
// ──────────────────────────────────────────────────────────────
function MiniChart() {
  const bars = [40, 65, 50, 80, 70, 95, 85];
  return (
    <div className="flex items-end gap-2 h-32 w-full">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="flex-1 bg-gradient-to-t from-[#4edea3]/20 to-[#4edea3] rounded-md"
          initial={{ height: 0, opacity: 0 }}
          whileInView={{ height: `${h}%`, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: i * 0.08, ease: EASE_OUT_EXPO }}
          style={{ boxShadow: "0 0 12px rgba(78,222,163,0.3)" }}
        />
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Página principal (landing)
// ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="flex flex-col flex-grow selection:bg-[#4edea3] selection:text-[#003824] relative overflow-hidden">

      {/* ───── Glows radiales de fondo (decorativos) ───── */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-200px] left-[-100px] w-[700px] h-[700px] bg-[#4edea3]/15 rounded-full blur-[160px]" />
        <div className="absolute top-[40%] right-[-200px] w-[600px] h-[600px] bg-[#4edea3]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[500px] h-[500px] bg-[#7bd0ff]/5 rounded-full blur-[140px]" />
      </div>

      {/* ───── Header glassmorphism ───── */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#161d19]/50 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo />
            <span className="text-2xl font-bold text-[#dde4dd] tracking-tight">Tracki</span>
          </Link>

          <div className="flex items-center gap-4">
            <motion.div whileHover={buttonHover} whileTap={buttonTap} transition={buttonSpring}>
              <Link
                href="/login"
                className="hidden sm:block text-sm font-medium text-[#dde4dd] hover:text-[#4edea3] transition-colors px-3 py-2"
              >
                Iniciar Sesión
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ ...buttonHover, boxShadow: "0 0 30px rgba(78,222,163,0.6)" }}
              whileTap={buttonTap}
              transition={buttonSpring}
              style={{ borderRadius: "0.5rem", boxShadow: "0 0 15px rgba(78,222,163,0.3)" }}
            >
              <Link
                href="/registro"
                className="block bg-[#4edea3] hover:bg-[#6ffbbe] text-[#003824] text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                Empezar
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* ───── Main ───── */}
      <main className="flex-grow pt-32 pb-20">

        {/* ── Hero ── */}
        <section className="max-w-7xl mx-auto px-6 pt-12 pb-32 flex flex-col lg:flex-row items-center gap-16 relative">

          {/* Texto y CTAs */}
          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="visible"
            className="flex-1 text-center lg:text-left"
          >
            <motion.div variants={heroItem} className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-[#4edea3]/10 border border-[#4edea3]/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4edea3]" />
              </span>
              <span className="text-xs font-medium text-[#4edea3]">Nuevo · Disponible gratis</span>
            </motion.div>

            <motion.h1
              variants={heroItem}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 text-[#dde4dd] tracking-tight"
            >
              Controla tus gastos e ingresos de forma{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-[#4edea3] to-[#6ffbbe] bg-clip-text text-transparent">
                  sencilla y visual.
                </span>
              </span>
            </motion.h1>

            <motion.p
              variants={heroItem}
              className="text-lg md:text-xl text-[#bbcabf] mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Toma el control de tu futuro financiero hoy. Empieza a ahorrar, establecer objetivos y entender a dónde va tu dinero con nuestra plataforma intuitiva.
            </motion.p>

            <motion.div
              variants={heroItem}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12"
            >
              <motion.div
                whileHover={{ ...buttonHover, boxShadow: "0 0 40px rgba(78,222,163,0.5)" }}
                whileTap={buttonTap}
                transition={buttonSpring}
                style={{ borderRadius: "0.75rem", boxShadow: "0 0 25px rgba(78,222,163,0.25)" }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/registro"
                  className="block w-full sm:w-auto bg-[#4edea3] hover:bg-[#6ffbbe] text-[#003824] text-base font-semibold px-8 py-4 rounded-xl transition-colors text-center"
                >
                  Empieza gratis hoy
                </Link>
              </motion.div>

              <motion.div
                whileHover={buttonHover}
                whileTap={buttonTap}
                transition={buttonSpring}
                className="w-full sm:w-auto"
              >
                <a
                  href="#features"
                  className="block w-full sm:w-auto bg-[#161d19]/60 backdrop-blur-md hover:bg-[#1a211d]/80 border border-white/10 text-[#dde4dd] text-base font-semibold px-8 py-4 rounded-xl transition-colors text-center flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Ver demo
                </a>
              </motion.div>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={heroItem}
              className="flex items-center justify-center lg:justify-start gap-4"
            >
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-[#0e1511] flex items-center justify-center text-xs font-bold text-white">A</div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-[#0e1511] flex items-center justify-center text-xs font-bold text-white">B</div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 border-2 border-[#0e1511] flex items-center justify-center text-xs font-bold text-white">C</div>
              </div>
              <p className="text-sm text-[#bbcabf]">
                Únete a más de <strong className="text-[#dde4dd]">10,000</strong> usuarios
              </p>
            </motion.div>
          </motion.div>

          {/* Mockup flotando */}
          <motion.div
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: EASE_OUT_EXPO }}
            className="flex-1 relative w-full max-w-2xl lg:max-w-none"
          >
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="bg-[#161d19]/60 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-2xl relative z-10"
              style={{ boxShadow: "0 30px 60px rgba(0,0,0,0.4), 0 0 80px rgba(78,222,163,0.15)" }}
            >
              <DashboardMockup />
            </motion.div>
            {/* Glow detrás del mockup */}
            <div className="absolute -inset-8 bg-gradient-to-tr from-[#4edea3]/25 via-transparent to-[#7bd0ff]/15 blur-3xl -z-10 rounded-3xl" />
          </motion.div>
        </section>

        {/* ── Features (Bento Grid asimétrico) ── */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-24 relative">

          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#dde4dd] tracking-tight">
              Todo lo que necesitas para tu dinero
            </h2>
            <p className="text-lg text-[#bbcabf] max-w-2xl mx-auto">
              Herramientas poderosas diseñadas para darte claridad y control sobre tus finanzas personales.
            </p>
          </motion.div>

          {/* Bento grid: una card grande a la izquierda + dos pequeñas a la derecha */}
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-6 lg:auto-rows-fr">

            {/* Card grande (Gráficos Intuitivos) */}
            <motion.div
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              whileHover={{ y: -6 }}
              transition={{ ...buttonSpring }}
              className="lg:col-span-2 lg:row-span-2 group relative bg-[#161d19]/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:border-[#4edea3]/30 transition-colors overflow-hidden flex flex-col"
            >
              {/* Glow interno al hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#4edea3]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#4edea3]/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 bg-[#1a211d] rounded-2xl flex items-center justify-center mb-6 border border-[#3c4a42]/40 group-hover:border-[#4edea3]/40 transition-colors">
                  <svg className="w-7 h-7 text-[#4edea3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3 text-[#dde4dd]">Gráficos Intuitivos</h3>
                <p className="text-[#bbcabf] leading-relaxed mb-8 max-w-md">
                  Visualiza tus hábitos de gasto con gráficos claros y fáciles de entender que te dan una perspectiva real de tu dinero, mes a mes.
                </p>

                <div className="mt-auto pt-6">
                  <MiniChart />
                  <div className="flex justify-between mt-3 text-[10px] text-[#86948a] uppercase tracking-wider font-medium">
                    <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card pequeña arriba derecha (Seguimiento Inteligente) */}
            <motion.div
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              whileHover={{ y: -6 }}
              transition={{ ...buttonSpring }}
              className="group relative bg-[#161d19]/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:border-[#4edea3]/30 transition-colors overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#4edea3]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="relative z-10">
                <div className="w-14 h-14 bg-[#1a211d] rounded-2xl flex items-center justify-center mb-6 border border-[#3c4a42]/40 group-hover:border-[#4edea3]/40 transition-colors">
                  <svg className="w-7 h-7 text-[#4edea3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#dde4dd]">Seguimiento Inteligente</h3>
                <p className="text-[#bbcabf] leading-relaxed text-sm">
                  Categorización automática y seguimiento en tiempo real de todos tus movimientos financieros.
                </p>
              </div>
            </motion.div>

            {/* Card pequeña abajo derecha (Objetivos de Ahorro) */}
            <motion.div
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              whileHover={{ y: -6 }}
              transition={{ ...buttonSpring }}
              className="group relative bg-[#161d19]/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:border-[#4edea3]/30 transition-colors overflow-hidden"
            >
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#4edea3]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="relative z-10">
                <div className="w-14 h-14 bg-[#1a211d] rounded-2xl flex items-center justify-center mb-6 border border-[#3c4a42]/40 group-hover:border-[#4edea3]/40 transition-colors">
                  <svg className="w-7 h-7 text-[#4edea3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#dde4dd]">Objetivos de Ahorro</h3>
                <p className="text-[#bbcabf] leading-relaxed text-sm">
                  Establece metas personalizadas y mira cómo tu progreso avanza mes a mes hacia tu libertad financiera.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CTA final ── */}
        <section className="max-w-5xl mx-auto px-6 py-24">
          <motion.div
            variants={scrollRevealScale}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="relative bg-gradient-to-b from-[#161d19] to-[#0e1511] rounded-[2rem] p-12 md:p-16 text-center border border-white/10 overflow-hidden"
          >
            {/* Glows internos */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#4edea3]/20 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#7bd0ff]/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10">
              <motion.h2
                variants={scrollReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#dde4dd] tracking-tight"
              >
                Toma el control{" "}
                <span className="bg-gradient-to-r from-[#4edea3] to-[#6ffbbe] bg-clip-text text-transparent">
                  hoy mismo
                </span>
              </motion.h2>
              <motion.p
                variants={scrollReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg md:text-xl text-[#bbcabf] mb-10 max-w-xl mx-auto leading-relaxed"
              >
                Únete a miles de personas que ya están mejorando su salud financiera con Tracki. Es gratis y solo toma un minuto empezar.
              </motion.p>
              <motion.div
                variants={scrollReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  whileHover={{ ...buttonHover, boxShadow: "0 0 50px rgba(78,222,163,0.6)" }}
                  whileTap={buttonTap}
                  transition={buttonSpring}
                  style={{
                    borderRadius: "0.75rem",
                    display: "inline-block",
                    boxShadow: "0 0 30px rgba(78,222,163,0.3)",
                  }}
                >
                  <Link
                    href="/registro"
                    className="block bg-[#4edea3] hover:bg-[#6ffbbe] text-[#003824] text-lg font-bold px-10 py-4 rounded-xl transition-colors"
                  >
                    Crear mi cuenta gratis
                  </Link>
                </motion.div>
              </motion.div>
              <p className="text-xs text-[#86948a] mt-6">Sin tarjeta de crédito · Cancela cuando quieras</p>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
