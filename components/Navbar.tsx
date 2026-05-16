// components/Navbar.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Icon from "./Icon";
import AccountSelector from "./AccountSelector";
import { useModal } from "@/contexts/ModalContext";

// ─── Logo SVG ────────────────────────────────────────────────
const Logo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={`${className} text-[#4edea3]`} fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 3h2v18H3V3zm6 8h2v10H9V11zm6-5h2v15h-2V6zm6 4h2v11h-2V10z" />
  </svg>
);

// ─── Hook click-outside ──────────────────────────────────────
function useClickOutside(ref: React.RefObject<HTMLElement | null>, onOutside: () => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutside, enabled]);
}

// ─── Dropdown: Búsqueda ──────────────────────────────────────
function SearchDropdown() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useClickOutside(ref, () => setOpen(false), open);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  // Búsqueda con debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      const { data } = await supabase
        .from("transacciones")
        .select(`
          id_transaccion, monto, descripcion, fecha, tipo,
          categoria:categorias(nombre, icono, color)
        `)
        .ilike("descripcion", `%${query.trim()}%`)
        .order("fecha", { ascending: false })
        .limit(8);
      setResults((data as any[]) || []);
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-[#bbcabf] hover:text-[#dde4dd] transition-colors cursor-pointer p-2 rounded-lg hover:bg-[#1a211d]"
        aria-label="Buscar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-[#161d19] border border-[#3c4a42]/60 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-3 border-b border-[#3c4a42]/40">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86948a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar transacciones..."
                className="w-full bg-[#1a211d] border border-[#3c4a42] rounded-lg py-2 pl-9 pr-3 text-sm text-[#dde4dd] focus:border-[#4edea3] focus:outline-none transition-colors"
              />
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {!query.trim() ? (
              <p className="text-sm text-[#86948a] text-center py-8 px-3">Escribe para buscar...</p>
            ) : loading ? (
              <p className="text-sm text-[#86948a] text-center py-8 px-3">Buscando...</p>
            ) : results.length === 0 ? (
              <p className="text-sm text-[#86948a] text-center py-8 px-3">Sin resultados para "{query}"</p>
            ) : (
              <div className="p-2">
                {results.map((tx) => {
                  const isIngreso = tx.tipo === "ingreso";
                  return (
                    <Link
                      key={tx.id_transaccion}
                      href="/dashboard/transacciones"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-[#1a211d] transition-colors"
                    >
                      <div
                        className="w-8 h-8 rounded-lg bg-[#1a211d] flex items-center justify-center border border-[#3c4a42] flex-shrink-0"
                        style={{ color: tx.categoria?.color || (isIngreso ? "#4edea3" : "#ffb4ab") }}
                      >
                        <Icon name={tx.categoria?.icono || (isIngreso ? "income" : "expense")} className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#dde4dd] truncate">
                          {tx.descripcion || tx.categoria?.nombre || "Sin descripción"}
                        </p>
                        <p className="text-xs text-[#86948a]">{new Date(tx.fecha).toLocaleDateString("es-ES")}</p>
                      </div>
                      <p className={`text-sm font-bold flex-shrink-0 ${isIngreso ? "text-[#4edea3]" : "text-[#ffb4ab]"}`}>
                        {isIngreso ? "+" : "-"}
                        {Number(tx.monto).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dropdown: Notificaciones ────────────────────────────────
type Notificacion = {
  tipo: "objetivo" | "cuenta";
  titulo: string;
  texto: string;
  href: string;
  icono: string;
  color: string;
};

function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notificacion[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const { refreshKey } = useModal();

  useClickOutside(ref, () => setOpen(false), open);

  useEffect(() => {
    const load = async () => {
      const list: Notificacion[] = [];

      // Objetivos al ≥90% y no completados
      const { data: goals } = await supabase
        .from("objetivos")
        .select("id_objetivo, titulo, monto_actual, monto_objetivo, completado");

      (goals || []).forEach((g: any) => {
        const a = Number(g.monto_actual);
        const o = Number(g.monto_objetivo);
        if (o > 0 && !g.completado) {
          const pct = Math.round((a / o) * 100);
          if (pct >= 90 && pct < 100) {
            list.push({
              tipo: "objetivo",
              titulo: g.titulo,
              texto: `Tu objetivo está al ${pct}%`,
              href: "/dashboard/objetivos",
              icono: "target",
              color: "#4edea3",
            });
          }
        }
      });

      // Cuentas con balance negativo
      const { data: cuentas } = await supabase
        .from("cuentas")
        .select("id_cuenta, nombre, balance_inicial");
      const { data: txAll } = await supabase
        .from("transacciones")
        .select("id_cuenta, monto, tipo");

      (cuentas || []).forEach((c: any) => {
        let balance = Number(c.balance_inicial);
        (txAll || []).forEach((t: any) => {
          if (t.id_cuenta === c.id_cuenta) {
            if (t.tipo === "ingreso") balance += Number(t.monto);
            else balance -= Number(t.monto);
          }
        });
        if (balance < 0) {
          list.push({
            tipo: "cuenta",
            titulo: c.nombre,
            texto: `Balance negativo: ${balance.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}`,
            href: "/dashboard/cuentas",
            icono: "bank",
            color: "#ffb4ab",
          });
        }
      });

      setNotifs(list);
    };
    load();
  }, [refreshKey]);

  const hasUnread = notifs.length > 0;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-[#bbcabf] hover:text-[#dde4dd] transition-colors cursor-pointer p-2 rounded-lg hover:bg-[#1a211d] relative"
        aria-label="Notificaciones"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {hasUnread && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#4edea3] rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-[#161d19] border border-[#3c4a42]/60 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#3c4a42]/40">
            <h3 className="text-sm font-semibold text-[#dde4dd]">Notificaciones</h3>
            <p className="text-xs text-[#86948a]">{notifs.length === 0 ? "Todo en orden" : `${notifs.length} alerta${notifs.length === 1 ? "" : "s"}`}</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="flex flex-col items-center text-center py-10 px-4">
                <div className="w-12 h-12 rounded-full bg-[#4edea3]/10 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-[#4edea3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-[#dde4dd] font-medium mb-1">Sin novedades</p>
                <p className="text-xs text-[#86948a]">Cuando tengas alertas aparecerán aquí</p>
              </div>
            ) : (
              <div className="p-2">
                {notifs.map((n, idx) => (
                  <Link
                    key={idx}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 px-2 py-2.5 rounded-lg hover:bg-[#1a211d] transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-lg bg-[#1a211d] flex items-center justify-center border border-[#3c4a42] flex-shrink-0"
                      style={{ color: n.color }}
                    >
                      <Icon name={n.icono} className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#dde4dd] truncate">{n.titulo}</p>
                      <p className="text-xs text-[#86948a]">{n.texto}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dropdown: Perfil ────────────────────────────────────────
function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useClickOutside(ref, () => setOpen(false), open);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email || "");
      const { data: userData } = await supabase
        .from("usuarios")
        .select("nombre")
        .eq("id", user.id)
        .single();
      setName(userData?.nombre || user.email?.split("@")[0] || "Usuario");
    })();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    try { document.cookie = "tracki_session=; path=/; max-age=0"; } catch {}
    router.push("/");
  };

  const initial = (name || email).charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 hover:bg-[#1a211d] rounded-lg p-1 pr-2 transition-colors cursor-pointer"
        aria-label="Perfil"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
          {initial}
        </div>
        <span className="hidden sm:block text-sm font-medium text-[#dde4dd] capitalize max-w-[100px] truncate">{name}</span>
        <svg
          className={`hidden sm:block w-4 h-4 text-[#bbcabf] transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-[#161d19] border border-[#3c4a42]/60 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="px-4 py-4 border-b border-[#3c4a42]/40 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-base font-bold flex-shrink-0">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#dde4dd] capitalize truncate">{name}</p>
              <p className="text-xs text-[#86948a] truncate">{email}</p>
            </div>
          </div>
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Navbar principal ────────────────────────────────────────
export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-50 bg-[#161d19] border-b border-[#3c4a42]/40 px-4 md:px-6 flex items-center justify-between">
      {/* Izquierda: logo */}
      <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
        <Logo />
        <span className="text-2xl font-bold text-[#dde4dd] tracking-tight">Tracki</span>
      </Link>

      {/* Centro/derecha: selector cuenta + iconos */}
      <div className="flex items-center gap-2 md:gap-3">
        <AccountSelector />
        <SearchDropdown />
        <NotificationsDropdown />
        <ProfileDropdown />
      </div>
    </nav>
  );
}
