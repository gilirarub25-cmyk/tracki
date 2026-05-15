// app/dashboard/estadisticas/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart, Area, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, XAxis,
} from "recharts";
import { supabase } from "@/lib/supabase";
import Icon from "@/components/Icon";
import { useModal } from "@/contexts/ModalContext";

const glassCard = "bg-[#161d19] border border-[#3c4a42]/40 rounded-xl";

const formatoEUR = (n: number) =>
  n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

// Nombres de mes en español, formato corto y capitalizado
const MESES_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

// Etiqueta legible para el eje X: "May 2026" (no "may 26")
const etiquetaMes = (fechaIso: string): string => {
  const d = new Date(fechaIso);
  return `${MESES_ES[d.getMonth()]} ${d.getFullYear()}`;
};

type Periodo = "mensual" | "trimestral" | "anual";

type TxRaw = {
  monto: number;
  fecha: string;
  tipo: "ingreso" | "gasto";
  categoria: { nombre: string; icono: string; color: string } | null;
};

const COLORES_CHART = ["#4edea3", "#7bd0ff", "#ffb4ab", "#ffd6a5", "#c8a6ff", "#86948a", "#6ffbbe", "#3c4a42"];

const EmptyChartState = ({ message }: { message: string }) => (
  <div className="w-full h-full flex flex-col items-center justify-center text-center min-h-[200px]">
    <svg className="w-12 h-12 text-[#3c4a42] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
    <p className="text-[#bbcabf] text-sm">{message}</p>
  </div>
);

