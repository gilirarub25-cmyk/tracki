"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Icon from "@/components/Icon";

// --- Estilos Compartidos ---
const glassCard = "bg-[#161d19] border border-[#3c4a42]/40 rounded-xl overflow-hidden";
const neonShadow = { boxShadow: "0 0 20px rgba(78,222,163,0.2)" };

// --- Componente para mostrar cuando no hay datos ---
const EmptyGoalsState = () => (
  <div className={`${glassCard} col-span-1 lg:col-span-2 flex flex-col items-center justify-center py-16 text-center`}>
    <div className="w-16 h-16 bg-[#1a211d] rounded-full flex items-center justify-center mb-4 border border-[#3c4a42]">
      <Icon name="target" className="w-8 h-8 text-[#4edea3]" />
    </div>
    <h3 className="text-xl font-semibold text-[#dde4dd] mb-2">Aún no tienes objetivos</h3>
    <p className="text-[#bbcabf] max-w-md mb-6">Crea tu primer objetivo financiero para empezar a trackear tu progreso hacia esa casa, coche o viaje de tus sueños.</p>
    <button className="bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/50 px-6 py-2 rounded-lg font-medium hover:bg-[#4edea3]/20 transition-colors">
      Crear mi primer objetivo
    </button>
  </div>
);

// --- Componentes ---
const GoalHeader = () => (
  <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
    <div>
      <p className="text-xs font-bold tracking-widest text-[#4edea3] uppercase mb-1">Ambiciones Financieras</p>
      <h1 className="text-3xl font-semibold text-[#dde4dd]">Objetivos de Ahorro</h1>
    </div>
    <button 
      className="bg-[#4edea3] text-[#003824] px-6 py-3 rounded-lg font-bold flex items-center justify-center space-x-2 hover:bg-[#6ffbbe] transition-colors active:scale-95"
      style={neonShadow}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
      <span>Crear Nuevo Objetivo</span>
    </button>
  </header>
);

const CircularProgress = ({ percent }: { percent: number }) => {
  const dashArray = `${percent}, 100`;
  return (
    <div className="relative w-20 h-20">
      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1a211d" strokeWidth="4" />
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#7bd0ff" strokeWidth="4" strokeDasharray={dashArray} className="drop-shadow-[0_0_8px_rgba(123,208,255,0.5)]" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#dde4dd]">{percent}%</div>
    </div>
  );
};

const GoalCard = ({ goal }: { goal: any }) => {
  const percent = Math.round((goal.current / goal.target) * 100);

  return (
    <div className={`${glassCard} p-6 flex flex-col justify-between ${goal.type === 'circular' ? 'md:col-span-1' : 'md:col-span-2 lg:col-span-1'}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start gap-3">
          {goal.icono && (
            <div className="w-10 h-10 rounded-xl bg-[#1a211d] flex items-center justify-center border border-[#3c4a42] flex-shrink-0">
              <Icon name={goal.icono} className="w-5 h-5 text-[#4edea3]" />
            </div>
          )}
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#4edea3] bg-[#4edea3]/10 px-2 py-1 rounded-full mb-3 inline-block">
              {goal.category}
            </span>
            <h3 className="text-xl font-semibold text-[#dde4dd]">{goal.title}</h3>
          </div>
        </div>
        {goal.targetDate && (
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-[#bbcabf]">Fecha Objetivo</p>
            <p className="text-sm font-medium text-[#7bd0ff]">{goal.targetDate}</p>
          </div>
        )}
        {goal.inProgress && <span className="text-[10px] uppercase font-bold text-[#7bd0ff] bg-[#7bd0ff]/10 px-2 py-1 rounded-full">En Progreso</span>}
      </div>

      {goal.type === 'circular' ? (
        <div className="flex items-center gap-6 mt-4">
          <CircularProgress percent={percent} />
          <div>
            <p className="text-[10px] uppercase font-bold text-[#bbcabf] mb-1">Ahorrado</p>
            <p className="text-2xl font-bold text-[#dde4dd]">${goal.current.toLocaleString()}</p>
            <p className="text-xs text-[#bbcabf] mt-1">Objetivo: ${goal.target.toLocaleString()}</p>
          </div>
        </div>
      ) : (
        <div className="mt-auto">
          {!goal.progressOnly && (
            <div className="flex items-end justify-between mb-2">
              <div>
                <p className="text-[10px] uppercase font-bold text-[#bbcabf] mb-1">Balance Actual</p>
                <p className="text-2xl font-bold text-[#dde4dd]">
                  ${goal.current.toLocaleString()} <span className="text-sm text-[#bbcabf] font-normal">/ ${goal.target.toLocaleString()}</span>
                </p>
              </div>
              <span className="text-lg font-bold text-[#4edea3]">{percent}%</span>
            </div>
          )}
          {goal.progressOnly && (
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-[#bbcabf]">Progreso</span>
              <span className="text-[#dde4dd]">{percent}%</span>
            </div>
          )}
          <div className="w-full h-2 bg-[#1a211d] rounded-full overflow-hidden">
            <div className="h-full bg-[#4edea3]" style={{ width: `${percent}%`, boxShadow: "0 0 10px rgba(78,222,163,0.5)" }} />
          </div>
        </div>
      )}
    </div>
  );
};

const GoalMetricsGrid = ({ metrics }: { metrics: any[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
    {metrics.map((metric, idx) => (
      <div key={idx} className={`${glassCard} p-5 flex items-center gap-4`}>
        <div className="w-12 h-12 rounded-xl bg-[#1a211d] flex items-center justify-center border border-[#3c4a42]">
          <Icon name={metric.icon} className={`w-6 h-6 ${metric.iconColor || 'text-[#4edea3]'}`} />
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-[#bbcabf] tracking-wider mb-1">{metric.label}</p>
          <p className={`text-xl font-bold ${metric.isPositive ? 'text-[#4edea3]' : 'text-[#dde4dd]'}`}>
            {metric.value}
          </p>
        </div>
      </div>
    ))}
  </div>
);

// --- Página Principal ---
export default function ObjetivosPage() {
  const [loading, setLoading] = useState(true);
  
  // Estados para los datos reales (Inician vacíos)
  const [goalsData, setGoalsData] = useState<any[]>([]);
  const [metricsData, setMetricsData] = useState([
    { label: "Ahorro Mensual",        value: "0.00 €", icon: "money",         iconColor: "text-[#4edea3]" },
    { label: "Crecimiento Promedio",  value: "0%",     icon: "trending-up",   iconColor: "text-[#4edea3]", isPositive: false },
    { label: "Objetivos Alcanzados",  value: "0",      icon: "trophy",        iconColor: "text-[#ffd6a5]" },
  ]);

  useEffect(() => {
    const fetchObjetivos = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // En el futuro:
        // const { data } = await supabase.from('objetivos').select('*').eq('id_usuario', user.id);
        // setGoalsData(data);
        
        // Por ahora lo dejamos vacío
        setGoalsData([]);
      }
      
      setLoading(false);
    };

    fetchObjetivos();
  }, []);

  if (loading) {
    return <div className="p-8 text-[#bbcabf]">Cargando tus objetivos...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      <GoalHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goalsData.length === 0 ? (
          <EmptyGoalsState />
        ) : (
          goalsData.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))
        )}
      </div>
      
      <GoalMetricsGrid metrics={metricsData} />
    </div>
  );
}
