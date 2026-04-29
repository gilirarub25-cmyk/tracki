"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Mini dashboard mockup (Tarjeta decorativa animada) ───
function DashboardMockup() {
  return (
    <div
      className="bg-[#0e1511] border border-[#3c4a42] rounded-2xl p-6 md:p-8 w-full max-w-2xl mx-auto animate-float-mockup relative z-20"
      style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.5), 0 0 40px rgba(78,222,163,0.1)" }}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="w-1/3 h-5 bg-[#242c27] rounded-full" />
          <div className="w-10 h-10 rounded-full bg-[#2f3632]" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#1a211d] p-5 rounded-xl border border-[#3c4a42]/50">
            <div className="w-10 h-10 rounded-full bg-[#4edea3]/20 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-[#4edea3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
            </div>
            <div className="w-1/2 h-2.5 bg-[#2f3632] rounded-full mb-3" />
            <div className="w-3/4 h-5 bg-[#dde4dd] rounded-full" />
          </div>
          <div className="bg-[#1a211d] p-5 rounded-xl border border-[#3c4a42]/50">
            <div className="w-10 h-10 rounded-full bg-[#ffb4ab]/20 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-[#ffb4ab]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
            <div className="w-1/2 h-2.5 bg-[#2f3632] rounded-full mb-3" />
            <div className="w-3/4 h-5 bg-[#dde4dd] rounded-full" />
          </div>
        </div>
        <div className="bg-[#1a211d] p-5 rounded-xl border border-[#3c4a42]/50 h-40 flex items-end gap-3 mt-4">
          {[{h:"33%",o:"bg-[#4edea3]/30"},{h:"66%",o:"bg-[#4edea3]/50"},{h:"100%",o:"bg-[#4edea3]"},{h:"50%",o:"bg-[#4edea3]/40"},{h:"80%",o:"bg-[#4edea3]/70"}].map((bar, i) => (
            <div key={i} className={`w-full ${bar.o} rounded-t-md`} style={{ height: bar.h }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Grupo de Avatares ───
function AvatarGroup() {
  const AVATAR_COLORS = ["bg-emerald-600", "bg-sky-600", "bg-violet-600"];
  const AVATAR_INITIALS = ["A", "B", "C"];
  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {AVATAR_COLORS.map((color, i) => (
          <div key={i} className={`w-8 h-8 rounded-full ${color} border-2 border-[#161d19] flex items-center justify-center text-white text-xs font-bold`}>{AVATAR_INITIALS[i]}</div>
        ))}
      </div>
      <p className="text-sm text-[#bbcabf] ml-2">Únete a más de 10,000 usuarios</p>
    </div>
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ user: "", pass: "" });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (data.ok) {
        router.push('/dashboard');
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
        @keyframes floatMockup { 0%, 100% { transform: translateY(0px) rotate(-0.5deg); } 50% { transform: translateY(-20px) rotate(0.5deg); } }
        .animate-float-mockup { animation: floatMockup 8s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen flex bg-[#0e1511] text-[#dde4dd] antialiased">
        {/* Panel Izquierdo: Hero */}
        <div className="hidden lg:flex lg:w-[55%] xl:w-7/12 bg-[#161d19] flex-col justify-between p-12 lg:p-16 relative overflow-hidden border-r border-[#3c4a42]/30">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: "rgba(78,222,163,0.08)" }} />
          <div className="relative z-10">
            <h1 className="text-[48px] leading-[1.1] font-bold tracking-[-0.02em] text-[#4edea3] mb-4">Tracki</h1>
            <p className="text-2xl font-semibold leading-snug text-[#bbcabf] max-w-md">Controla tus gastos e ingresos de forma sencilla y visual.</p>
          </div>
          <div className="relative z-10 w-full mt-12 mb-12"><DashboardMockup /></div>
          <div className="relative z-10 mt-auto"><AvatarGroup /></div>
        </div>

        {/* Panel Derecho: Formulario */}
        <div className="w-full lg:w-[45%] xl:w-5/12 flex items-center justify-center p-8 sm:p-12 relative">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-semibold leading-snug text-[#dde4dd] mb-2">Bienvenido de nuevo</h2>
              <p className="text-sm text-[#bbcabf]">Inicia sesión en tu cuenta para continuar</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block text-xs tracking-[0.05em] font-medium text-[#bbcabf] uppercase">Nombre de usuario</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-[#86948a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <input required type="text" placeholder="Tu usuario" className="w-full bg-[#1a211d] border border-[#3c4a42] rounded-lg py-3 pl-10 pr-4 text-base text-[#dde4dd] focus:border-[#4edea3] focus:outline-none transition-colors" onChange={(e) => setFormData({ ...formData, user: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs tracking-[0.05em] font-medium text-[#bbcabf] uppercase">Contraseña</label>
                  <a href="#" className="text-sm text-[#4edea3] hover:text-[#6ffbbe] transition-colors">¿Olvidaste tu contraseña?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-[#86948a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <input required type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full bg-[#1a211d] border border-[#3c4a42] rounded-lg py-3 pl-10 pr-10 text-base text-[#dde4dd] focus:border-[#4edea3] focus:outline-none transition-colors" onChange={(e) => setFormData({ ...formData, pass: e.target.value })} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#86948a] hover:text-[#dde4dd]">
                    {showPassword ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#4edea3] text-[#003824] text-base font-medium py-3 rounded-lg transition-all active:scale-[0.98] hover:bg-[#6ffbbe]" style={{ boxShadow: "0 0 20px rgba(78,222,163,0.2)" }}>
                {loading ? "Comprobando..." : "Iniciar sesión"}
              </button>

              <div className="relative flex items-center py-4"><div className="flex-grow border-t border-[#3c4a42]" /><span className="mx-4 text-sm text-[#bbcabf]">O</span><div className="flex-grow border-t border-[#3c4a42]" /></div>

              <button type="button" className="w-full bg-[#0e1511] border border-[#3c4a42] text-[#dde4dd] text-base font-medium py-3 rounded-lg hover:bg-[#1a211d] flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.27C21.35 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" /><path d="M12 23C14.97 23 17.46 22.02 19.27 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.13999 18.63 6.70999 16.7 5.84999 14.11H2.17999V16.96C3.98999 20.56 7.7 23 12 23Z" fill="#34A853" /><path d="M5.84999 14.11C5.62999 13.45 5.49999 12.74 5.49999 12C5.49999 11.26 5.62999 10.55 5.84999 9.89V7.04H2.17999C1.42999 8.53 1 10.22 1 12C1 13.78 1.42999 15.47 2.17999 16.96L5.84999 14.11Z" fill="#FBBC05" /><path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.34 3.89C17.46 2.13 14.97 1 12 1C7.7 1 3.98999 3.44 2.17999 7.04L5.84999 9.89C6.70999 7.3 9.13999 5.38 12 5.38Z" fill="#EA4335" /></svg>
                Continuar con Google
              </button>
            </form>

            <p className="text-center text-sm text-[#bbcabf] mt-8">
              ¿No tienes cuenta? <Link href="/registro" className="text-[#4edea3] hover:text-[#6ffbbe] font-medium">Regístrate aquí</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}