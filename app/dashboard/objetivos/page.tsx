// app/dashboard/objetivos/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import Icon from "@/components/Icon";
import { useModal } from "@/contexts/ModalContext";

const glassCard = "bg-[#161d19] border border-[#3c4a42]/40 rounded-xl overflow-hidden";
const neonShadow = { boxShadow: "0 0 20px rgba(78,222,163,0.2)" };

const formatoEUR = (n: number) =>
  n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

type Objetivo = {
  id_objetivo: number;
  titulo: string;
  categoria: string | null;
  icono: string;
  monto_objetivo: number;
  monto_actual: number;
  fecha_objetivo: string | null;
  completado: boolean;
};

function GoalCard({
  goal,
  onEdit,
  onDelete,
  onAddProgress,
}: {
  goal: Objetivo;
  onEdit: () => void;
  onDelete: () => void;
  onAddProgress: () => void;
}) {
  const actual = Number(goal.monto_actual);
  const objetivo = Number(goal.monto_objetivo);
  const percent = objetivo > 0 ? Math.min(100, Math.round((actual / objetivo) * 100)) : 0;

  const fechaFormateada = goal.fecha_objetivo
    ? new Date(goal.fecha_objetivo).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className={`${glassCard} p-6 flex flex-col justify-between group relative`}>
      <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="p-1.5 rounded-md text-[#bbcabf] hover:text-[#dde4dd] hover:bg-[#1a211d] transition-colors cursor-pointer"
          aria-label="Editar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-md text-[#bbcabf] hover:text-[#ffb4ab] hover:bg-[#1a211d] transition-colors cursor-pointer"
          aria-label="Eliminar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
          </svg>
        </button>
      </div>

      <div className="flex items-start gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-[#1a211d] flex items-center justify-center border border-[#3c4a42] flex-shrink-0">
          <Icon name={goal.icono || "target"} className="w-6 h-6 text-[#4edea3]" />
        </div>
        <div className="min-w-0 pr-16">
          {goal.categoria && (
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#4edea3] bg-[#4edea3]/10 px-2 py-1 rounded-full mb-2 inline-block">
              {goal.categoria}
            </span>
          )}
          <h3 className="text-xl font-semibold text-[#dde4dd] truncate">{goal.titulo}</h3>
          {fechaFormateada && (
            <p className="text-xs text-[#7bd0ff] mt-1">Fecha objetivo: {fechaFormateada}</p>
          )}
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#bbcabf] mb-1">Ahorrado</p>
            <p className="text-2xl font-bold text-[#dde4dd]">
              {formatoEUR(actual)}{" "}
              <span className="text-sm text-[#bbcabf] font-normal">/ {formatoEUR(objetivo)}</span>
            </p>
          </div>
          <span className="text-lg font-bold text-[#4edea3]">{percent}%</span>
        </div>
        <div className="w-full h-2 bg-[#1a211d] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#4edea3] transition-all duration-500"
            style={{
              width: `${percent}%`,
              boxShadow: percent > 0 ? "0 0 10px rgba(78,222,163,0.5)" : undefined,
            }}
          />
        </div>

        <button
          onClick={onAddProgress}
          className="mt-4 w-full bg-[#1a211d] hover:bg-[#242c27] border border-[#3c4a42] text-[#dde4dd] py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          + Añadir progreso
        </button>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  iconColor = "text-[#4edea3]",
  highlight = false,
}: {
  label: string;
  value: string;
  icon: string;
  iconColor?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`${glassCard} p-5 flex items-center gap-4`}>
      <div className="w-12 h-12 rounded-xl bg-[#1a211d] flex items-center justify-center border border-[#3c4a42]">
        <Icon name={icon} className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-[#bbcabf] tracking-wider mb-1">{label}</p>
        <p className={`text-xl font-bold ${highlight ? "text-[#4edea3]" : "text-[#dde4dd]"}`}>{value}</p>
      </div>
    </div>
  );
}

