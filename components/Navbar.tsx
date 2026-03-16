"use client";
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="relative bg-slate-900 border-b border-slate-800 z-50 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex shrink-0 items-center">
            <Link href="/" className="text-xl font-bold text-emerald-500 tracking-tighter transition hover:opacity-80">
              Tracki
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
              <Link href="/dashboard" className="rounded-md bg-gray-950/50 px-3 py-2 text-sm font-medium text-white transition">Dashboard</Link>
              <Link href="/historial" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:text-emerald-500 transition-colors">Historial</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white transition p-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6">
                <path d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="relative flex size-9 items-center justify-center rounded-full bg-slate-800 border-2 border-slate-700 text-slate-600 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}