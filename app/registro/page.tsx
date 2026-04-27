"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Estados funcionales para Supabase
  const [formData, setFormData] = useState({
    user: "",
    email: "",
    pass: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted) {
      alert("Por favor, acepta los términos y condiciones.");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (data.ok) {
        alert("¡Bienvenido a Tracki! Cuenta creada.");
        router.push("/login");
      } else {
        alert("Error: " + data.mensaje);
      }
    } catch (err) {
      setLoading(false);
      alert("Error de conexión.");
    }
  };

  return (
    <>
      <style>{`
        @keyframes float1 { 0%, 100% { transform: translateY(0px) rotate(-1deg); } 50% { transform: translateY(-15px) rotate(0.5deg); } }
        @keyframes float2 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(-0.5deg); } }
        @keyframes float3 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        .floating-1 { animation: float1 18s ease-in-out infinite; }
        .floating-2 { animation: float2 22s ease-in-out infinite; }
        .floating-3 { animation: float3 16s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen flex overflow-x-hidden antialiased bg-[#0e1511] text-[#dde4dd]">
        
        {/* ── SECCIÓN IZQUIERDA: FORMULARIO ── */}
        <div className="w-full lg:w-[45%] xl:w-5/12 flex flex-col justify-center px-8 py-12 lg:px-20 relative z-10 bg-[#0e1511]">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-[#4edea3] flex items-center justify-center shadow-[0_0_20px_rgba(78,222,163,0.2)]">
                <svg className="w-5 h-5 text-[#003824]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 13h2v7H3v-7zm4-5h2v12H7V8zm4-4h2v16h-2V4zm4 8h2v8h-2v-8zm4-4h2v12h-2V8z" />
                </svg>
              </div>
              <span className="font-semibold text-2xl text-[#dde4dd] tracking-tight">Tracki</span>
            </div>
            <h1 className="text-[48px] leading-[1.1] font-bold tracking-[-0.02em] text-[#dde4dd] mb-4">Únete a Tracki</h1>
            <p className="text-base leading-relaxed text-[#bbcabf]">Crea tu cuenta para empezar a ahorrar y tomar el control de tu futuro financiero.</p>
          </div>

          <form className="space-y-6 w-full max-w-md" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm text-[#dde4dd]">Nombre de usuario</label>
              <div className="relative flex items-center">
                <svg className="absolute left-4 w-5 h-5 text-[#bbcabf]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input required type="text" placeholder="Ej. Juan Pérez" className="w-full bg-[#161d19] border border-[#3c4a42] rounded-xl py-3 pl-12 pr-4 text-base text-[#dde4dd] outline-none focus:border-[#4edea3] transition-colors" onChange={(e) => setFormData({ ...formData, user: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-[#dde4dd]">Correo electrónico</label>
              <div className="relative flex items-center">
                <svg className="absolute left-4 w-5 h-5 text-[#bbcabf]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input required type="email" placeholder="tu@email.com" className="w-full bg-[#161d19] border border-[#3c4a42] rounded-xl py-3 pl-12 pr-4 text-base text-[#dde4dd] outline-none focus:border-[#4edea3] transition-colors" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-[#dde4dd]">Contraseña</label>
              <div className="relative flex items-center">
                <svg className="absolute left-4 w-5 h-5 text-[#bbcabf]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input required type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full bg-[#161d19] border border-[#3c4a42] rounded-xl py-3 pl-12 pr-12 text-base text-[#dde4dd] outline-none focus:border-[#4edea3] transition-colors" onChange={(e) => setFormData({ ...formData, pass: e.target.value })} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-[#bbcabf] hover:text-[#dde4dd] transition-colors">
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-[#bbcabf] mt-1">Mínimo 8 caracteres, incluye un número o símbolo.</p>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#4edea3] hover:bg-[#6ffbbe] text-[#003824] font-semibold text-lg py-4 rounded-xl mt-4 transition-all shadow-[0_0_24px_rgba(78,222,163,0.15)] flex justify-center items-center gap-2">
              {loading ? "Creando..." : "Crear cuenta"}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>

            <div className="flex items-start gap-3 pt-2">
              <input type="checkbox" checked={accepted} onChange={() => setAccepted(!accepted)} className="mt-1 w-4 h-4 rounded border-[#3c4a42] bg-[#161d19] text-[#4edea3] focus:ring-[#4edea3]" />
              <label className="text-sm text-[#bbcabf]">Al crear una cuenta, aceptas nuestros <span className="text-[#4edea3] cursor-pointer hover:underline">Términos de servicio</span> y <span className="text-[#4edea3] cursor-pointer hover:underline">Política de privacidad</span>.</label>
            </div>
          </form>

          <div className="mt-auto pt-12 text-sm text-[#bbcabf] text-center lg:text-left">
            ¿Ya tienes cuenta? <Link href="/login" className="text-[#4edea3] font-medium hover:underline ml-1">Inicia sesión aquí</Link>
          </div>
        </div>

        {/* ── SECCIÓN DERECHA: SHOWCASE ── */}
        <div className="hidden lg:flex lg:w-[55%] xl:w-7/12 relative bg-[#1a211d] overflow-hidden items-center justify-center border-l border-[#3c4a42]/30">
          <div className="absolute inset-0 opacity-60" style={{ background: "radial-gradient(ellipse at top right, rgba(78,222,163,0.1) 0%, #1a211d 50%, #0e1511 100%)" }} />
          
          <div className="relative z-10 w-full max-w-2xl p-12 grid grid-cols-2 gap-6 floating-1">
            
            {/* Balance Card - EURO CORREGIDO AQUÍ */}
            <div className="col-span-2 relative overflow-hidden rounded-2xl border border-[#343b36] shadow-2xl p-8 group" style={{ background: "linear-gradient(to bottom, rgba(47,54,50,0.9), rgba(26,33,29,0.9))" }}>
              <div className="absolute top-0 left-0 w-full h-[1px] opacity-50" style={{ background: "linear-gradient(to right, transparent, rgba(78,222,163,0.5), transparent)" }} />
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs tracking-widest text-[#bbcabf] uppercase mb-2">Balance Total</p>
                  <h2 className="text-[56px] leading-none font-bold tracking-tighter text-[#dde4dd]" style={{ textShadow: "0 0 12px rgba(78,222,163,0.4)" }}>
                    124.562,00<span className="text-[#bbcabf]/50 text-[32px] ml-1">€</span>
                  </h2>
                </div>
                <div className="bg-[#4edea3]/10 border border-[#4edea3]/20 rounded-full px-3 py-1 flex items-center gap-1">
                  <svg className="w-4 h-4 text-[#4edea3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  <span className="text-xs font-medium text-[#4edea3]">+12.5%</span>
                </div>
              </div>
              <div className="h-16 w-full flex items-end justify-between gap-1 mt-8">
                {[{h:"30%",c:"20%"},{h:"45%",c:"20%"},{h:"20%",c:"20%"},{h:"60%",c:"40%"},{h:"85%",c:"100%",g:true},{h:"50%",c:"20%"},{h:"70%",c:"20%"}].map((b,i)=>(
                  <div key={i} className={`w-full rounded-t-sm transition-all ${b.g?'bg-[#4edea3]':'bg-[#4edea3]/20'}`} style={{height:b.h, boxShadow: b.g ? "0 0 20px rgba(78,222,163,0.2)" : ""}}></div>
                ))}
              </div>
            </div>

            {/* Income Card */}
            <div className="floating-2 rounded-2xl border border-[#343b36] p-6 shadow-lg bg-gradient-to-b from-[#242c27] to-[#1a211d]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#4edea3]/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#4edea3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
                <div>
                  <p className="text-xs text-[#bbcabf]">Ingresos (Mes)</p>
                  <p className="text-2xl font-semibold text-[#dde4dd] mt-1">8.240,50€</p>
                </div>
              </div>
            </div>

            {/* Expenses Card */}
            <div className="floating-2 rounded-2xl border border-[#343b36] p-6 shadow-lg bg-gradient-to-b from-[#242c27] to-[#1a211d]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#ffb4ab]/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#ffb4ab]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                </div>
                <div>
                  <p className="text-xs text-[#bbcabf]">Gastos (Mes)</p>
                  <p className="text-2xl font-semibold text-[#dde4dd] mt-1">3.120,00€</p>
                </div>
              </div>
            </div>

            {/* Goals Card */}
            <div className="floating-3 col-span-2 rounded-2xl border border-[#343b36] p-6 shadow-xl flex items-center gap-6 bg-gradient-to-b from-[rgba(47,54,50,0.8)] to-[rgba(26,33,29,0.8)]">
              <div className="w-12 h-12 rounded-xl bg-[#7bd0ff]/10 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-[#7bd0ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-end mb-2 text-sm">
                  <span className="font-medium text-[#dde4dd]">Fondo de Emergencia</span>
                  <span className="text-[#bbcabf]">75%</span>
                </div>
                <div className="w-full bg-[#09100c] h-2.5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#7bd0ff]" style={{ width: "75%", boxShadow: "0 0 12px rgba(123,208,255,0.6)" }} />
                </div>
                <p className="text-xs text-[#bbcabf70] mt-2 text-right">7.500€ / 10.000€</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}