// app/dashboard/cuentas/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import Icon from "@/components/Icon";
import { useModal } from "@/contexts/ModalContext";

const glassCard = "bg-[#161d19] border border-[#3c4a42]/40 rounded-xl";

const formatoEUR = (n: number) =>
  n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

type Cuenta = {
  id_cuenta: number;
  nombre: string;
  tipo: string;
  balance_inicial: number;
  creado_en: string;
};

// Mapeo tipo → icono
const iconoPorTipo = (tipo: string): string => {
  switch (tipo) {
    case "banco": return "bank";
    case "tarjeta": return "card";
    case "efectivo": return "cash";
    case "ahorro": return "wallet";
    default: return "wallet";
  }
};

const etiquetaTipo = (tipo: string): string => {
  switch (tipo) {
    case "banco": return "Banco";
    case "tarjeta": return "Tarjeta";
    case "efectivo": return "Efectivo";
    case "ahorro": return "Ahorro";
    default: return tipo;
  }
};

export default function CuentasPage() {
  const [loading, setLoading] = useState(true);
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  // Balance actual de cada cuenta (balance_inicial + ingresos - gastos)
  const [balances, setBalances] = useState<Record<number, number>>({});
  const { refreshKey, triggerRefresh, openAccountModal } = useModal();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // 1. Cuentas
      const { data: cuentasData } = await supabase
        .from("cuentas")
        .select("*")
        .order("creado_en", { ascending: true });

      const lista = (cuentasData as Cuenta[]) || [];
      setCuentas(lista);

      // 2. Calcular balance actual por cuenta (todas las transacciones)
      const { data: txData } = await supabase
        .from("transacciones")
        .select("id_cuenta, monto, tipo");

      const acumulado: Record<number, number> = {};
      lista.forEach((c) => {
        acumulado[c.id_cuenta] = Number(c.balance_inicial);
      });
      (txData || []).forEach((t: any) => {
        const id = t.id_cuenta;
        if (acumulado[id] === undefined) return;
        if (t.tipo === "ingreso") acumulado[id] += Number(t.monto);
        else acumulado[id] -= Number(t.monto);
      });
      setBalances(acumulado);

      setLoading(false);
    };

    fetchData();
  }, [refreshKey]);

  // Balance total de todas las cuentas
  const balanceTotal = useMemo(
    () => Object.values(balances).reduce((sum, v) => sum + v, 0),
    [balances]
  );

  // Eliminar cuenta (solo si no tiene transacciones)
  const handleDelete = async (cuenta: Cuenta) => {
    // Comprobar si tiene transacciones
    const { count } = await supabase
      .from("transacciones")
      .select("id_transaccion", { count: "exact", head: true })
      .eq("id_cuenta", cuenta.id_cuenta);

    if ((count ?? 0) > 0) {
      alert(
        `No puedes eliminar "${cuenta.nombre}" porque tiene ${count} transacciones asociadas. Elimina primero esas transacciones o muévelas a otra cuenta.`
      );
      return;
    }

    if (!confirm(`¿Eliminar la cuenta "${cuenta.nombre}"?`)) return;

    const { error } = await supabase
      .from("cuentas")
      .delete()
      .eq("id_cuenta", cuenta.id_cuenta);

    if (error) {
      alert("Error al eliminar: " + error.message);
      return;
    }
    triggerRefresh();
  };

  if (loading) {
    return <div className="p-8 text-[#bbcabf]">Cargando tus cuentas...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">

      {/* Cabecera */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <p className="text-xs font-bold tracking-widest text-[#4edea3] uppercase mb-1">Tu Dinero</p>
          <h1 className="text-3xl font-semibold text-[#dde4dd]">Cuentas</h1>
        </div>
        <button
          onClick={openAccountModal}
          className="bg-[#4edea3] text-[#003824] px-6 py-3 rounded-lg font-bold flex items-center justify-center space-x-2 hover:bg-[#6ffbbe] transition-colors active:scale-95 cursor-pointer"
          style={{ boxShadow: "0 0 20px rgba(78,222,163,0.2)" }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Nueva Cuenta</span>
        </button>
      </header>

      {/* Resumen total */}
      {cuentas.length > 0 && (
        <div className={`${glassCard} p-6 relative overflow-hidden`}>
          <div className="absolute right-[-30px] top-[-30px] w-40 h-40 bg-[#4edea3]/5 rounded-full blur-2xl" />
          <p className="text-[10px] uppercase font-bold text-[#bbcabf] tracking-wider mb-2 relative z-10">Balance total</p>
          <h2 className={`text-4xl font-bold relative z-10 ${balanceTotal >= 0 ? "text-[#4edea3]" : "text-[#ffb4ab]"}`}>
            {formatoEUR(balanceTotal)}
          </h2>
          <p className="text-xs text-[#bbcabf] mt-2 relative z-10">
            Suma de {cuentas.length} {cuentas.length === 1 ? "cuenta" : "cuentas"}
          </p>
        </div>
      )}

      {/* Lista de cuentas */}
      {cuentas.length === 0 ? (
        <div className={`${glassCard} flex flex-col items-center justify-center py-16 text-center`}>
          <div className="w-16 h-16 bg-[#1a211d] rounded-full flex items-center justify-center mb-4 border border-[#3c4a42]">
            <Icon name="wallet" className="w-8 h-8 text-[#4edea3]" />
          </div>
          <h3 className="text-xl font-semibold text-[#dde4dd] mb-2">Aún no tienes cuentas</h3>
          <p className="text-[#bbcabf] max-w-md mb-6">
            Crea tu primera cuenta para empezar a gestionar tus ingresos y gastos.
          </p>
          <button
            onClick={openAccountModal}
            className="bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/50 px-6 py-2 rounded-lg font-medium hover:bg-[#4edea3]/20 transition-colors cursor-pointer"
          >
            Crear mi primera cuenta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cuentas.map((c) => {
            const balance = balances[c.id_cuenta] ?? Number(c.balance_inicial);
            const diferencia = balance - Number(c.balance_inicial);
            return (
              <div
                key={c.id_cuenta}
                className={`${glassCard} p-6 group relative`}
              >
                {/* Botón eliminar */}
                <button
                  onClick={() => handleDelete(c)}
                  className="absolute top-4 right-4 p-1.5 rounded-md text-[#bbcabf] hover:text-[#ffb4ab] hover:bg-[#1a211d] transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  aria-label="Eliminar cuenta"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                  </svg>
                </button>

                {/* Cabecera */}
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#1a211d] flex items-center justify-center border border-[#3c4a42]">
                    <Icon name={iconoPorTipo(c.tipo)} className="w-6 h-6 text-[#4edea3]" />
                  </div>
                  <div className="min-w-0 pr-6">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#4edea3] bg-[#4edea3]/10 px-2 py-1 rounded-full mb-2 inline-block">
                      {etiquetaTipo(c.tipo)}
                    </span>
                    <h3 className="text-lg font-semibold text-[#dde4dd] truncate">{c.nombre}</h3>
                  </div>
                </div>

                {/* Balance actual */}
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-[#bbcabf] tracking-wider">Balance actual</p>
                  <p className={`text-2xl font-bold ${balance >= 0 ? "text-[#dde4dd]" : "text-[#ffb4ab]"}`}>
                    {formatoEUR(balance)}
                  </p>
                  <div className="flex justify-between text-xs text-[#bbcabf] pt-2 border-t border-[#3c4a42]/30">
                    <span>Inicial: {formatoEUR(Number(c.balance_inicial))}</span>
                    <span className={diferencia >= 0 ? "text-[#4edea3]" : "text-[#ffb4ab]"}>
                      {diferencia >= 0 ? "+" : ""}{formatoEUR(diferencia)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
