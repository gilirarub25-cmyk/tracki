// app/dashboard/transacciones/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import Icon from "@/components/Icon";
import { useModal } from "@/contexts/ModalContext";
import { useAccountFilter } from "@/contexts/AccountFilterContext";

const glassCard = "bg-[#161d19] border border-[#3c4a42]/40 rounded-xl";

const colorPorValor = (valor: number, tipo: "ingreso" | "gasto" | "balance"): string => {
  if (valor === 0) return "text-[#dde4dd]";
  if (tipo === "ingreso") return "text-[#4edea3]";
  if (tipo === "gasto") return "text-[#ffb4ab]";
  return valor > 0 ? "text-[#4edea3]" : "text-[#ffb4ab]";
};

const formatoEUR = (n: number) =>
  n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

type Tx = {
  id_transaccion: number;
  monto: number;
  descripcion: string | null;
  fecha: string;
  tipo: "ingreso" | "gasto";
  categoria: { nombre: string; icono: string; color: string } | null;
  cuenta: { nombre: string } | null;
};

type Periodo = "mes" | "30d" | "anio" | "todo";
type FiltroTipo = "todos" | "ingreso" | "gasto";

export default function TransaccionesPage() {
  const [loading, setLoading] = useState(true);
  const [transacciones, setTransacciones] = useState<Tx[]>([]);
  const [balanceInicial, setBalanceInicial] = useState(0);
  const [periodo, setPeriodo] = useState<Periodo>("mes");
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("todos");
  const { refreshKey, triggerRefresh, openTransactionModal } = useModal();
  const { selectedAccountId, selectedAccount } = useAccountFilter();

  useEffect(() => {
    const fetchTx = async () => {
      setLoading(true);

      let query = supabase
        .from("transacciones")
        .select(`
          id_transaccion, monto, descripcion, fecha, tipo,
          categoria:categorias(nombre, icono, color),
          cuenta:cuentas(nombre)
        `)
        .order("fecha", { ascending: false })
        .order("creado_en", { ascending: false });

      // Periodo
      const now = new Date();
      if (periodo === "mes") {
        const inicio = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
        query = query.gte("fecha", inicio);
      } else if (periodo === "30d") {
        const hace30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        query = query.gte("fecha", hace30);
      } else if (periodo === "anio") {
        const inicioAnio = new Date(now.getFullYear(), 0, 1).toISOString().split("T")[0];
        query = query.gte("fecha", inicioAnio);
      }

      // Tipo
      if (filtroTipo !== "todos") query = query.eq("tipo", filtroTipo);

      // Cuenta seleccionada
      if (selectedAccountId !== null) query = query.eq("id_cuenta", selectedAccountId);

      const { data } = await query;
      setTransacciones((data as any[]) || []);

      // Sumar balance_inicial de las cuentas filtradas al ahorro neto.
      let queryCuentas = supabase.from("cuentas").select("balance_inicial");
      if (selectedAccountId !== null) queryCuentas = queryCuentas.eq("id_cuenta", selectedAccountId);
      const { data: cuentasData } = await queryCuentas;
      setBalanceInicial(
        (cuentasData || []).reduce((s: number, c: any) => s + Number(c.balance_inicial), 0)
      );

      setLoading(false);
    };

    fetchTx();
  }, [refreshKey, periodo, filtroTipo, selectedAccountId]);

  const { ingresos, gastos, ahorro, tasa } = useMemo(() => {
    let ing = 0;
    let gas = 0;
    transacciones.forEach((t) => {
      if (t.tipo === "ingreso") ing += Number(t.monto);
      else gas += Number(t.monto);
    });
    const a = balanceInicial + ing - gas;
    const t = (balanceInicial + ing) > 0 ? Math.round((a / (balanceInicial + ing)) * 100) : 0;
    return { ingresos: ing, gastos: gas, ahorro: a, tasa: t };
  }, [transacciones, balanceInicial]);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta transacción?")) return;
    const { error } = await supabase.from("transacciones").delete().eq("id_transaccion", id);
    if (error) {
      alert("Error al eliminar: " + error.message);
      return;
    }
    triggerRefresh();
  };

  const handleExport = () => {
    if (transacciones.length === 0) return;
    const headers = ["Fecha", "Tipo", "Categoría", "Cuenta", "Descripción", "Monto"];
    const rows = transacciones.map((t) => [
      t.fecha,
      t.tipo,
      t.categoria?.nombre || "",
      t.cuenta?.nombre || "",
      (t.descripcion || "").replace(/[",\n]/g, " "),
      String(t.monto),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tracki-transacciones-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="p-8 text-[#bbcabf]">Cargando tu historial...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-bold tracking-widest text-[#4edea3] uppercase mb-1">Historial Detallado</p>
          <h1 className="text-3xl font-semibold text-[#dde4dd]">
            {selectedAccount ? selectedAccount.nombre : "Movimientos Financieros"}
          </h1>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className={`${glassCard} p-6`}>
          <p className="text-[10px] uppercase font-bold text-[#bbcabf] mb-2 flex justify-between items-center">
            <span>Ingresos del periodo</span>
            <Icon name="trending-up" className="w-4 h-4 text-[#4edea3]" />
          </p>
          <h2 className={`text-3xl font-bold ${colorPorValor(ingresos, "ingreso")}`}>{formatoEUR(ingresos)}</h2>
          <p className="text-xs text-[#bbcabf] mt-2">{transacciones.filter(t => t.tipo === "ingreso").length} movimientos</p>
        </div>
        <div className={`${glassCard} p-6`}>
          <p className="text-[10px] uppercase font-bold text-[#bbcabf] mb-2 flex justify-between items-center">
            <span>Gastos del periodo</span>
            <Icon name="trending-down" className="w-4 h-4 text-[#ffb4ab]" />
          </p>
          <h2 className={`text-3xl font-bold ${colorPorValor(gastos, "gasto")}`}>{formatoEUR(gastos)}</h2>
          <p className="text-xs text-[#bbcabf] mt-2">{transacciones.filter(t => t.tipo === "gasto").length} movimientos</p>
        </div>
        <div className={`${glassCard} p-6 relative overflow-hidden`}>
          <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-[#4edea3]/5 rounded-full blur-xl" />
          <p className="text-[10px] uppercase font-bold text-[#bbcabf] mb-2 relative z-10">Ahorro Neto</p>
          <h2 className={`text-3xl font-bold relative z-10 ${colorPorValor(ahorro, "balance")}`}>{formatoEUR(ahorro)}</h2>
          <p className="text-xs text-[#bbcabf] mt-2 relative z-10">Tasa de ahorro: {tasa}%</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex gap-4 w-full sm:w-auto">
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value as Periodo)}
            className="bg-[#1a211d] border border-[#3c4a42] text-[#dde4dd] text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-[#4edea3] cursor-pointer"
          >
            <option value="mes">Este Mes</option>
            <option value="30d">Últimos 30 Días</option>
            <option value="anio">Este Año</option>
            <option value="todo">Todo el historial</option>
          </select>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as FiltroTipo)}
            className="bg-[#1a211d] border border-[#3c4a42] text-[#dde4dd] text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-[#4edea3] cursor-pointer"
          >
            <option value="todos">Todos los tipos</option>
            <option value="ingreso">Solo ingresos</option>
            <option value="gasto">Solo gastos</option>
          </select>
        </div>
        <button
          onClick={handleExport}
          disabled={transacciones.length === 0}
          className="w-full sm:w-auto bg-[#1a211d] hover:bg-[#242c27] border border-[#3c4a42] text-[#dde4dd] px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Icon name="download" className="w-4 h-4" /> Exportar CSV
        </button>
      </div>

      <div className={`${glassCard} p-6 mb-6`}>
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-sm font-semibold text-[#dde4dd]">Movimientos Recientes</h3>
          <span className="text-xs text-[#bbcabf]">{transacciones.length} {transacciones.length === 1 ? "transacción" : "transacciones"}</span>
        </div>

        {transacciones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-[#1a211d] rounded-full flex items-center justify-center mb-4 border border-[#3c4a42]">
              <Icon name="wallet" className="w-7 h-7 text-[#bbcabf]" />
            </div>
            <h3 className="text-xl font-semibold text-[#dde4dd] mb-2">No hay movimientos</h3>
            <p className="text-[#bbcabf] max-w-md mb-6">No hay transacciones que coincidan con los filtros. Prueba cambiar el periodo o crea una nueva.</p>
            <button
              onClick={openTransactionModal}
              className="bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/50 px-6 py-2 rounded-lg font-medium hover:bg-[#4edea3]/20 transition-colors cursor-pointer"
            >
              Crear transacción
            </button>
          </div>
        ) : (
          <>
            <div className="hidden sm:grid grid-cols-12 gap-4 pb-2 border-b border-[#3c4a42]/40 text-[10px] uppercase font-bold text-[#bbcabf] px-2 mt-4">
              <div className="col-span-5">Movimiento</div>
              <div className="col-span-2">Categoría</div>
              <div className="col-span-2">Fecha</div>
              <div className="col-span-2 text-right">Cantidad</div>
              <div className="col-span-1"></div>
            </div>

            <div className="flex flex-col mt-2">
              {transacciones.map((tx) => {
                const isIngreso = tx.tipo === "ingreso";
                const iconName = tx.categoria?.icono || (isIngreso ? "income" : "expense");
                return (
                  <div
                    key={tx.id_transaccion}
                    className="group grid grid-cols-12 gap-4 py-4 border-b border-[#3c4a42]/40 items-center hover:bg-[#1a211d]/50 transition-colors px-2 rounded-lg -mx-2"
                  >
                    <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl bg-[#1a211d] flex items-center justify-center border border-[#3c4a42] flex-shrink-0"
                        style={{ color: tx.categoria?.color || (isIngreso ? "#4edea3" : "#ffb4ab") }}
                      >
                        <Icon name={iconName} className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#dde4dd] truncate">
                          {tx.descripcion || tx.categoria?.nombre || "Sin descripción"}
                        </p>
                        <p className="text-xs text-[#bbcabf] truncate">{tx.cuenta?.nombre || "Sin cuenta"}</p>
                      </div>
                    </div>
                    <div className="hidden sm:block sm:col-span-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#4edea3] bg-[#4edea3]/10 px-2 py-1 rounded-full border border-[#4edea3]/20">
                        {tx.categoria?.nombre || "—"}
                      </span>
                    </div>
                    <div className="hidden sm:block sm:col-span-2 text-sm text-[#bbcabf]">
                      {new Date(tx.fecha).toLocaleDateString("es-ES")}
                    </div>
                    <div className={`col-span-5 sm:col-span-2 text-right font-bold text-sm ${isIngreso ? "text-[#4edea3]" : "text-[#ffb4ab]"}`}>
                      {isIngreso ? "+" : "-"}{formatoEUR(Number(tx.monto))}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button
                        onClick={() => handleDelete(tx.id_transaccion)}
                        className="text-[#bbcabf] hover:text-[#ffb4ab] transition-colors opacity-0 group-hover:opacity-100 cursor-pointer p-1"
                        aria-label="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
