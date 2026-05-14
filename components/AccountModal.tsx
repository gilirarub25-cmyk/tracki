// components/AccountModal.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Modal from "./Modal";
import Icon from "./Icon";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const TIPOS_CUENTA = [
  { value: "banco",     label: "Banco",     icon: "bank"   },
  { value: "tarjeta",   label: "Tarjeta",   icon: "card"   },
  { value: "efectivo",  label: "Efectivo",  icon: "cash"   },
  { value: "ahorro",    label: "Ahorro",    icon: "wallet" },
];

export default function AccountModal({ open, onClose, onSuccess }: Props) {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("banco");
  const [balanceInicial, setBalanceInicial] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setNombre("");
      setTipo("banco");
      setBalanceInicial("0");
      setError(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nombre.trim()) {
      setError("Introduce un nombre para la cuenta.");
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Sesión no válida.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("cuentas").insert({
      nombre: nombre.trim(),
      tipo,
      balance_inicial: parseFloat(balanceInicial) || 0,
      id_usuario: user.id,
    });

    setLoading(false);

    if (insertError) {
      setError("Error al crear la cuenta: " + insertError.message);
      return;
    }

    onSuccess();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nueva Cuenta"
      subtitle="Crea una cuenta para organizar tu dinero"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nombre */}
        <div className="space-y-2">
          <label className="block text-xs uppercase font-bold text-[#bbcabf] tracking-wider">
            Nombre de la cuenta
          </label>
          <input
            type="text"
            required
            placeholder="Ej: Cuenta Nómina"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full bg-[#1a211d] border border-[#3c4a42] rounded-lg py-3 px-4 text-base text-[#dde4dd] focus:border-[#4edea3] focus:outline-none transition-colors"
          />
        </div>

        {/* Tipo */}
        <div className="space-y-2">
          <label className="block text-xs uppercase font-bold text-[#bbcabf] tracking-wider">
            Tipo de cuenta
          </label>
          <div className="grid grid-cols-4 gap-2">
            {TIPOS_CUENTA.map((t) => {
              const isActive = tipo === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTipo(t.value)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#4edea3]/10 border-[#4edea3] text-[#4edea3]"
                      : "bg-[#1a211d] border-[#3c4a42]/40 text-[#bbcabf] hover:border-[#3c4a42] hover:text-[#dde4dd]"
                  }`}
                >
                  <Icon name={t.icon} className="w-5 h-5" />
                  <span className="text-[11px] font-medium">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Balance inicial */}
        <div className="space-y-2">
          <label className="block text-xs uppercase font-bold text-[#bbcabf] tracking-wider">
            Balance inicial
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#86948a] text-base">€</span>
            <input
              type="number"
              step="0.01"
              placeholder="0,00"
              value={balanceInicial}
              onChange={(e) => setBalanceInicial(e.target.value)}
              className="w-full bg-[#1a211d] border border-[#3c4a42] rounded-lg py-3 pl-8 pr-4 text-base text-[#dde4dd] focus:border-[#4edea3] focus:outline-none transition-colors"
            />
          </div>
          <p className="text-xs text-[#86948a]">El dinero que ya tenías en esta cuenta antes de empezar a usar Tracki.</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 text-[#ffb4ab] text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-[#1a211d] hover:bg-[#242c27] border border-[#3c4a42] text-[#dde4dd] py-3 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#4edea3] hover:bg-[#6ffbbe] text-[#003824] py-3 rounded-lg font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Creando..." : "Crear cuenta"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
