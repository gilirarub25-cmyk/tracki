"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Icon from "@/components/Icon";

// Helper: color del balance según valor y tipo
// - Si el valor es 0, devuelve blanco neutro
// - Si es 'ingreso' y > 0 → verde
// - Si es 'gasto' y > 0 → rojo
// - Si es 'balance', verde si positivo, rojo si negativo
const colorPorValor = (
  valor: number,
  tipo: "ingreso" | "gasto" | "balance"
): string => {
  if (valor === 0) return "text-[#dde4dd]";
  if (tipo === "ingreso") return "text-[#4edea3]";
  if (tipo === "gasto") return "text-[#ffb4ab]";
  return valor > 0 ? "text-[#4edea3]" : "text-[#ffb4ab]";
};

const formatoEUR = (n: number) =>
  n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

export default function DashboardIndex() {
  const [userName, setUserName] = useState<string>("...");
  const [loading, setLoading] = useState(true);

  // Estados para nuestros datos reales (ahora vacíos)
  const [transacciones, setTransacciones] = useState([]);
  const [ingresosTotales, setIngresosTotales] = useState(0);
  const [gastosTotales, setGastosTotales] = useState(0);

  // Balance derivado
  const balance = ingresosTotales - gastosTotales;

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.email?.split("@")[0] || "Usuario");
      }

      // Aquí haremos las consultas a Supabase más adelante
      // const { data } = await supabase.from('transacciones').select('*');

      setLoading(false);
    };

    fetchData();
  }, []);

  const glassCard = "bg-[#161d19] border border-[#3c4a42]/40 rounded-xl p-6";

  if (loading) {
    return <div className="p-8 text-[#bbcabf]">Cargando tu panel...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">

      {/* Cabecera dinámica */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-[#dde4dd]">
          Hola, <span className="capitalize">{userName}</span>
        </h1>
        <p className="text-[#bbcabf] mt-1">
          Aquí tienes tu resumen financiero, aún no tienes movimientos.
        </p>
      </header>

      {/* Tarjetas Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={glassCard}>
          <p className="text-[10px] uppercase font-bold text-[#bbcabf] tracking-wider mb-2">Ingresos</p>
          <h2 className={`text-3xl font-bold ${colorPorValor(ingresosTotales, "ingreso")}`}>
            {formatoEUR(ingresosTotales)}
          </h2>
        </div>
        <div className={glassCard}>
          <p className="text-[10px] uppercase font-bold text-[#bbcabf] tracking-wider mb-2">Gastos</p>
          <h2 className={`text-3xl font-bold ${colorPorValor(gastosTotales, "gasto")}`}>
            {formatoEUR(gastosTotales)}
          </h2>
        </div>
        <div className={glassCard}>
          <p className="text-[10px] uppercase font-bold text-[#bbcabf] tracking-wider mb-2">Balance</p>
          <h2 className={`text-3xl font-bold ${colorPorValor(balance, "balance")}`}>
            {formatoEUR(balance)}
          </h2>
        </div>
      </div>

      {/* Zonas preparadas para los gráficos y tablas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Gráfico (Ocupa 2 columnas) */}
        <div className={`${glassCard} lg:col-span-2 min-h-[300px] flex flex-col items-center justify-center text-center`}>
          <svg className="w-16 h-16 text-[#3c4a42] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          <h3 className="text-[#dde4dd] font-medium">Aún no hay datos para el gráfico</h3>
          <p className="text-[#bbcabf] text-sm mt-1">Añade tu primera transacción para ver estadísticas.</p>
        </div>

        {/* Últimos movimientos */}
        <div className={`${glassCard} flex flex-col`}>
          <h3 className="text-[#dde4dd] font-semibold mb-4">Últimos movimientos</h3>

          {transacciones.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <Icon name="wallet" className="w-10 h-10 text-[#3c4a42] mb-3" />
              <p className="text-[#bbcabf] text-sm">Tu historial está vacío.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Aquí mapearemos las transacciones de Supabase */}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