export default function ObjetivosPage() {
  const [loading, setLoading] = useState(true);
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [ahorroMensual, setAhorroMensual] = useState(0);
  const { refreshKey, triggerRefresh, openGoalModal, openAddProgressModal } = useModal();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: goals } = await supabase
        .from("objetivos")
        .select("*")
        .order("creado_en", { ascending: false });

      setObjetivos((goals as Objetivo[]) || []);

      const now = new Date();
      const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];

      const { data: txMes } = await supabase
        .from("transacciones")
        .select("monto, tipo")
        .gte("fecha", inicioMes);

      if (txMes) {
        let ahorro = 0;
        txMes.forEach((t: any) => {
          if (t.tipo === "ingreso") ahorro += Number(t.monto);
          else ahorro -= Number(t.monto);
        });
        setAhorroMensual(ahorro);
      }

      setLoading(false);
    };

    fetchData();
  }, [refreshKey]);

  const { completados, progresoPromedio } = useMemo(() => {
    const comp = objetivos.filter((o) => o.completado).length;
    const prom =
      objetivos.length > 0
        ? Math.round(
            objetivos.reduce((sum, o) => {
              const p = Number(o.monto_objetivo) > 0
                ? (Number(o.monto_actual) / Number(o.monto_objetivo)) * 100
                : 0;
              return sum + Math.min(100, p);
            }, 0) / objetivos.length
          )
        : 0;
    return { completados: comp, progresoPromedio: prom };
  }, [objetivos]);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este objetivo?")) return;
    const { error } = await supabase.from("objetivos").delete().eq("id_objetivo", id);
    if (error) {
      alert("Error al eliminar: " + error.message);
      return;
    }
    triggerRefresh();
  };

  if (loading) {
    return <div className="p-8 text-[#bbcabf]">Cargando tus objetivos...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">

      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <p className="text-xs font-bold tracking-widest text-[#4edea3] uppercase mb-1">Ambiciones Financieras</p>
          <h1 className="text-3xl font-semibold text-[#dde4dd]">Objetivos de Ahorro</h1>
        </div>
        <button
          onClick={() => openGoalModal()}
          className="bg-[#4edea3] text-[#003824] px-6 py-3 rounded-lg font-bold flex items-center justify-center space-x-2 hover:bg-[#6ffbbe] transition-colors active:scale-95 cursor-pointer"
          style={neonShadow}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Crear Nuevo Objetivo</span>
        </button>
      </header>

      {objetivos.length === 0 ? (
        <div className={`${glassCard} flex flex-col items-center justify-center py-16 text-center`}>
          <div className="w-16 h-16 bg-[#1a211d] rounded-full flex items-center justify-center mb-4 border border-[#3c4a42]">
            <Icon name="target" className="w-8 h-8 text-[#4edea3]" />
          </div>
          <h3 className="text-xl font-semibold text-[#dde4dd] mb-2">Aún no tienes objetivos</h3>
          <p className="text-[#bbcabf] max-w-md mb-6">
            Crea tu primer objetivo financiero para empezar a trackear tu progreso.
          </p>
          <button
            onClick={() => openGoalModal()}
            className="bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/50 px-6 py-2 rounded-lg font-medium hover:bg-[#4edea3]/20 transition-colors cursor-pointer"
          >
            Crear mi primer objetivo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {objetivos.map((g) => (
            <GoalCard
              key={g.id_objetivo}
              goal={g}
              onEdit={() => openGoalModal(g)}
              onDelete={() => handleDelete(g.id_objetivo)}
              onAddProgress={() => openAddProgressModal(g)}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <MetricCard
          label="Ahorro Mensual"
          value={formatoEUR(ahorroMensual)}
          icon="money"
          iconColor={ahorroMensual >= 0 ? "text-[#4edea3]" : "text-[#ffb4ab]"}
          highlight={ahorroMensual > 0}
        />
        <MetricCard
          label="Progreso Promedio"
          value={`${progresoPromedio}%`}
          icon="trending-up"
          iconColor="text-[#4edea3]"
        />
        <MetricCard
          label="Objetivos Alcanzados"
          value={String(completados)}
          icon="trophy"
          iconColor="text-[#ffd6a5]"
        />
      </div>
    </div>
  );
}
