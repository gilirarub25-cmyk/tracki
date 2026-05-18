/**
 * app/dashboard/page.tsx
 * ---------------------------------------------------------------------------
 * Vista principal del área privada. Presenta un resumen mensual de los
 * ingresos, gastos y balance del usuario, así como un listado de los cinco
 * movimientos más recientes.
 *
 * Las consultas a Supabase se filtran condicionalmente por la cuenta
 * seleccionada en el `AccountFilterContext`, lo que permite que el usuario
 * pase de una vista agregada ("Todas las cuentas") a una vista específica
 * sin abandonar la página.
 *
 * Marcado como Client Component porque consume hooks de estado (useState,
 * useEffect) y contextos personalizados.
 */
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Icon from "@/components/Icon";
import { useModal } from "@/contexts/ModalContext";
import { useAccountFilter } from "@/contexts/AccountFilterContext";

/**
 * Devuelve la clase Tailwind apropiada para colorear un importe según su
 * tipo o signo. Centraliza la lógica de color para mantener coherencia
 * visual en toda la aplicación.
 *
 * @param valor - Importe numérico a evaluar
 * @param tipo  - Categoría semántica del importe
 * @returns     Clase utilitaria de Tailwind con el color adecuado
 */
const colorPorValor = (
  valor: number,
  tipo: "ingreso" | "gasto" | "balance"
): string => {
  if (valor === 0) return "text-[#dde4dd]";
  if (tipo === "ingreso") return "text-[#4edea3]";
  if (tipo === "gasto") return "text-[#ffb4ab]";
  return valor > 0 ? "text-[#4edea3]" : "text-[#ffb4ab]";
};

/**
 * Formatea un número como cantidad monetaria en euros según la convención
 * local española (separador de miles con punto, decimales con coma).
 *
 * @param n - Importe numérico
 * @returns Cadena formateada (ej. "1.234,56 €")
 */
const formatoEUR = (n: number): string =>
  n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

/**
 * Forma de una transacción recuperada de Supabase con sus relaciones
 * (categoría y cuenta) ya resueltas mediante JOIN.
 */
type Transaccion = {
  id_transaccion: number;
  monto: number;
  descripcion: string | null;
  fecha: string;
  tipo: "ingreso" | "gasto";
  categoria: { nombre: string; icono: string; color: string } | null;
  cuenta: { nombre: string } | null;
};

/**
 * Componente principal del dashboard. Carga datos al montarse, recalcula
 * totales y renderiza la cabecera de KPIs junto a la tabla resumida de
 * los últimos movimientos.
 */
