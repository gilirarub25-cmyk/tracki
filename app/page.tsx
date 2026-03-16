import Link from "next/link";
export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-emerald-500 mb-2 tracking-tight">
            Tracki
          </h1>
          <p className="text-slate-400">Gestiona tus gastos con inteligencia</p>
        </div>
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Correo electrónico
            </label>
            <input 
              type="email" 
              placeholder="nombre@ejemplo.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Contraseña
            </label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-emerald-900 bg-emerald-300/80 rounded-full p-0.5 shadow-inner" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="6" y="11" width="12" height="8" rx="2" className="fill-emerald-100/60" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V8a4 4 0 118 0v3" />
              </svg>
              Iniciar Sesión
            </span>
          </button>
        </form>
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-800"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-900 px-2 text-slate-500">¿Eres nuevo aquí?</span>
          </div>
        </div>
        <Link href="/registro" className="w-full block text-center bg-transparent border border-slate-700 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition-all">
              Crear una cuenta gratis
        </Link>
      </div>
      <p className="mt-8 text-slate-500 text-sm">
        Seguro. Privado. Eficiente.
      </p>
    </div>
  );
}