// components/TransactionModal.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Modal from "./Modal";
import Icon from "./Icon";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onRequestNewAccount: () => void;
};

type Categoria = {
  id_categoria: number;
  nombre: string;
  tipo: "ingreso" | "gasto";
  icono: string;
  color: string;
};

type Cuenta = {
  id_cuenta: number;
  nombre: string;
  tipo: string;
};

export default function TransactionModal({
  open,
  onClose,
  onSuccess,
  onRequestNewAccount,
}: Props) {
  const [tipo, setTipo] = useState<"ingreso" | "gasto">("gasto");
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [idCategoria, setIdCategoria] = useState<number | null>(null);
  const [idCuenta, setIdCuenta] = useState<number | null>(null);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Cargar cuentas y categorías cuando se abre el modal
  useEffect(() => {
    if (!open) return;

    const loadOptions = async () => {
      const [catRes, cueRes] = await Promise.all([
        supabase.from("categorias").select("*").order("nombre"),
        supabase.from("cuentas").select("*").order("nombre"),
      ]);

      if (catRes.data) setCategorias(catRes.data);
      if (cueRes.data) {
        setCuentas(cueRes.data);
        if (cueRes.data.length > 0) {
          setIdCuenta(cueRes.data[0].id_cuenta);
        }
      }
    };

    loadOptions();
  }, [open]);

  // Resetear el formulario al abrir
  useEffect(() => {
    if (open) {
      setTipo("gasto");
      setMonto("");
      setDescripcion("");
      setFecha(new Date().toISOString().split("T")[0]);
      setIdCategoria(null);
      setSubmitError(null);
    }
  }, [open]);

  const categoriasFiltradas = categorias.filter((c) => c.tipo === tipo);

  useEffect(() => {
    setIdCategoria(null);
  }, [tipo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!idCategoria) {
      setSubmitError("Selecciona una categoría.");
      return;
    }
    if (!idCuenta) {
      setSubmitError("Selecciona una cuenta.");
      return;
    }
    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      setSubmitError("Introduce un monto válido.");
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSubmitError("Sesión no válida.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("transacciones").insert({
      monto: montoNum,
      descripcion: descripcion || null,
      fecha,
      tipo,
      id_cuenta: idCuenta,
      id_categoria: idCategoria,
      id_usuario: user.id,
    });

    setLoading(false);

    if (error) {
      setSubmitError("Error al crear la transacción: " + error.message);
      return;
    }

    onSuccess();
  };

  // Si no hay cuentas, mostrar pantalla informativa en lugar del formulario
  if (cuentas.length === 0 && open) {
    return (
      <Modal open={open} onClose={onClose} title="No tienes cuentas" subtitle="Necesitas al menos una cuenta para registrar transacciones">
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 bg-[#1a211d] rounded-full flex items-center justify-center mb-4 border border-[#3c4a42]">
            <Icon name="wallet" className="w-8 h-8 text-[#4edea3]" />
          </div>
          <p className="text-[#bbcabf] mb-6 max-w-sm">
            Antes de registrar gastos o ingresos, crea una cuenta donde llevar el control de tu dinero (banco, efectivo, tarjeta...).
          </p>
          <button
            onClick={onRequestNewAccount}
            className="bg-[#4edea3] hover:bg-[#6ffbbe] text-[#003824] px-6 py-3 rounded-lg font-bold transition-colors cursor-pointer"
            style={{ boxShadow: "0 0 20px rgba(78,222,163,0.2)" }}
          >
            Crear mi primera cuenta
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Nueva Transacción" subtitle="Registra un nuevo ingreso o gasto">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Tipo */}
        <div className="grid grid-cols-2 gap-2 bg-[#1a211d] p-1 rounded-lg border border-[#3c4a42]/40">
          <button
            type="button"
            onClick={() => setTipo("gasto")}
            className={`py-2.5 rounded-md text-sm font-semibold transition-colors cursor-pointer ${
              tipo === "gasto"
                ? "bg-[#ffb4ab]/15 text-[#ffb4ab] border border-[#ffb4ab]/30"
                : "text-[#bbcabf] hover:text-[#dde4dd]"
            }`}
          >
            Gasto
          </button>
          <button
            type="button"
            onClick={() => setTipo("ingreso")}
            className={`py-2.5 rounded-md text-sm font-semibold transition-colors cursor-pointer ${
              tipo === "ingreso"
                ? "bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/30"
                : "text-[#bbcabf] hover:text-[#dde4dd]"
            }`}
          >
            Ingreso
          </button>
        </div>

        {/* Monto */}
        <div className="space-y-2">
          <label className="block text-xs uppercase font-bold text-[#bbcabf] tracking-wider">Monto</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#86948a] text-base">€</span>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="0,00"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="w-full bg-[#1a211d] border border-[#3c4a42] rounded-lg py-3 pl-8 pr-4 text-base text-[#dde4dd] focus:border-[#4edea3] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <label className="block text-xs uppercase font-bold text-[#bbcabf] tracking-wider">
            Descripción <span className="text-[#86948a] normal-case font-normal">(opcional)</span>
          </label>
          <input
            type="text"
            placeholder="Ej: Compra supermercado"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full bg-[#1a211d] border border-[#3c4a42] rounded-lg py-3 px-4 text-base text-[#dde4dd] focus:border-[#4edea3] focus:outline-none transition-colors"
          />
        </div>

        {/* Categoría */}
        <div className="space-y-2">
          <label className="block text-xs uppercase font-bold text-[#bbcabf] tracking-wider">Categoría</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {categoriasFiltradas.map((cat) => {
              const isActive = idCategoria === cat.id_categoria;
              return (
                <button
                  key={cat.id_categoria}
                  type="button"
                  onClick={() => setIdCategoria(cat.id_categoria)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#4edea3]/10 border-[#4edea3] text-[#4edea3]"
                      : "bg-[#1a211d] border-[#3c4a42]/40 text-[#bbcabf] hover:border-[#3c4a42] hover:text-[#dde4dd]"
                  }`}
                  style={isActive ? { color: cat.color } : {}}
                >
                  <Icon name={cat.icono} className="w-5 h-5" />
                  <span className="text-[10px] font-medium text-center leading-tight">{cat.nombre}</span>
                </button>
              );
            })}
            {categoriasFiltradas.length === 0 && (
              <p className="col-span-full text-sm text-[#bbcabf] text-center py-4">No hay categorías disponibles.</p>
            )}
          </div>
        </div>

        {/* Cuenta + Fecha */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="block text-xs uppercase font-bold text-[#bbcabf] tracking-wider">Cuenta</label>
            <select
              value={idCuenta ?? ""}
              onChange={(e) => setIdCuenta(Number(e.target.value))}
              className="w-full bg-[#1a211d] border border-[#3c4a42] rounded-lg py-3 px-3 text-sm text-[#dde4dd] focus:border-[#4edea3] focus:outline-none transition-colors cursor-pointer"
            >
              {cuentas.map((c) => (
                <option key={c.id_cuenta} value={c.id_cuenta}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase font-bold text-[#bbcabf] tracking-wider">Fecha</label>
            <input
              type="date"
              required
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full bg-[#1a211d] border border-[#3c4a42] rounded-lg py-3 px-3 text-sm text-[#dde4dd] focus:border-[#4edea3] focus:outline-none transition-colors cursor-pointer"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onRequestNewAccount}
          className="text-xs text-[#4edea3] hover:text-[#6ffbbe] transition-colors cursor-pointer"
        >
          + Crear otra cuenta
        </button>

        {/* Error */}
        {submitError && (
          <div className="bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 text-[#ffb4ab] text-sm rounded-lg px-4 py-3">
            {submitError}
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
            style={{ boxShadow: "0 0 20px rgba(78,222,163,0.2)" }}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
