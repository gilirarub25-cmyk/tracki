// components/GoalModal.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Modal from "./Modal";
import Icon, { ICONOS_OBJETIVO } from "./Icon";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editing?: any | null; // si viene, modo edición
};

export default function GoalModal({ open, onClose, onSuccess, editing }: Props) {
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [icono, setIcono] = useState("target");
  const [montoObjetivo, setMontoObjetivo] = useState("");
  const [montoActual, setMontoActual] = useState("0");
  const [fechaObjetivo, setFechaObjetivo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!editing;

  useEffect(() => {
    if (open) {
      if (editing) {
        setTitulo(editing.titulo ?? "");
        setCategoria(editing.categoria ?? "");
        setIcono(editing.icono ?? "target");
        setMontoObjetivo(String(editing.monto_objetivo ?? ""));
        setMontoActual(String(editing.monto_actual ?? 0));
        setFechaObjetivo(editing.fecha_objetivo ?? "");
      } else {
        setTitulo("");
        setCategoria("");
        setIcono("target");
        setMontoObjetivo("");
        setMontoActual("0");
        setFechaObjetivo("");
      }
      setError(null);
    }
  }, [open, editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!titulo.trim()) {
      setError("Introduce un título para el objetivo.");
      return;
    }
    const objetivoNum = parseFloat(montoObjetivo);
    if (isNaN(objetivoNum) || objetivoNum <= 0) {
      setError("Introduce un monto objetivo válido.");
      return;
    }
    const actualNum = parseFloat(montoActual) || 0;

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Sesión no válida.");
      setLoading(false);
      return;
    }

    const payload = {
      titulo: titulo.trim(),
      categoria: categoria.trim() || null,
      icono,
      monto_objetivo: objetivoNum,
      monto_actual: actualNum,
      fecha_objetivo: fechaObjetivo || null,
      completado: actualNum >= objetivoNum,
      id_usuario: user.id,
    };

    const { error: dbError } = isEditing
      ? await supabase.from("objetivos").update(payload).eq("id_objetivo", editing.id_objetivo)
      : await supabase.from("objetivos").insert(payload);

    setLoading(false);

    if (dbError) {
      setError("Error al guardar: " + dbError.message);
      return;
    }

    onSuccess();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Editar Objetivo" : "Nuevo Objetivo"}
      subtitle={isEditing ? "Actualiza tu objetivo de ahorro" : "Define una nueva meta de ahorro"}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Título */}
        <div className="space-y-2">
          <label className="block text-xs uppercase font-bold text-[#bbcabf] tracking-wider">Título</label>
          <input
            type="text"
            required
            placeholder="Ej: Comprar un coche"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full bg-[#1a211d] border border-[#3c4a42] rounded-lg py-3 px-4 text-base text-[#dde4dd] focus:border-[#4edea3] focus:outline-none transition-colors"
          />
        </div>

        {/* Categoría */}
        <div className="space-y-2">
          <label className="block text-xs uppercase font-bold text-[#bbcabf] tracking-wider">
            Categoría <span className="text-[#86948a] normal-case font-normal">(opcional)</span>
          </label>
          <input
            type="text"
            placeholder="Ej: Transporte, Viajes, Casa..."
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full bg-[#1a211d] border border-[#3c4a42] rounded-lg py-3 px-4 text-base text-[#dde4dd] focus:border-[#4edea3] focus:outline-none transition-colors"
          />
        </div>

        {/* Icono */}
        <div className="space-y-2">
          <label className="block text-xs uppercase font-bold text-[#bbcabf] tracking-wider">Icono</label>
          <div className="grid grid-cols-4 gap-2">
            {ICONOS_OBJETIVO.map((ic) => {
              const isActive = icono === ic;
              return (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcono(ic)}
                  className={`flex items-center justify-center py-3 rounded-lg border transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#4edea3]/10 border-[#4edea3] text-[#4edea3]"
                      : "bg-[#1a211d] border-[#3c4a42]/40 text-[#bbcabf] hover:border-[#3c4a42] hover:text-[#dde4dd]"
                  }`}
                >
                  <Icon name={ic} className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Montos */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="block text-xs uppercase font-bold text-[#bbcabf] tracking-wider">Objetivo</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#86948a]">€</span>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0,00"
                value={montoObjetivo}
                onChange={(e) => setMontoObjetivo(e.target.value)}
                className="w-full bg-[#1a211d] border border-[#3c4a42] rounded-lg py-3 pl-8 pr-4 text-base text-[#dde4dd] focus:border-[#4edea3] focus:outline-none transition-colors"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs uppercase font-bold text-[#bbcabf] tracking-wider">Ahorrado</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#86948a]">€</span>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={montoActual}
                onChange={(e) => setMontoActual(e.target.value)}
                className="w-full bg-[#1a211d] border border-[#3c4a42] rounded-lg py-3 pl-8 pr-4 text-base text-[#dde4dd] focus:border-[#4edea3] focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Fecha objetivo */}
        <div className="space-y-2">
          <label className="block text-xs uppercase font-bold text-[#bbcabf] tracking-wider">
            Fecha objetivo <span className="text-[#86948a] normal-case font-normal">(opcional)</span>
          </label>
          <input
            type="date"
            value={fechaObjetivo}
            onChange={(e) => setFechaObjetivo(e.target.value)}
            className="w-full bg-[#1a211d] border border-[#3c4a42] rounded-lg py-3 px-3 text-sm text-[#dde4dd] focus:border-[#4edea3] focus:outline-none transition-colors cursor-pointer"
          />
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
            {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear objetivo"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
