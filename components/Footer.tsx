export default function Footer() {
    return (
      <footer className="bg-slate-900 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold text-xl tracking-tighter">Tracki</span>
          </div>
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Tracki. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-slate-400 text-sm">
            <span className="hover:text-emerald-400 cursor-pointer transition">Privacidad</span>
            <span className="hover:text-emerald-400 cursor-pointer transition">Términos</span>
            <span className="hover:text-emerald-400 cursor-pointer transition">Soporte</span>
          </div>
        </div>
      </footer>
    );
  }