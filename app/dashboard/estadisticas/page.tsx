"use client";

import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const glassCard = "bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl";

// --- Mock Data ---
const NET_WORTH_DATA = [
  { month: 'Ene', value: 150000 }, { month: 'Feb', value: 160000 }, { month: 'Mar', value: 155000 },
  { month: 'Abr', value: 180000 }, { month: 'May', value: 190000 }, { month: 'Jun', value: 210000 }, { month: 'Jul', value: 248590 },
];

const CASH_FLOW_DATA = [
  { week: 'W1', income: 4000, expense: 2400 }, { week: 'W2', income: 3000, expense: 1398 },
  { week: 'W3', income: 2000, expense: 9800 }, { week: 'W4', income: 2780, expense: 3908 },
];

const SPENDING_DATA = [
  { name: 'Vivienda', value: 40, color: '#4edea3' },
  { name: 'Comida', value: 25, color: '#7bd0ff' },
  { name: 'Transporte', value: 15, color: '#ff5c5c' },
  { name: 'Otros', value: 20, color: '#334155' },
];

// --- Componentes ---
const StatsHeader = () => (
  <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
    <div>
      <p className="text-xs font-bold tracking-widest text-[#4edea3] uppercase mb-1">Analíticas de Rendimiento</p>
      <h1 className="text-3xl font-semibold text-[#dde4dd]">Pulso Sofisticado</h1>
    </div>
    <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
      {['Mensual', 'Trimestral', 'Anual'].map((period, i) => (
        <button key={period} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${i === 0 ? 'bg-[#4edea3] text-[#003824]' : 'text-[#bbcabf] hover:text-white'}`}>
          {period}
        </button>
      ))}
    </div>
  </header>
);

const NetWorthChart = () => (
  <div className={`${glassCard} p-6 lg:col-span-2`}>
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className="text-lg font-semibold text-[#dde4dd]">Crecimiento del Patrimonio</h3>
        <p className="text-xs text-[#4edea3] font-medium">+12.4% desde el último periodo</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] uppercase font-bold text-[#bbcabf]">Activos Totales</p>
        <p className="text-2xl font-bold text-[#dde4dd]">$248,590.00</p>
      </div>
    </div>
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={NET_WORTH_DATA} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4edea3" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#4edea3" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#dde4dd' }} itemStyle={{ color: '#4edea3' }} />
          <Area type="monotone" dataKey="value" stroke="#4edea3" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const InsightCards = () => (
  <div className="flex flex-col gap-4">
    <div className={`${glassCard} p-6 flex-1`}>
      <div className="w-10 h-10 rounded-full bg-[#4edea3]/20 flex items-center justify-center mb-4">
        <span className="text-[#4edea3] text-xl">💡</span>
      </div>
      <h3 className="text-md font-semibold text-[#dde4dd] mb-2">Insight de Ahorro</h3>
      <p className="text-sm text-[#bbcabf] mb-4">Has gastado <span className="text-[#4edea3] font-bold">$420 menos</span> en entretenimiento este mes. Considera mover esto a tu objetivo "Tesla".</p>
      <button className="w-full py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm font-medium text-white transition-colors border border-slate-600">
        Aplicar Auto-Ahorro
      </button>
    </div>
    <div className={`${glassCard} p-6`}>
      <p className="text-[10px] uppercase font-bold text-[#bbcabf] mb-1">Top Rendimiento</p>
      <h3 className="text-lg font-semibold text-[#dde4dd] mb-2">Ethereum Stake</h3>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-[#dde4dd]">$12,450</span>
        <span className="text-sm font-bold text-[#4edea3] mb-1">+8.2%</span>
      </div>
    </div>
  </div>
);

const BottomCharts = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
    <div className={`${glassCard} p-6`}>
      <h3 className="text-lg font-semibold text-[#dde4dd] mb-6">Flujo de Caja</h3>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={CASH_FLOW_DATA}>
            <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
            <Bar dataKey="income" fill="#4edea3" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="#334155" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className={`${glassCard} p-6 flex items-center`}>
      <div className="h-[200px] w-1/2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={SPENDING_DATA} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
              {SPENDING_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-1/2 pl-4">
        <h3 className="text-lg font-semibold text-[#dde4dd] mb-4">División de Gastos</h3>
        <div className="space-y-3">
          {SPENDING_DATA.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-[#bbcabf]">{item.name}</span>
              </div>
              <span className="text-sm font-bold text-[#dde4dd]">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// --- Página Principal ---
export default function EstadisticasPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <StatsHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <NetWorthChart />
        <InsightCards />
      </div>
      <BottomCharts />
    </div>
  );
}