// contexts/ModalContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import TransactionModal from "@/components/TransactionModal";
import AccountModal from "@/components/AccountModal";
import GoalModal from "@/components/GoalModal";
import AddProgressModal from "@/components/AddProgressModal";

type ModalContextValue = {
  openTransactionModal: () => void;
  openAccountModal: () => void;
  openGoalModal: (existing?: any) => void;
  openAddProgressModal: (goal: any) => void;
  refreshKey: number;
  triggerRefresh: () => void;
};

const ModalContext = createContext<ModalContextValue>({
  openTransactionModal: () => {},
  openAccountModal: () => {},
  openGoalModal: () => {},
  openAddProgressModal: () => {},
  refreshKey: 0,
  triggerRefresh: () => {},
});

export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [txOpen, setTxOpen] = useState(false);
  const [accOpen, setAccOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any | null>(null);
  const [progressOpen, setProgressOpen] = useState(false);
  const [progressGoal, setProgressGoal] = useState<any | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey((k) => k + 1);

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
