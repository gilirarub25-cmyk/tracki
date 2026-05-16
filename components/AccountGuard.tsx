// components/AccountGuard.tsx
"use client";

import { usePathname } from "next/navigation";
import Icon from "./Icon";
import { useModal } from "@/contexts/ModalContext";
import { useAccountFilter } from "@/contexts/AccountFilterContext";

// Bloquea el dashboard si el usuario no tiene NINGUNA cuenta.
// Excepción: la ruta /dashboard/cuentas siempre es accesible
// (es donde se crea la primera cuenta).
export default function AccountGuard({ children }: { children: React.ReactNode }) {
  const { cuentas, loadingCuentas } = useAccountFilter();
  const { openAccountModal } = useModal();
  const pathname = usePathname();

  const exenta = pathname === "/dashboard/cuentas";

  // Carga inicial
  if (loadingCuentas) {
    return (
      <div className="flex-grow flex items-center justify-center p-8 text-[#bbcabf]">
        Cargando...
      </div>
    );
  }

  // Si está en /dashboard/cuentas, no bloqueamos
  if (exenta) return <>{children}</>;

  // Sin cuentas → onboarding obligatorio
  if (cuentas.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-[#161d19] border border-[#3c4a42]/40 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-[#1a211d] rounded-full flex items-center justify-center mb-6 border border-[#3c4a42] mx-auto">
            <Icon name="wallet" className="w-10 h-10 text-[#4edea3]" />
          </div>
          <h2 className="text-2xl font-bold text-[#dde4dd] mb-3">¡Bienvenido a Tracki!</h2>
          <p className="text-[#bbcabf] mb-8 leading-relaxed">
            Antes de empezar, necesitas crear al menos una cuenta donde llevar el control de tus ingresos y gastos. Puede ser tu cuenta bancaria, efectivo, tarjeta o ahorros.
          </p>
          <button
            onClick={openAccountModal}
            className="bg-[#4edea3] hover:bg-[#6ffbbe] text-[#003824] px-8 py-3 rounded-lg font-bold transition-colors cursor-pointer w-full"
            style={{ boxShadow: "0 0 20px rgba(78,222,163,0.2)" }}
          >
            Crear mi primera cuenta
          </button>
          <p className="text-xs text-[#86948a] mt-4">Solo te llevará unos segundos.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
