/**
 * contexts/ModalContext.tsx
 * ---------------------------------------------------------------------------
 * Proveedor de contexto que centraliza la apertura de todos los modales de
 * la aplicación y propaga un mecanismo de refresco global. Aplica el patrón
 * Context API de React para evitar el "prop-drilling" entre componentes
 * profundamente anidados.
 *
 * Responsabilidades principales:
 *   1. Mantener el estado abierto/cerrado de cada modal del dashboard.
 *   2. Renderizar los modales en un único punto del árbol (al final del
 *      Provider) para garantizar que vivan por encima del resto de la UI.
 *   3. Exponer un contador `refreshKey` que, al incrementarse, notifica a
 *      las páginas suscritas que deben recargar sus datos (patrón Observer
 *      simplificado mediante `useEffect`).
 */
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import TransactionModal from "@/components/TransactionModal";
import AccountModal from "@/components/AccountModal";
import GoalModal from "@/components/GoalModal";
import AddProgressModal from "@/components/AddProgressModal";

/**
 * Contrato público del contexto consumido vía `useModal()`.
 */
type ModalContextValue = {
  /** Abre el modal de creación de transacciones. */
  openTransactionModal: () => void;
  /** Abre el modal de creación de cuentas. */
  openAccountModal: () => void;
  /** Abre el modal de objetivo. Si recibe `existing`, opera en modo edición. */
  openGoalModal: (existing?: any) => void;
  /** Abre el modal para añadir progreso al objetivo recibido. */
  openAddProgressModal: (goal: any) => void;
  /** Contador que se incrementa tras cada operación CRUD exitosa. */
  refreshKey: number;
  /** Permite a componentes externos forzar un refresco manual. */
  triggerRefresh: () => void;
};

/**
 * Valor por defecto del contexto. Sirve únicamente como fallback de tipos:
 * si algún componente consume el hook fuera del Provider, las funciones
 * son no-ops para evitar errores en runtime.
 */
const ModalContext = createContext<ModalContextValue>({
  openTransactionModal: () => {},
  openAccountModal: () => {},
  openGoalModal: () => {},
  openAddProgressModal: () => {},
  refreshKey: 0,
  triggerRefresh: () => {},
});

/**
 * Hook personalizado que expone el contexto. Se utiliza en cualquier
 * componente del árbol del dashboard para abrir modales o suscribirse
 * a los refrescos.
 */
export const useModal = () => useContext(ModalContext);

/**
 * Provider que envuelve la zona privada de la aplicación.
 *
 * @param children - Subárbol que tendrá acceso al contexto
 */
export function ModalProvider({ children }: { children: ReactNode }) {
  // Estado de visibilidad de cada modal
  const [txOpen, setTxOpen] = useState<boolean>(false);
  const [accOpen, setAccOpen] = useState<boolean>(false);
  const [goalOpen, setGoalOpen] = useState<boolean>(false);
  const [progressOpen, setProgressOpen] = useState<boolean>(false);

  // Datos auxiliares para los modales que operan sobre un registro existente
  const [editingGoal, setEditingGoal] = useState<any | null>(null);
  const [progressGoal, setProgressGoal] = useState<any | null>(null);

  /**
   * Contador monótonamente creciente. Las páginas que consumen el contexto
   * declaran `useEffect(() => { ... }, [refreshKey])` para volver a consultar
   * Supabase cuando este valor cambie.
   */
  const [refreshKey, setRefreshKey] = useState<number>(0);

  /** Incrementa el contador, disparando los efectos suscritos. */
  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  /* ─── Callbacks de éxito: cierran el modal y disparan refresco ─── */
  const onTransactionSuccess = () => {
    setTxOpen(false);
    triggerRefresh();
  };

  const onAccountSuccess = () => {
    setAccOpen(false);
    triggerRefresh();
  };

  const onGoalSuccess = () => {
    setGoalOpen(false);
    setEditingGoal(null);
    triggerRefresh();
  };

  const onProgressSuccess = () => {
    setProgressOpen(false);
    setProgressGoal(null);
    triggerRefresh();
  };

  return (
    <ModalContext.Provider
      value={{
        openTransactionModal: () => setTxOpen(true),
        openAccountModal: () => setAccOpen(true),
        openGoalModal: (existing) => {
          setEditingGoal(existing ?? null);
          setGoalOpen(true);
        },
        openAddProgressModal: (goal) => {
          setProgressGoal(goal);
          setProgressOpen(true);
        },
        refreshKey,
        triggerRefresh,
      }}
    >
      {children}

      {/*
        Modales renderizados como hermanos del subárbol. Estarán siempre
        montados pero solo se mostrarán cuando su prop `open` sea true.
      */}
      <TransactionModal
        open={txOpen}
        onClose={() => setTxOpen(false)}
        onSuccess={onTransactionSuccess}
        onRequestNewAccount={() => {
          // Permite encadenar la creación de una cuenta si el usuario aún
          // no tiene ninguna al intentar crear una transacción.
          setTxOpen(false);
          setAccOpen(true);
        }}
      />
      <AccountModal
        open={accOpen}
        onClose={() => setAccOpen(false)}
        onSuccess={onAccountSuccess}
      />
      <GoalModal
        open={goalOpen}
        onClose={() => {
          setGoalOpen(false);
          setEditingGoal(null);
        }}
        onSuccess={onGoalSuccess}
        editing={editingGoal}
      />
      <AddProgressModal
        open={progressOpen}
        goal={progressGoal}
        onClose={() => {
          setProgressOpen(false);
          setProgressGoal(null);
        }}
        onSuccess={onProgressSuccess}
      />
    </ModalContext.Provider>
  );
}
