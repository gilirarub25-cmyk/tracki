"use client";

import React, { useState, useEffect } from "react";
import { AreaChart, Area, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { supabase } from "@/lib/supabase";
import Icon from "@/components/Icon";

const glassCard = "bg-[#161d19] border border-[#3c4a42]/40 rounded-xl";

// --- Componente para mostrar cuando no hay datos ---
const EmptyChartState = ({ message }: { message: string }) => (
  <div className="w-full h-full flex flex-col items-center justify-center text-center min-h-[200px]">
    <svg className="w-12 h-12 text-[#3c4a42] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
    <p className="text-[#bbcabf] text-sm">{message}</p>
  </div>
);

// --- Subcomponentes de UI ---
const StatsHeader = () => (
  <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
    <div>
      <p className="text-xs font-bold tracking-widest text-[#4edea3] uppercase mb-1">Analíticas de Rendimiento</p>
      <h1 className="text-3xl font-semibold text-[#dde4dd]">Tus Estadísticas</h1>
    </div>
    <div className="flex bg-[#1a211d] p-1 rounded-lg border border-[#3c4a42]/40">
      {['Mensual', 'Trimestral', 'Anual'].map((period, i) => (
        <button key={period} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${i === 0 ? 'bg-[#4edea3] text-[#003824]' : 'text-[#bbcabf] hover:text-[#dde4dd]'}`}>
          {period}
        </button>
      ))}
    </div>
  </header>
);

const NetWorthChart = ({ data }: { data: any[] }) => (
  <div className={`${glassCard} p-6 lg:col-span-2 flex flex-col`}>
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className="text-lg font-semibold text-[#dde4dd]">Evolución del Balance</h3>
        <p className="text-xs text-[#bbcabf] font-medium">Calculado según tus ingresos y gastos</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] uppercase font-bold text-[#bbcabf]">Balance Total</p>
        <p className="text-2xl font-bold text-[#dde4dd]">0.00 €</p>
      </div>
    </div>
    <div className="h-[250px] w-full flex-1">
      {data.length === 0 ? (
        <EmptyChartState message="Añade transacciones para ver la evolución de tu dinero." />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4edea3" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4edea3" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip contentStyle={{ backgroundColor: '#161d19', borderColor: '#3c4a42', color: '#dde4dd' }} itemStyle={{ color: '#4edea3' }} />
            <Area type="monotone" dataKey="value" stroke="#4edea3" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  </div>
);

const InsightCards = () => (
  <div className="flex flex-col gap-4">
    <div className={`${glassCard} p-6 flex-1 flex flex-col justify-center`}>
      <div className="w-10 h-10 rounded-full bg-[#4edea3]/20 flex items-center justify-center mb-4">
        <Icon name="lightbulb" className="w-5 h-5 text-[#4edea3]" />
      </div>
      <h3 className="text-md font-semibold text-[#dde4dd] mb-2">Insight de Ahorro</h3>
      <p className="text-sm text-[#bbcabf] mb-4">Necesitamos más datos de tus gastos para generar sugerencias personalizadas de ahorro.</p>
      <button disabled className="w-full py-2 bg-[#1a211d] border border-[#3c4a42] rounded-lg text-sm font-medium text-[#bbcabf] opacity-50 cursor-not-allowed">
        Analizando datos...
      </button>
    </div>
    <div className={`${glassCard} p-6`}>
      <p className="text-[10px] uppercase font-bold text-[#bbcabf] mb-1">Categoría Mayor Gasto</p>
      <h3 className="text-lg font-semibold text-[#dde4dd] mb-2">Sin registros</h3>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-[#dde4dd]">0.00 €</span>
      </div>
    </div>
  </div>
);

const BottomCharts = ({ flowData, pieData }: { flowData: any[], pieData: any[] }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
    <div className={`${glassCard} p-6`}>
      <h3 className="text-lg font-semibold text-[#dde4dd] mb-6">Ingresos vs Gastos</h3>
      <div className="h-[200px] w-full">
        {flowData.length === 0 ? (
          <EmptyChartState message="No hay movimientos registrados este mes." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={flowData}>
              <Tooltip cursor={{ fill: '#1a211d' }} contentStyle={{ backgroundColor: '#161d19', borderColor: '#3c4a42' }} />
              <Bar dataKey="income" fill="#4edea3" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#ffb4ab" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
    <div className={`${glassCard} p-6 flex flex-col md:flex-row items-center`}>
      <div className="h-[200px] w-full md:w-1/2">
        {pieData.length === 0 ? (
          <EmptyChartState message="Sin desglose." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#161d19', borderColor: '#3c4a42' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="w-full md:w-1/2 md:pl-4 mt-6 md:mt-0">
        <h3 className="text-lg font-semibold text-[#dde4dd] mb-4 text-center md:text-left">División de Gastos</h3>
        {pieData.length === 0 ? (
          <p className="text-sm text-[#bbcabf] text-center md:text-left">Registra gastos para ver en qué categorías se va tu dinero.</p>
        ) : (
          <div className="space-y-3">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-[#bbcabf]">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-[#dde4dd]">{item.value}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

// --- Página Principal ---
export default function EstadisticasPage() {
  const [loading, setLoading] = useState(true);
  
  // Estados para los datos reales de la base de datos (inician vacíos)
  const [netWorthData, setNetWorthData] = useState([]);
  const [cashFlowData, setCashFlowData] = useState([]);
  const [spendingData, setSpendingData] = useState([]);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      // 1. Verificamos el usuario
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // 2. Aquí en el futuro haremos las consultas a Supabase
        // const { data } = await supabase.from('transacciones').select('*').eq('id_usuario', user.id);
        
        // Dejamos los arrays vacíos para que se muestre la interfaz de "Nuevo Usuario"
        setNetWorthData([]);
        setCashFlowData([]);
        setSpendingData([]);
      }
      
      setLoading(false);
    };

    fetchEstadisticas();
  }, []);

  if (loading) {
    return <div className="p-8 text-[#bbcabf]">Cargando estadísticas...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      <StatsHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <NetWorthChart data={netWorthData} />
        <InsightCards />
      </div>
      <BottomCharts flowData={cashFlowData} pieData={spendingData} />
    </div>
  );
}
