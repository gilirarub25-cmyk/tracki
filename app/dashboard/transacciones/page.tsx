"use client";

import React, { useState } from "react";

const glassCard = "bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl";

// --- Mock Data ---
const TRANSACTIONS_DATA = [
  { id: 1, name: "Apple Store - Marina Mall", category: "Tecnología", date: "Oct 24, 2023", amount: -1299.00, txId: "#TRK-9921" },
  { id: 2, name: "Stripe Payout - Project Alpha", category: "Freelance", date: "Oct 22, 2023", amount: 4500.00, txId: "#TRK-9850" },
  { id: 3, name: "The Alchemist Bar & Grill", category: "Restaurante", date: "Oct 21, 2023", amount: -184.20, txId: "#TRK-9712" },
  { id: 4, name: "Uber Technologies Inc.", category: "Transporte", date: "Oct 20, 2023", amount: -42.00, txId: "#TRK-9644" },
  { id: 5, name: "Coinbase Withdrawal", category: "Inversión", date: "Oct 19, 2023", amount: 2100.00, txId: "#TRK-9521" },
];

// --- Componentes ---
const TxSummaryGroup = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <div className={`${glassCard} p-6`}>
      <p className="text-[10px] uppercase font-bold text-[#bbcabf] mb-2 flex justify-between">Ingresos Mensuales <span className="text-[#4edea3]">📈</span></p>
      <h2 className="text-3xl font-bold text-[#4edea3]">$12,840.00</h2>
      <p className="text-xs text-[#4edea3]/70 mt-2">+14% desde el mes pasado</p>
    </div>
    <div className={`${glassCard} p-6`}>
      <p className="text-[10px] uppercase font-bold text-[#bbcabf] mb-2 flex justify-between">Gastos Mensuales <span className="text-[#ff5c5c]">📉</span></p>
      <h2 className="text-3xl font-bold text-[#dde4dd]">$4,215.30</h2>
      <p className="text-xs text-[#ff5c5c]/70 mt-2">-2.5% desde el mes pasado</p>
    </div>
    <div className={`${glassCard} p-6 relative overflow-hidden`}>
      <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-[#7bd0ff]/10 rounded-full blur-xl"></div>
      <p className="text-[10px] uppercase font-bold text-[#bbcabf] mb-2 relative z-10">Ahorro Neto</p>
      <h2 className="text-3xl font-bold text-[#7bd0ff] relative z-10">$8,624.70</h2>
      <p className="text-xs text-[#bbcabf] mt-2 relative z-10">Tasa de ahorro: 67%</p>
    </div>
  </div>
);

const TxFilterBar = () => (
  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
    <div className="flex gap-4 w-full sm:w-auto">
      <select className="bg-slate-800/80 border border-slate-700 text-[#dde4dd] text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-[#4edea3]">
        <option>Últimos 30 Días</option>
        <option>Este Mes</option>
        <option>Este Año</option>
      </select>
      <select className="bg-slate-800/80 border border-slate-700 text-[#dde4dd] text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-[#4edea3]">
        <option>Todas las Categorías</option>
        <option>Ingresos</option>
        <option>Gastos</option>
      </select>
    </div>
    <button className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[#dde4dd] px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
      <span>⬇️</span> Exportar CSV
    </button>
  </div>
);

const TxRow = ({ tx }: { tx: any }) => {
  const isPositive = tx.amount > 0;
  return (
    <div className="grid grid-cols-12 gap-4 py-4 border-b border-slate-800 items-center hover:bg-slate-800/30 transition-colors px-4 rounded-lg -mx-4">
      <div className="col-span-6 md:col-span-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg border border-slate-700">
          {isPositive ? '💸' : '🛒'}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#dde4dd]">{tx.name}</p>
          <p className="text-xs text-[#bbcabf]">ID: {tx.txId}</p>
        </div>
      </div>
      <div className="hidden md:block col-span-3">
        <span className="text-[10px] uppercase font-bold tracking-wider text-[#7bd0ff] bg-[#7bd0ff]/10 px-2 py-1 rounded-full border border-[#7bd0ff]/20">
          {tx.category}
        </span>
      </div>
      <div className="hidden sm:block col-span-3 md:col-span-2 text-sm text-[#bbcabf]">
        {tx.date}
      </div>
      <div className={`col-span-6 sm:col-span-3 md:col-span-2 text-right font-bold ${isPositive ? 'text-[#4edea3]' : 'text-[#ff5c5c]'}`}>
        {isPositive ? '+' : ''}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
      </div>
    </div>
  );
};

// --- Página Principal ---
export default function TransaccionesPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <header className="mb-8">
        <p className="text-xs font-bold tracking-widest text-[#4edea3] uppercase mb-1">Historial Detallado</p>
        <h1 className="text-3xl font-semibold text-[#dde4dd]">Movimientos Financieros</h1>
      </header>
      
      <TxSummaryGroup />
      <TxFilterBar />
      
      <div className={`${glassCard} p-6 mb-6`}>
        <div className="flex justify-between items-center mb-4 px-4">
          <h3 className="text-sm font-semibold text-[#bbcabf]">Movimientos Recientes</h3>
          <span className="text-xs text-[#bbcabf]">Mostrando 148 transacciones</span>
        </div>
        
        {/* Cabecera Tabla (Oculta en móviles muy pequeños) */}
        <div className="hidden sm:grid grid-cols-12 gap-4 pb-2 border-b border-slate-700 text-[10px] uppercase font-bold text-[#bbcabf] px-4">
          <div className="col-span-5">Movimiento</div>
          <div className="col-span-3">Categoría</div>
          <div className="col-span-2">Fecha</div>
          <div className="col-span-2 text-right">Cantidad</div>
        </div>

        {/* Lista de Transacciones */}
        <div className="flex flex-col mt-2">
          {TRANSACTIONS_DATA.map((tx) => (
            <TxRow key={tx.id} tx={tx} />
          ))}
        </div>

        {/* Paginación */}
        <div className="flex justify-between items-center mt-6 px-4 pt-4 border-t border-slate-800">
          <button className="text-sm text-[#bbcabf] hover:text-white transition-colors">← Anterior</button>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-md bg-[#4edea3] text-[#003824] font-bold text-sm">1</button>
            <button className="w-8 h-8 rounded-md hover:bg-slate-800 text-[#bbcabf] font-bold text-sm transition-colors">2</button>
            <button className="w-8 h-8 rounded-md hover:bg-slate-800 text-[#bbcabf] font-bold text-sm transition-colors">3</button>
          </div>
          <button className="text-sm text-[#bbcabf] hover:text-white transition-colors">Siguiente →</button>
        </div>
      </div>
    </div>
  );
}