// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Icon from "@/components/Icon";
import { useModal } from "@/contexts/ModalContext";

// Helpers
const colorPorValor = (valor: number, tipo: "ingreso" | "gasto" | "balance"): string => {
  if (valor === 0) return "text-[#dde4dd]";
  if (tipo === "ingreso") return "text-[#4edea3]";
  if (tipo === "gasto") return "text-[#ffb4ab]";
  return valor > 0 ? "text-[#4edea3]" : "text-[#ffb4ab]";
};

const formatoEUR = (n: number) =>
  n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

type Transaccion = {
  id_transaccion: number;
  monto: number;
  descripcion: string | null;
  fecha: string;
  tipo: "ingreso" | "gasto";
  categoria: { nombre: string; icono: string; color: string } | null;
  cuenta: { nombre: string } | null;
};

export default function DashboardIndex() {
  const [userName, setUserName] = useState<string>("...");
  const [loading, setLoading] = useState(true);
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [ingresosTotales, setIngresosTotales] = useState(0);
  const [gastosTotales, setGastosTotales] = useState(0);
  const { refreshKey, openTransactionModal } = useModal();

  const balance = ingresosTotales - gastosTotales;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Nombre del user (desde la tabla usuarios)
      const { data: userData } = await supabase
        .from("usuarios")
        .select("nombre")
        .eq("id", user.id)
        .single();
      setUserName(userData?.nombre || user.email?.split("@")[0] || "Usuario");

      // Mes actual
      const now = new Date();
      const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];

      // Transacciones del mes (para totales)
      const { data: txMes } = await supabase
        .from("transacciones")
        .select("monto, tipo")
        .gte("fecha", inicioMes);

      if (txMes) {
        let ing = 0;
        let gas = 0;
        txMes.forEach((t: any) => {
          if (t.tipo === "ingreso") ing += Number(t.monto);
          else gas += Number(t.monto);
        });
        setIngresosTotales(ing);
        setGastosTotales(gas);
      }

      // Últimas 5 transacciones (con JOIN)
      const { data: ultimas } = await supabase
        .from("transacciones")
        .select(`
          id_transaccion, monto, descripcion, fecha, tipo,
          categoria:categorias(nombre, icono, color),
          cuenta:cuentas(nombre)
        `)
        .order("fecha", { ascending: false })
        .order("creado_en", { ascending: false })
        .limit(5);

      setTransacciones((ultimas as any[]) || []);
      setLoading(false);
    };

    fetchData();
  }, [refreshKey]);

  const glassCard = "bg-[#161d19] border border-[#3c4a42]/40 rounded-xl p-6";

  if (loading) {
    return <div className="p-8 text-[#bbcabf]">Cargando tu panel...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">

      {/* Cabecera */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#dde4dd]">
            Hola, <span className="capitalize">{userName}</span>
          </h1>
          <p className="text-[#bbcabf] mt-1">
            {transacciones.length === 0
              ? "Aquí tienes tu resumen financiero, aún no tienes movimientos."
              : `Resumen de tu actividad financiera este mes.`}
          </p>
        </div>
        <button
          onClick={openTransactionModal}
          className="hidden md:flex items-center gap-2 bg-[#4edea3] hover:bg-[#6ffbbe] text-[#003824] px-5 py-2.5 rounded-lg font-bold transition-colors cursor-pointer"
          style={{ boxShadow: "0 0 20px rgba(78,222,163,0.2)" }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Transacción
        </button>
      </header>

      {/* Tarjetas Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={glassCard}>
          <p className="text-[10px] uppercase font-bold text-[#bbcabf] tracking-wider mb-2">Ingresos del mes</p>
          <h2 className={`text-3xl font-bold ${colorPorValor(ingresosTotales, "ingreso")}`}>
            {formatoEUR(ingresosTotales)}
          </h2>
        </div>
        <div className={glassCard}>
          <p className="text-[10px] uppercase font-bold text-[#bbcabf] tracking-wider mb-2">Gastos del mes</p>
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

      {/* Últimos movimientos */}
      <div className={`${glassCard}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#dde4dd] font-semibold">Últimos movimientos</h3>
          {transacciones.length > 0 && (
            <a href="/dashboard/transacciones" className="text-xs text-[#4edea3] hover:text-[#6ffbbe] transition-colors">
              Ver todos →
            </a>
          )}
        </div>

        {transacciones.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <Icon name="wallet" className="w-10 h-10 text-[#3c4a42] mb-3" />
            <p className="text-[#bbcabf] text-sm mb-4">Tu historial está vacío.</p>
            <button
              onClick={openTransactionModal}
              className="text-sm text-[#4edea3] hover:text-[#6ffbbe] transition-colors cursor-pointer"
            >
              + Crea tu primera transacción
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {transacciones.map((tx) => {
              const isIngreso = tx.tipo === "ingreso";
              const iconName = tx.categoria?.icono || (isIngreso ? "income" : "expense");
              return (
                <div
                  key={tx.id_transaccion}
                  className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-[#1a211d]/50 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-xl bg-[#1a211d] flex items-center justify-center border border-[#3c4a42] flex-shrink-0"
                    style={{ color: tx.categoria?.color || (isIngreso ? "#4edea3" : "#ffb4ab") }}
                  >
                    <Icon name={iconName} className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#dde4dd] truncate">
                      {tx.descripcion || tx.categoria?.nombre || "Sin descripción"}
                    </p>
                    <p className="text-xs text-[#bbcabf]">
                      {tx.categoria?.nombre} · {new Date(tx.fecha).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <p className={`text-sm font-bold flex-shrink-0 ${isIngreso ? "text-[#4edea3]" : "text-[#ffb4ab]"}`}>
                    {isIngreso ? "+" : "-"}{formatoEUR(Number(tx.monto))}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
