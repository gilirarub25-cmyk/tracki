// components/AddProgressModal.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Modal from "./Modal";
import Icon from "./Icon";

type Props = {
  open: boolean;
  goal: any | null;
  onClose: () => void;
  onSuccess: () => void;
};

const formatoEUR = (n: number) =>
  n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

export default function AddProgressModal({ open, goal, onClose, onSuccess }: Props) {
  const [cantidad, setCantidad] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setCantidad("");
      setError(null);
    }
  }, [open]);

  if (!goal) return null;

  const actual = Number(goal.monto_actual ?? 0);
  const objetivo = Number(goal.monto_objetivo ?? 0);
  const restante = Math.max(0, objetivo - actual);
  const percentActual = objetivo > 0 ? Math.min(100, Math.round((actual / objetivo) * 100)) : 0;

  // Previsualización del nuevo total
  const cantidadNum = parseFloat(cantidad.replace(",", ".")) || 0;
  const nuevoTotal = actual + cantidadNum;
  const percentNuevo = objetivo > 0 ? Math.min(100, Math.round((nuevoTotal / objetivo) * 100)) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (cantidadNum <= 0) {
      setError("Introduce una cantidad mayor que 0.");
      return;
    }

    setLoading(true);

    const completado = nuevoTotal >= objetivo;

    const { error: dbError } = await supabase
      .from("objetivos")
      .update({ monto_actual: nuevoTotal, completado })
      .eq("id_objetivo", goal.id_objetivo);

    setLoading(false);

    if (dbError) {
      setError("Error al actualizar: " + dbError.message);
      return;
    }

    onSuccess();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Añadir progreso"
      subtitle={goal.titulo}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Estado actual */}
        <div className="bg-[#1a211d] border border-[#3c4a42]/40 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#0e1511] flex items-center justify-center border border-[#3c4a42]">
              <Icon name={goal.icono || "target"} className="w-5 h-5 text-[#4edea3]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#bbcabf]">Ahorro actual</p>
              <p className="text-sm font-bold text-[#dde4dd]">
                {formatoEUR(actual)} <span className="font-normal text-[#bbcabf]">/ {formatoEUR(objetivo)}</span>
              </p>
            </div>
            <span className="text-sm font-bold text-[#4edea3]">{percentActual}%</span>
          </div>
          <div className="w-full h-2 bg-[#0e1511] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4edea3] transition-all"
              style={{ width: `${percentActual}%` }}
            />
          </div>
        </div>

        {/* Cantidad */}
        <div className="space-y-2">
          <label className="block text-xs uppercase font-bold text-[#bbcabf] tracking-wider">
            ¿Cuánto añades?
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#86948a] text-base">€</span>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              autoFocus
              placeholder="0,00"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="w-full bg-[#1a211d] border border-[#3c4a42] rounded-lg py-3 pl-8 pr-4 text-base text-[#dde4dd] focus:border-[#4edea3] focus:outline-none transition-colors"
            />
          </div>
          {restante > 0 && (
            <button
              type="button"
              onClick={() => setCantidad(String(restante))}
              className="text-xs text-[#4edea3] hover:text-[#6ffbbe] transition-colors cursor-pointer"
            >
              Completar objetivo ({formatoEUR(restante)})
            </button>
          )}
        </div>

        {/* Previsualización del nuevo total */}
        {cantidadNum > 0 && (
          <div className="bg-[#4edea3]/5 border border-[#4edea3]/20 rounded-lg p-4">
            <p className="text-xs text-[#bbcabf] mb-1">Nuevo total tras añadir</p>
            <p className="text-lg font-bold text-[#4edea3]">
              {formatoEUR(nuevoTotal)} <span className="text-sm font-normal text-[#bbcabf]">({percentNuevo}%)</span>
            </p>
            {nuevoTotal >= objetivo && (
              <p className="text-xs text-[#4edea3] mt-2 font-medium">🎉 ¡Vas a completar el objetivo!</p>
            )}
          </div>
        )}

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
            disabled={loading || cantidadNum <= 0}
            className="flex-1 bg-[#4edea3] hover:bg-[#6ffbbe] text-[#003824] py-3 rounded-lg font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Añadiendo..." : "Añadir progreso"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