export default function DashboardIndex() {
  /** Nombre del usuario para personalizar la bienvenida. */
  const [userName, setUserName] = useState<string>("...");

  /** Estado de carga general de la página. */
  const [loading, setLoading] = useState<boolean>(true);

  /** Lista de las cinco últimas transacciones. */
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);

  /** Suma de ingresos del mes actual (filtrada por cuenta si aplica). */
  const [ingresosTotales, setIngresosTotales] = useState<number>(0);

  /** Suma de gastos del mes actual (filtrada por cuenta si aplica). */
  const [gastosTotales, setGastosTotales] = useState<number>(0);

  // Suscripción al contexto de modales: refreshKey actúa como dependencia
  // del useEffect; openTransactionModal se usa en el CTA de la cabecera.
  const { refreshKey, openTransactionModal } = useModal();

  // Filtro de cuenta seleccionado globalmente desde el navbar.
  const { selectedAccountId, selectedAccount } = useAccountFilter();

  /** Balance derivado: ingresos − gastos del mes en curso. */
  const balance = ingresosTotales - gastosTotales;

  /**
   * Efecto de carga: consulta el perfil del usuario y las transacciones
   * pertinentes cada vez que cambie `refreshKey` (operación CRUD reciente)
   * o `selectedAccountId` (cambio del filtro de cuenta).
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // 1. Recuperar el usuario autenticado actual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // 2. Recuperar el nombre del perfil público
      const { data: userData } = await supabase
        .from("usuarios")
        .select("nombre")
        .eq("id", user.id)
        .single();
      setUserName(
        userData?.nombre || user.email?.split("@")[0] || "Usuario"
      );

      // 3. Calcular el primer día del mes actual en formato ISO (YYYY-MM-DD)
      const now = new Date();
      const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];

      // 4. Consulta de totales del mes (filtrada por cuenta si procede)
      let queryMes = supabase
        .from("transacciones")
        .select("monto, tipo")
        .gte("fecha", inicioMes);
      if (selectedAccountId !== null) {
        queryMes = queryMes.eq("id_cuenta", selectedAccountId);
      }

      const { data: txMes } = await queryMes;

      // 5. Agregación cliente: separa ingresos y gastos
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

      // 6. Consulta de las cinco últimas transacciones con relaciones
      let queryUltimas = supabase
        .from("transacciones")
        .select(`
          id_transaccion, monto, descripcion, fecha, tipo,
          categoria:categorias(nombre, icono, color),
          cuenta:cuentas(nombre)
        `)
        .order("fecha", { ascending: false })
        .order("creado_en", { ascending: false })
        .limit(5);
      if (selectedAccountId !== null) {
        queryUltimas = queryUltimas.eq("id_cuenta", selectedAccountId);
      }

      const { data: ultimas } = await queryUltimas;
      setTransacciones((ultimas as any[]) || []);
      setLoading(false);
    };

    fetchData();
  }, [refreshKey, selectedAccountId]);

  /** Clase reutilizable para las tarjetas (cards) del dashboard. */
  const glassCard = "bg-[#161d19] border border-[#3c4a42]/40 rounded-xl p-6";

  if (loading) {
    return <div className="p-8 text-[#bbcabf]">Cargando tu panel...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">

      {/* Cabecera: saludo y CTA */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#dde4dd]">
            Hola, <span className="capitalize">{userName}</span>
          </h1>
          <p className="text-[#bbcabf] mt-1">
            {selectedAccount
              ? `Resumen de "${selectedAccount.nombre}" este mes.`
              : transacciones.length === 0
              ? "Aquí tienes tu resumen financiero, aún no tienes movimientos."
              : "Resumen de tu actividad financiera este mes."}
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

      {/* Sección de KPIs: ingresos, gastos y balance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={glassCard}>
          <p className="text-[10px] uppercase font-bold text-[#bbcabf] tracking-wider mb-2">
            Ingresos del mes
          </p>
          <h2 className={`text-3xl font-bold ${colorPorValor(ingresosTotales, "ingreso")}`}>
            {formatoEUR(ingresosTotales)}
          </h2>
        </div>
        <div className={glassCard}>
          <p className="text-[10px] uppercase font-bold text-[#bbcabf] tracking-wider mb-2">
            Gastos del mes
          </p>
          <h2 className={`text-3xl font-bold ${colorPorValor(gastosTotales, "gasto")}`}>
            {formatoEUR(gastosTotales)}
          </h2>
        </div>
        <div className={glassCard}>
          <p className="text-[10px] uppercase font-bold text-[#bbcabf] tracking-wider mb-2">
            Balance
          </p>
          <h2 className={`text-3xl font-bold ${colorPorValor(balance, "balance")}`}>
            {formatoEUR(balance)}
          </h2>
        </div>
      </div>

      {/* Sección: últimos movimientos */}
      <div className={glassCard}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#dde4dd] font-semibold">Últimos movimientos</h3>
          {transacciones.length > 0 && (
            <a
              href="/dashboard/transacciones"
              className="text-xs text-[#4edea3] hover:text-[#6ffbbe] transition-colors"
            >
              Ver todos →
            </a>
          )}
        </div>

        {transacciones.length === 0 ? (
          /* Estado vacío con call-to-action */
          <div className="flex flex-col items-center justify-center text-center py-12">
            <Icon name="wallet" className="w-10 h-10 text-[#3c4a42] mb-3" />
            <p className="text-[#bbcabf] text-sm mb-4">
              {selectedAccount
                ? "Esta cuenta aún no tiene movimientos."
                : "Tu historial está vacío."}
            </p>
            <button
              onClick={openTransactionModal}
              className="text-sm text-[#4edea3] hover:text-[#6ffbbe] transition-colors cursor-pointer"
            >
              + Crea tu primera transacción
            </button>
          </div>
        ) : (
          /* Lista de transacciones recientes */
          <div className="space-y-2">
            {transacciones.map((tx) => {
              const isIngreso = tx.tipo === "ingreso";
              const iconName =
                tx.categoria?.icono || (isIngreso ? "income" : "expense");
              return (
                <div
                  key={tx.id_transaccion}
                  className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-[#1a211d]/50 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-xl bg-[#1a211d] flex items-center justify-center border border-[#3c4a42] flex-shrink-0"
                    style={{
                      color:
                        tx.categoria?.color ||
                        (isIngreso ? "#4edea3" : "#ffb4ab"),
                    }}
                  >
                    <Icon name={iconName} className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#dde4dd] truncate">
                      {tx.descripcion || tx.categoria?.nombre || "Sin descripción"}
                    </p>
                    <p className="text-xs text-[#bbcabf]">
                      {tx.categoria?.nombre} ·{" "}
                      {new Date(tx.fecha).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <p
                    className={`text-sm font-bold flex-shrink-0 ${
                      isIngreso ? "text-[#4edea3]" : "text-[#ffb4ab]"
                    }`}
                  >
                    {isIngreso ? "+" : "-"}
                    {formatoEUR(Number(tx.monto))}
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
