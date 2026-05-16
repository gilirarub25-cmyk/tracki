// components/AccountSelector.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useAccountFilter } from "@/contexts/AccountFilterContext";
import Icon from "./Icon";

const iconoPorTipo = (tipo: string): string => {
  switch (tipo) {
    case "banco": return "bank";
    case "tarjeta": return "card";
    case "efectivo": return "cash";
    case "ahorro": return "wallet";
    default: return "wallet";
  }
};

export default function AccountSelector() {
  const { selectedAccountId, setSelectedAccountId, cuentas, selectedAccount } = useAccountFilter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (cuentas.length === 0) return null;

  const label = selectedAccount ? selectedAccount.nombre : "Todas las cuentas";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-[#1a211d] hover:bg-[#242c27] border border-[#3c4a42] text-[#dde4dd] px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer max-w-[180px]"
      >
        <Icon
          name={selectedAccount ? iconoPorTipo(selectedAccount.tipo) : "wallet"}
          className="w-4 h-4 text-[#4edea3] flex-shrink-0"
        />
        <span className="truncate">{label}</span>
        <svg
          className={`w-4 h-4 text-[#bbcabf] flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 w-64 bg-[#161d19] border border-[#3c4a42]/60 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-2 max-h-80 overflow-y-auto">
            {/* Opción "todas" */}
            <button
              onClick={() => {
                setSelectedAccountId(null);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                selectedAccountId === null
                  ? "bg-[#4edea3]/10 text-[#4edea3]"
                  : "text-[#dde4dd] hover:bg-[#1a211d]"
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-[#1a211d] flex items-center justify-center border border-[#3c4a42] flex-shrink-0">
                <Icon name="wallet" className="w-4 h-4" />
              </div>
              <span className="flex-1 text-left font-medium">Todas las cuentas</span>
              {selectedAccountId === null && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            <div className="my-1 border-t border-[#3c4a42]/40" />

            {/* Cuentas */}
            {cuentas.map((c) => {
              const isActive = selectedAccountId === c.id_cuenta;
              return (
                <button
                  key={c.id_cuenta}
                  onClick={() => {
                    setSelectedAccountId(c.id_cuenta);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#4edea3]/10 text-[#4edea3]"
                      : "text-[#dde4dd] hover:bg-[#1a211d]"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#1a211d] flex items-center justify-center border border-[#3c4a42] flex-shrink-0">
                    <Icon name={iconoPorTipo(c.tipo)} className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium truncate">{c.nombre}</p>
                    <p className="text-xs text-[#bbcabf] capitalize">{c.tipo}</p>
                  </div>
                  {isActive && (
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