export default function EstadisticasPage() {
  const [loading, setLoading] = useState(true);
  const [transacciones, setTransacciones] = useState<TxRaw[]>([]);
  const [periodo, setPeriodo] = useState<Periodo>("mensual");
  const { refreshKey } = useModal();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const now = new Date();
      let desde: string | null = null;
      if (periodo === "mensual") {
        const d = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        desde = d.toISOString().split("T")[0];
      } else if (periodo === "trimestral") {
        const d = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        desde = d.toISOString().split("T")[0];
      } else {
        const d = new Date(now.getFullYear() - 2, 0, 1);
        desde = d.toISOString().split("T")[0];
      }

      let query = supabase
        .from("transacciones")
        .select(`
          monto, fecha, tipo,
          categoria:categorias(nombre, icono, color)
        `)
        .order("fecha", { ascending: true });

      if (desde) query = query.gte("fecha", desde);

      const { data } = await query;
      setTransacciones((data as any[]) || []);
      setLoading(false);
    };

    fetchData();
  }, [refreshKey, periodo]);

  // Agrupar por mes (clave YYYY-MM, valor: { mes, ingresos, gastos })
  const datosPorMes = useMemo(() => {
    const map = new Map<string, { mes: string; ingresos: number; gastos: number }>();

    transacciones.forEach((t) => {
      const d = new Date(t.fecha);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = `${MESES_ES[d.getMonth()]} ${d.getFullYear()}`;
      const cur = map.get(key) || { mes: label, ingresos: 0, gastos: 0 };
      if (t.tipo === "ingreso") cur.ingresos += Number(t.monto);
      else cur.gastos += Number(t.monto);
      map.set(key, cur);
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);
  }, [transacciones]);

  // Evolución del balance acumulado
  const evolucionBalance = useMemo(() => {
    let acumulado = 0;
    return datosPorMes.map((m) => {
      acumulado += m.ingresos - m.gastos;
      return { mes: m.mes, value: acumulado };
    });
  }, [datosPorMes]);

  // Gastos por categoría
  const gastosPorCategoria = useMemo(() => {
    const map = new Map<string, { nombre: string; valor: number; color: string }>();
    transacciones.filter((t) => t.tipo === "gasto").forEach((t) => {
      const nombre = t.categoria?.nombre || "Sin categoría";
      const color = t.categoria?.color || "#86948a";
      const cur = map.get(nombre) || { nombre, valor: 0, color };
      cur.valor += Number(t.monto);
      map.set(nombre, cur);
    });
    const total = Array.from(map.values()).reduce((s, c) => s + c.valor, 0);
    return Array.from(map.values())
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 8)
      .map((c, i) => ({
        name: c.nombre,
        value: total > 0 ? Math.round((c.valor / total) * 100) : 0,
        montoBruto: c.valor,
        color: c.color || COLORES_CHART[i % COLORES_CHART.length],
      }));
  }, [transacciones]);

  const balanceTotal = evolucionBalance.length > 0 ? evolucionBalance[evolucionBalance.length - 1].value : 0;
  const mayorGasto = gastosPorCategoria[0];

  if (loading) {
    return <div className="p-8 text-[#bbcabf]">Cargando estadísticas...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">

      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <p className="text-xs font-bold tracking-widest text-[#4edea3] uppercase mb-1">Analíticas de Rendimiento</p>
          <h1 className="text-3xl font-semibold text-[#dde4dd]">Tus Estadísticas</h1>
        </div>
        <div className="flex bg-[#1a211d] p-1 rounded-lg border border-[#3c4a42]/40">
          {(["mensual", "trimestral", "anual"] as Periodo[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize cursor-pointer ${
                periodo === p ? "bg-[#4edea3] text-[#003824]" : "text-[#bbcabf] hover:text-[#dde4dd]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className={`${glassCard} p-6 lg:col-span-2 flex flex-col`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#dde4dd]">Evolución del Balance</h3>
              <p className="text-xs text-[#bbcabf] font-medium">Calculado según tus ingresos y gastos</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-[#bbcabf]">Balance Total</p>
              <p className={`text-2xl font-bold ${balanceTotal >= 0 ? "text-[#dde4dd]" : "text-[#ffb4ab]"}`}>{formatoEUR(balanceTotal)}</p>
            </div>
          </div>
          <div className="h-[250px] w-full flex-1">
            {evolucionBalance.length === 0 ? (
              <EmptyChartState message="Añade transacciones para ver la evolución de tu dinero." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={evolucionBalance} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4edea3" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4edea3" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="mes" tick={{ fill: "#bbcabf", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#161d19", borderColor: "#3c4a42", color: "#dde4dd", borderRadius: 8 }}
                    formatter={(v: any) => [formatoEUR(Number(v)), "Balance"]}
                    labelStyle={{ color: "#dde4dd" }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#4edea3" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={`${glassCard} p-6 flex-1 flex flex-col justify-center`}>
            <div className="w-10 h-10 rounded-full bg-[#4edea3]/20 flex items-center justify-center mb-4">
              <Icon name="lightbulb" className="w-5 h-5 text-[#4edea3]" />
            </div>
            <h3 className="text-md font-semibold text-[#dde4dd] mb-2">Insight de Ahorro</h3>
            {transacciones.length === 0 ? (
              <p className="text-sm text-[#bbcabf]">Necesitamos más datos para generar sugerencias personalizadas.</p>
            ) : balanceTotal >= 0 ? (
              <p className="text-sm text-[#bbcabf]">¡Vas bien! Has ahorrado <span className="text-[#4edea3] font-bold">{formatoEUR(balanceTotal)}</span> en el periodo seleccionado.</p>
            ) : (
              <p className="text-sm text-[#bbcabf]">Atención: estás gastando más de lo que ingresas. Revisa tus categorías con mayor gasto.</p>
            )}
          </div>
          <div className={`${glassCard} p-6`}>
            <p className="text-[10px] uppercase font-bold text-[#bbcabf] mb-1">Categoría Mayor Gasto</p>
            <h3 className="text-lg font-semibold text-[#dde4dd] mb-2">{mayorGasto?.name || "Sin registros"}</h3>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-[#ffb4ab]">{formatoEUR(mayorGasto?.montoBruto || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className={`${glassCard} p-6`}>
          <h3 className="text-lg font-semibold text-[#dde4dd] mb-6">Ingresos vs Gastos</h3>
          <div className="h-[220px] w-full">
            {datosPorMes.length === 0 ? (
              <EmptyChartState message="No hay movimientos en este periodo." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosPorMes}>
                  <XAxis dataKey="mes" tick={{ fill: "#bbcabf", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "#1a211d" }}
                    contentStyle={{ backgroundColor: "#161d19", borderColor: "#3c4a42", color: "#dde4dd", borderRadius: 8 }}
                    formatter={(v: any, name: string) => [formatoEUR(Number(v)), name === "ingresos" ? "Ingresos" : "Gastos"]}
                  />
                  <Bar dataKey="ingresos" fill="#4edea3" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="gastos" fill="#ffb4ab" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className={`${glassCard} p-6 flex flex-col md:flex-row items-center`}>
          <div className="h-[220px] w-full md:w-1/2">
            {gastosPorCategoria.length === 0 ? (
              <EmptyChartState message="Sin desglose de gastos." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={gastosPorCategoria} innerRadius={55} outerRadius={85} paddingAngle={5} dataKey="value" stroke="none">
                    {gastosPorCategoria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#161d19", borderColor: "#3c4a42", color: "#dde4dd", borderRadius: 8 }}
                    formatter={(v: any) => [`${v}%`, "Porcentaje"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="w-full md:w-1/2 md:pl-4 mt-6 md:mt-0">
            <h3 className="text-lg font-semibold text-[#dde4dd] mb-4 text-center md:text-left">División de Gastos</h3>
            {gastosPorCategoria.length === 0 ? (
              <p className="text-sm text-[#bbcabf] text-center md:text-left">Registra gastos para ver el desglose.</p>
            ) : (
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2">
                {gastosPorCategoria.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-[#bbcabf] truncate">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-[#dde4dd] flex-shrink-0">{item.value}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
