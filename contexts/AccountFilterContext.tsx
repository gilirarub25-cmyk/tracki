/**
 * contexts/AccountFilterContext.tsx
 * ---------------------------------------------------------------------------
 * Proveedor de contexto encargado de gestionar la cuenta bancaria
 * actualmente seleccionada por el usuario en el selector global del Navbar.
 * El estado se persiste en `localStorage` para que la selección sobreviva
 * a recargas del navegador.
 *
 * Las páginas de dashboard, transacciones y estadísticas consumen este
 * contexto para aplicar el filtro `id_cuenta = selectedAccountId` a sus
 * consultas a Supabase. Si el valor es `null`, se interpreta como
 * "todas las cuentas" y no se aplica filtro alguno.
 */
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useModal } from "./ModalContext";

/** Clave bajo la que se persiste la cuenta seleccionada en localStorage. */
const STORAGE_KEY = "tracki-selected-account";

/**
 * Tipo público que describe una cuenta del usuario. Refleja los campos
 * realmente leídos en la aplicación, no la fila completa de la BBDD.
 */
export type Cuenta = {
  id_cuenta: number;
  nombre: string;
  tipo: string;
  balance_inicial: number;
};

/** Contrato público del contexto consumido vía `useAccountFilter()`. */
type AccountFilterContextValue = {
  /** ID de la cuenta seleccionada; `null` significa "todas las cuentas". */
  selectedAccountId: number | null;
  /** Permite cambiar la selección y persistirla automáticamente. */
  setSelectedAccountId: (id: number | null) => void;
  /** Listado de cuentas del usuario autenticado. */
  cuentas: Cuenta[];
  /** Indica si la consulta inicial de cuentas todavía está pendiente. */
  loadingCuentas: boolean;
  /** Referencia directa al objeto Cuenta seleccionado (o null si "todas"). */
  selectedAccount: Cuenta | null;
};

const AccountFilterContext = createContext<AccountFilterContextValue>({
  selectedAccountId: null,
  setSelectedAccountId: () => {},
  cuentas: [],
  loadingCuentas: true,
  selectedAccount: null,
});

/** Hook personalizado de acceso al contexto. */
export const useAccountFilter = () => useContext(AccountFilterContext);

/**
 * Provider que sincroniza el estado de selección con la base de datos
 * y con localStorage. Debe ser un descendiente de `ModalProvider`, ya que
 * depende de `refreshKey` para recargar la lista de cuentas cuando se
 * crea o elimina alguna.
 */
export function AccountFilterProvider({ children }: { children: ReactNode }) {
  // Estado interno (raw) vs setter público con efectos colaterales
  const [selectedAccountId, setSelectedAccountIdRaw] = useState<number | null>(null);
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [loadingCuentas, setLoadingCuentas] = useState<boolean>(true);

  // Suscripción al refresco global para recargar cuentas tras un CRUD
  const { refreshKey } = useModal();

  /**
   * Efecto de rehidratación: al montarse en cliente, lee la última
   * selección guardada en localStorage. Se ejecuta una sola vez.
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && stored !== "null") {
        const id = Number(stored);
        if (!isNaN(id)) setSelectedAccountIdRaw(id);
      }
    } catch {
      // localStorage puede no estar disponible (SSR, navegación privada);
      // en ese caso se ignora silenciosamente y se mantiene el valor inicial.
    }
  }, []);

  /**
   * Efecto de carga: consulta las cuentas del usuario en Supabase cada vez
   * que `refreshKey` cambie. También valida que la cuenta previamente
   * seleccionada siga existiendo; si fue eliminada, se reinicia a "todas".
   */
  useEffect(() => {
    const load = async () => {
      setLoadingCuentas(true);

      const { data } = await supabase
        .from("cuentas")
        .select("id_cuenta, nombre, tipo, balance_inicial")
        .order("creado_en", { ascending: true });

      const lista = (data as Cuenta[]) || [];
      setCuentas(lista);

      // Validación: la cuenta seleccionada debe seguir existiendo
      if (
        selectedAccountId !== null &&
        !lista.find((c) => c.id_cuenta === selectedAccountId)
      ) {
        setSelectedAccountIdRaw(null);
        try {
          localStorage.setItem(STORAGE_KEY, "null");
        } catch {}
      }

      setLoadingCuentas(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  /**
   * Setter público que actualiza el estado y persiste el valor en
   * localStorage en una sola operación.
   *
   * @param id - Nuevo ID de cuenta o null para "todas"
   */
  const setSelectedAccountId = (id: number | null) => {
    setSelectedAccountIdRaw(id);
    try {
      localStorage.setItem(STORAGE_KEY, id === null ? "null" : String(id));
    } catch {}
  };

  /**
   * Valor derivado: objeto completo de la cuenta seleccionada. Calculado en
   * cada render a partir de `selectedAccountId` y el array `cuentas`.
   */
  const selectedAccount =
    selectedAccountId !== null
      ? cuentas.find((c) => c.id_cuenta === selectedAccountId) ?? null
      : null;

  return (
    <AccountFilterContext.Provider
      value={{
        selectedAccountId,
        setSelectedAccountId,
        cuentas,
        loadingCuentas,
        selectedAccount,
      }}
    >
      {children}
    </AccountFilterContext.Provider>
  );
}
