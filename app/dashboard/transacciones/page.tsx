"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const glassCard = "bg-[#161d19] border border-[#3c4a42]/40 rounded-xl";

// --- Componente para mostrar cuando no hay datos ---
const EmptyTransactionsState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 bg-[#1a211d] rounded-full flex items-center justify-center mb-4 border border-[#3c4a42]">
      <span className="text-3xl">💸</span>
    </div>
    <h3 className="text-xl font-semibold text-[#dde4dd] mb-2">No hay movimientos</h3>
    <p className="text-[#bbcabf] max-w-md mb-6">Aún no has registrado ninguna transacción. Los movimientos que añadas aparecerán aquí.</p>
  </div>
);

// --- Componentes ---
const TxSummaryGroup = ({ ingresos, gastos, ahorro, tasa }: { ingresos: number, gastos: number, ahorro: number, tasa: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <div className={`${glassCard} p-6`}>
      <p className="text-[10px] uppercase font-bold text-[#bbcabf] mb-2 flex justify-between">Ingresos Mensuales <span className="text-[#4edea3]">📈</span></p>
      <h2 className="text-3xl font-bold text-[#4edea3]">{ingresos.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</h2>
      <p className="text-xs text-[#bbcabf] mt-2">Basado en tus registros</p>
    </div>
    <div className={`${glassCard} p-6`}>
      <p className="text-[10px] uppercase font-bold text-[#bbcabf] mb-2 flex justify-between">Gastos Mensuales <span className="text-[#ffb4ab]">📉</span></p>
      <h2 className="text-3xl font-bold text-[#dde4dd]">{gastos.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</h2>
      <p className="text-xs text-[#bbcabf] mt-2">Basado en tus registros</p>
    </div>
    <div className={`${glassCard} p-6 relative overflow-hidden`}>
      <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-[#4edea3]/5 rounded-full blur-xl"></div>
      <p className="text-[10px] uppercase font-bold text-[#bbcabf] mb-2 relative z-10">Ahorro Neto</p>
      <h2 className="text-3xl font-bold text-[#4edea3] relative z-10">{ahorro.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</h2>
      <p className="text-xs text-[#bbcabf] mt-2 relative z-10">Tasa de ahorro: {tasa}%</p>
    </div>
  </div>
);

const TxFilterBar = () => (
  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
    <div className="flex gap-4 w-full sm:w-auto">
      <select className="bg-[#1a211d] border border-[#3c4a42] text-[#dde4dd] text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-[#4edea3] cursor-pointer">
        <option>Últimos 30 Días</option>
        <option>Este Mes</option>
        <option>Este Año</option>
      </select>
      <select className="bg-[#1a211d] border border-[#3c4a42] text-[#dde4dd] text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-[#4edea3] cursor-pointer">
        <option>Todas las Categorías</option>
        <option>Ingresos</option>
        <option>Gastos</option>
      </select>
    </div>
    <button className="w-full sm:w-auto bg-[#1a211d] hover:bg-[#242c27] border border-[#3c4a42] text-[#dde4dd] px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer">
      <span>⬇️</span> Exportar CSV
    </button>
  </div>
);

const TxRow = ({ tx }: { tx: any }) => {
  // Cuando traigamos de Supabase, usaremos 'ingreso' o 'gasto'
  const isPositive = tx.tipo === 'ingreso'; 
  
  return (
    <div className="grid grid-cols-12 gap-4 py-4 border-b border-[#3c4a42]/40 items-center hover:bg-[#1a211d]/50 transition-colors px-4 rounded-lg -mx-4">
      <div className="col-span-6 md:col-span-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#1a211d] flex items-center justify-center text-lg border border-[#3c4a42]">
          {isPositive ? '💸' : '🛒'}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#dde4dd]">{tx.nombre}</p>
          <p className="text-xs text-[#bbcabf]">ID: {tx.id ? tx.id.substring(0,8) : '---'}</p>
        </div>
      </div>
      <div className="hidden md:block col-span-3">
        <span className="text-[10px] uppercase font-bold tracking-wider text-[#4edea3] bg-[#4edea3]/10 px-2 py-1 rounded-full border border-[#4edea3]/20">
          {tx.categoria}
        </span>
      </div>
      <div className="hidden sm:block col-span-3 md:col-span-2 text-sm text-[#bbcabf]">
        {new Date(tx.fecha).toLocaleDateString('es-ES')}
      </div>
      <div className={`col-span-6 sm:col-span-3 md:col-span-2 text-right font-bold ${isPositive ? 'text-[#4edea3]' : 'text-[#ffb4ab]'}`}>
        {isPositive ? '+' : '-'}{tx.cantidad.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
      </div>
    </div>
  );
};

// --- Página Principal ---
export default function TransaccionesPage() {
  const [loading, setLoading] = useState(true);
  
  // Estados Reales que inician vacíos
  const [transacciones, setTransacciones] = useState<any[]>([]);
  const [resumen, setResumen] = useState({ ingresos: 0, gastos: 0, ahorro: 0, tasa: 0 });

  useEffect(() => {
    const fetchTransacciones = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Aquí conectaremos la tabla 'transacciones' más adelante
        // const { data } = await supabase.from('transacciones').select('*').eq('user_id', user.id);
        // setTransacciones(data || []);
        
        setTransacciones([]);
      }
      
      setLoading(false);
    };

    fetchTransacciones();
  }, []);

  if (loading) {
    return <div className="p-8 text-[#bbcabf]">Cargando tu historial...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      <header className="mb-8">
        <p className="text-xs font-bold tracking-widest text-[#4edea3] uppercase mb-1">Historial Detallado</p>
        <h1 className="text-3xl font-semibold text-[#dde4dd]">Movimientos Financieros</h1>
      </header>
      
      <TxSummaryGroup 
        ingresos={resumen.ingresos} 
        gastos={resumen.gastos} 
        ahorro={resumen.ahorro} 
        tasa={resumen.tasa} 
      />
      
      <TxFilterBar />
      
      <div className={`${glassCard} p-6 mb-6`}>
        <div className="flex justify-between items-center mb-4 px-4">
          <h3 className="text-sm font-semibold text-[#dde4dd]">Movimientos Recientes</h3>
          <span className="text-xs text-[#bbcabf]">Mostrando {transacciones.length} transacciones</span>
        </div>
        
        {transacciones.length === 0 ? (
          <EmptyTransactionsState />
        ) : (
          <>
            {/* Cabecera Tabla */}
            <div className="hidden sm:grid grid-cols-12 gap-4 pb-2 border-b border-[#3c4a42]/40 text-[10px] uppercase font-bold text-[#bbcabf] px-4 mt-6">
              <div className="col-span-5">Movimiento</div>
              <div className="col-span-3">Categoría</div>
              <div className="col-span-2">Fecha</div>
              <div className="col-span-2 text-right">Cantidad</div>
            </div>

            {/* Lista de Transacciones */}
            <div className="flex flex-col mt-2">
              {transacciones.map((tx, idx) => (
                <TxRow key={tx.id || idx} tx={tx} />
              ))}
            </div>

            {/* Paginación */}
            <div className="flex justify-between items-center mt-6 px-4 pt-4 border-t border-[#3c4a42]/40">
              <button className="text-sm text-[#bbcabf] hover:text-[#dde4dd] transition-colors">← Anterior</button>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-md bg-[#4edea3] text-[#003824] font-bold text-sm">1</button>
              </div>
              <button className="text-sm text-[#bbcabf] hover:text-[#dde4dd] transition-colors cursor-not-allowed opacity-50">Siguiente →</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}