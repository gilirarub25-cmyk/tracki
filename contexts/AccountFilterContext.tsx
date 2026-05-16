// contexts/AccountFilterContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useModal } from "./ModalContext";

const STORAGE_KEY = "tracki-selected-account";

export type Cuenta = {
  id_cuenta: number;
  nombre: string;
  tipo: string;
  balance_inicial: number;
};

type AccountFilterContextValue = {
  // null = "todas las cuentas"
  selectedAccountId: number | null;
  setSelectedAccountId: (id: number | null) => void;
  cuentas: Cuenta[];
  loadingCuentas: boolean;
  // Devuelve la cuenta seleccionada o null si es "todas"
  selectedAccount: Cuenta | null;
};

const AccountFilterContext = createContext<AccountFilterContextValue>({
  selectedAccountId: null,
  setSelectedAccountId: () => {},
  cuentas: [],
  loadingCuentas: true,
  selectedAccount: null,
});

export const useAccountFilter = () => useContext(AccountFilterContext);

export function AccountFilterProvider({ children }: { children: ReactNode }) {
  const [selectedAccountId, setSelectedAccountIdRaw] = useState<number | null>(null);
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [loadingCuentas, setLoadingCuentas] = useState(true);
  const { refreshKey } = useModal();

  // Rehidratar la selección desde localStorage al montar (cliente)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && stored !== "null") {
        const id = Number(stored);
        if (!isNaN(id)) setSelectedAccountIdRaw(id);
      }
    } catch {
      // si localStorage no está disponible, ignoramos
    }
  }, []);

  // Cargar las cuentas del usuario (también cuando se cree/elimine una)
  useEffect(() => {
    const load = async () => {
      setLoadingCuentas(true);
      const { data } = await supabase
        .from("cuentas")
        .select("id_cuenta, nombre, tipo, balance_inicial")
        .order("creado_en", { ascending: true });

      const lista = (data as Cuenta[]) || [];
      setCuentas(lista);

      // Si la cuenta seleccionada ya no existe (fue borrada), resetear a "todas"
      if (selectedAccountId !== null && !lista.find((c) => c.id_cuenta === selectedAccountId)) {
        setSelectedAccountIdRaw(null);
        try { localStorage.setItem(STORAGE_KEY, "null"); } catch {}
      }

      setLoadingCuentas(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  // Setter que también persiste en localStorage
  const setSelectedAccountId = (id: number | null) => {
    setSelectedAccountIdRaw(id);
    try {
      localStorage.setItem(STORAGE_KEY, id === null ? "null" : String(id));
    } catch {}
  };

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
