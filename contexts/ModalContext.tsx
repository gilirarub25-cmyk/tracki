// contexts/ModalContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import TransactionModal from "@/components/TransactionModal";
import AccountModal from "@/components/AccountModal";
import GoalModal from "@/components/GoalModal";

// El contexto expone:
// - openTransactionModal / openAccountModal / openGoalModal: abren los modales
// - refreshKey: número que cambia cada vez que se crea/edita/borra algo;
//   las páginas pueden usarlo como dependencia en su useEffect para refetch.
type ModalContextValue = {
  openTransactionModal: () => void;
  openAccountModal: () => void;
  openGoalModal: (existing?: any) => void; // pasa objeto si es editar
  refreshKey: number;
  triggerRefresh: () => void;
};

const ModalContext = createContext<ModalContextValue>({
  openTransactionModal: () => {},
  openAccountModal: () => {},
  openGoalModal: () => {},
  refreshKey: 0,
  triggerRefresh: () => {},
});

export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [txOpen, setTxOpen] = useState(false);
  const [accOpen, setAccOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  // Al cerrar tras éxito, refrescamos los datos del usuario
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

  return (
    <ModalContext.Provider
      value={{
        openTransactionModal: () => setTxOpen(true),
        openAccountModal: () => setAccOpen(true),
        openGoalModal: (existing) => {
          setEditingGoal(existing ?? null);
          setGoalOpen(true);
        },
        refreshKey,
        triggerRefresh,
      }}
    >
      {children}

      {/* Modales */}
      <TransactionModal
        open={txOpen}
        onClose={() => setTxOpen(false)}
        onSuccess={onTransactionSuccess}
        onRequestNewAccount={() => {
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
    </ModalContext.Provider>
  );
}
