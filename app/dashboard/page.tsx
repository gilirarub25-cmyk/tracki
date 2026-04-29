"use client";

import { useState } from "react";

const glassCard: React.CSSProperties = {
  background: "linear-gradient(180deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.8) 100%)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(51,65,85,0.5)",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
};

const neonGlow: React.CSSProperties = {
  boxShadow: "0 0 20px rgba(78,222,163,0.2)",
};

const Icons = {
  add: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  arrowDown: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
  arrowUp: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>,
  balance: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
  chevronDown: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
  work: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  home: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  cart: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
};

type BadgeColor = "green" | "red" | "blue";
const badgeMap: Record<BadgeColor, { badge: string; icon: string; glow: string; valueColor: string }> = {
  green: { badge: "bg-[#4edea3]/10 text-[#4edea3]", icon: "bg-[#4edea3]/10 text-[#4edea3]", glow: "rgba(78,222,163,0.05)", valueColor: "text-[#4edea3]" },
  red:   { badge: "bg-[#ff5c5c]/10 text-[#ff5c5c]", icon: "bg-[#ff5c5c]/10 text-[#ff5c5c]", glow: "rgba(255,92,92,0.05)", valueColor: "text-[#ff5c5c]" },
  blue:  { badge: "bg-[#7bd0ff]/10 text-[#7bd0ff]", icon: "bg-[#7bd0ff]/10 text-[#7bd0ff]", glow: "rgba(123,208,255,0.05)", valueColor: "text-[#7bd0ff]" },
};

function MetricCard({ label, value, badge, color, icon }: { label: string; value: string; badge: string; color: BadgeColor; icon: React.ReactNode }) {
  const m = badgeMap[color];
  return (
    <div className="rounded-xl p-6 relative overflow-hidden group" style={glassCard}>
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-110" style={{ background: m.glow }} />
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${m.icon}`}>{icon}</div>
          <span className="text-xs tracking-[0.05em] font-medium text-[#bbcabf] uppercase">{label}</span>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${m.badge}`}>{badge}</span>
      </div>
      <div className={`text-[48px] leading-[1.1] font-bold tracking-[-0.02em] ${m.valueColor}`}>
        {value}<span className="text-[#bbcabf] text-2xl ml-1">€</span>
      </div>
    </div>
  );
}

const CHART_DATA = [
  { month: "May", income: 60, expense: 40,  active: false },
  { month: "Jun", income: 70, expense: 45,  active: false },
  { month: "Jul", income: 65, expense: 50,  active: false },
  { month: "Ago", income: 80, expense: 60,  active: false },
  { month: "Sep", income: 75, expense: 55,  active: false },
  { month: "Oct", income: 90, expense: 45,  active: true  },
];

function BarChart() {
  return (
    <div className="h-64 w-full flex items-end justify-between space-x-2 px-2">
      {CHART_DATA.map((col) => (
        <div key={col.month} className="flex flex-col justify-end items-center w-full space-y-2 group">
          <div className="flex space-x-1 items-end w-full justify-center h-48">
            <div className={`w-1/3 rounded-t-sm transition-colors ${col.active ? "bg-[#4edea3]" : "bg-[#4edea3]/80 group-hover:bg-[#4edea3]"}`} style={{ height: `${col.income}%`, boxShadow: col.active ? "0 0 20px rgba(78,222,163,0.2)" : undefined }} />
            <div className={`w-1/3 rounded-t-sm transition-colors ${col.active ? "bg-[#343b36]" : "bg-[#2f3632] group-hover:bg-[#343b36]"}`} style={{ height: `${col.expense}%` }} />
          </div>
          <span className={`text-xs tracking-[0.05em] font-medium ${col.active ? "text-[#dde4dd]" : "text-[#bbcabf]"}`}>{col.month}</span>
        </div>
      ))}
    </div>
  );
}

function TxRow({ icon, iconBg, iconColor, name, sub, amount, positive }: { icon: React.ReactNode; iconBg: string; iconColor: string; name: string; sub: string; amount: string; positive: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors" style={{ border: "1px solid transparent", background: hovered ? "#242c27" : "transparent", borderColor: hovered ? "#3c4a42" : "transparent" }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg} ${iconColor}`}>{icon}</div>
        <div>
          <p className="text-base text-[#dde4dd] font-medium">{name}</p>
          <p className="text-sm text-[#bbcabf]">{sub}</p>
        </div>
      </div>
      <p className={`text-base font-bold ${positive ? "text-[#4edea3]" : "text-[#dde4dd] font-medium"}`}>{amount}</p>
    </div>
  );
}

function CircularProgress({ percent }: { percent: number }) {
  const r = 40;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#242c27" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke="#4edea3" strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 8px rgba(78,222,163,0.4))" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center"><span className="text-2xl font-bold text-[#dde4dd]">{percent}%</span></div>
    </div>
  );
}

export default function DashboardPage() {
  const userName = "Rubén"; 

  return (
    <div className="flex-1 p-6 pb-24 md:pb-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#dde4dd]">Hola, {userName} 👋</h2>
          <p className="text-sm text-[#bbcabf] mt-1">Aquí tienes tu resumen financiero de Octubre.</p>
        </div>
        <button className="md:hidden w-full sm:w-auto bg-[#4edea3] text-[#003824] px-6 py-3 rounded-lg font-bold flex items-center justify-center space-x-2 hover:bg-[#6ffbbe] transition-colors active:scale-95 duration-200" style={neonGlow}>
          {Icons.add}<span>Añadir movimiento</span>
        </button>
      </header>

      {/* Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <MetricCard label="Ingresos" value="3.240" badge="+12.5%" color="green" icon={Icons.arrowDown} />
        <MetricCard label="Gastos"   value="1.850" badge="+4.2%"  color="red"   icon={Icons.arrowUp}   />
        <MetricCard label="Balance"  value="1.390" badge="+24.8%" color="blue"  icon={Icons.balance}   />
      </section>

      {/* Chart */}
      <section className="mb-6">
        <div className="rounded-xl p-6" style={glassCard}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-[#dde4dd]">Ingresos vs Gastos</h3>
            <button className="text-[#bbcabf] hover:text-[#dde4dd] transition-colors flex items-center space-x-1 text-sm">
              <span>Últimos 6 meses</span>{Icons.chevronDown}
            </button>
          </div>
          <BarChart />
        </div>
      </section>

      {/* Bottom row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Transactions */}
        <div className="lg:col-span-2 rounded-xl p-6" style={glassCard}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-[#dde4dd]">Últimos movimientos</h3>
            <a href="#" className="text-[#4edea3] hover:text-[#6ffbbe] text-sm transition-colors">Ver todos</a>
          </div>
          <div className="space-y-1">
            <TxRow icon={Icons.work} iconBg="bg-[#00a6e0]/20" iconColor="text-[#7bd0ff]" name="Nómina Tracki Inc." sub="Ingreso • Hoy, 09:00" amount="+2.850,00 €" positive />
            <TxRow icon={Icons.home} iconBg="bg-[#ff5c5c]/15" iconColor="text-[#ff5c5c]" name="Alquiler Octubre" sub="Vivienda • Ayer" amount="-850,00 €" positive={false} />
            <TxRow icon={Icons.cart} iconBg="bg-[#ff5c5c]/15" iconColor="text-[#ff5c5c]" name="Mercadona" sub="Alimentación • 12 Oct" amount="-64,30 €" positive={false} />
          </div>
        </div>

        {/* Goal */}
        <div className="rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden" style={glassCard}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(78,222,163,0.05) 0%, transparent 100%)" }} />
          <h3 className="text-lg font-semibold text-[#dde4dd] mb-2 relative z-10">Objetivo: MacBook Pro</h3>
          <p className="text-sm text-[#bbcabf] mb-6 relative z-10">Ahorro mensual</p>
          <div className="relative z-10"><CircularProgress percent={56} /></div>
          <div className="w-full relative z-10 mt-4">
            <div className="flex justify-between">
              <span className="text-xs tracking-[0.05em] font-bold text-[#4edea3]">840€</span>
              <span className="text-xs tracking-[0.05em] font-medium text-[#bbcabf]">1.500€</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}