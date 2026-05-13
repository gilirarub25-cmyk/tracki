// components/Icon.tsx
// Mapa de identificadores string (almacenados en la BBDD) a iconos SVG.
// Uso:
//   <Icon name="food" className="w-5 h-5 text-[#4edea3]" />
//
// Los identificadores deben coincidir con los valores de la columna
// 'icono' en las tablas 'categorias' y 'objetivos'.

import React from "react";

type IconProps = {
  name: string;
  className?: string;
};

const ICONS: Record<string, React.ReactNode> = {
  // ─── INGRESOS ───────────────────────────────────────────────
  salary: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7H4a2 2 0 00-2 2v8a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 21v-2a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      <circle cx="12" cy="13" r="2.5" strokeWidth={1.8} />
    </>
  ),
  freelance: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.5 2h5a1 1 0 011 1v2h-7V3a1 1 0 011-1z" />
      <rect x="3" y="5" width="18" height="15" rx="2" strokeWidth={1.8} />
      <path strokeLinecap="round" strokeWidth={1.8} d="M3 12h18" />
    </>
  ),
  investment: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 17l6-6 4 4 8-8" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14 7h7v7" />
    </>
  ),
  gift: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 12v9H4v-9" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2 8h20v4H2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 21V8" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8H7.5a2.5 2.5 0 010-5C11 3 12 8 12 8zM12 8h4.5a2.5 2.5 0 000-5C13 3 12 8 12 8z" />
    </>
  ),
  income: (
    <>
      <circle cx="12" cy="12" r="9" strokeWidth={1.8} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 7v10M9 14l3 3 3-3" />
    </>
  ),

  // ─── GASTOS ─────────────────────────────────────────────────
  food: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 11h18a8 8 0 01-8 8h-2a8 8 0 01-8-8z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 8V5M12 8V4M17 8V5M2 21h20" />
    </>
  ),
  transport: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 17h14M5 17a2 2 0 11-4 0 2 2 0 014 0zm14 0a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 17V8a2 2 0 012-2h10l4 5v6" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14 11h5" />
    </>
  ),
  home: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l9-9 9 9" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
    </>
  ),
  entertainment: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" strokeWidth={1.8} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 10l5 2-5 2v-4z" fill="currentColor" />
    </>
  ),
  health: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
    </>
  ),
  shopping: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l2.5 13a2 2 0 002 1.6h7.8a2 2 0 002-1.6L21 7H6" />
      <circle cx="9" cy="20" r="1.5" strokeWidth={1.8} />
      <circle cx="17" cy="20" r="1.5" strokeWidth={1.8} />
    </>
  ),
  subscription: (
    <>
      <rect x="5" y="2" width="14" height="20" rx="2" strokeWidth={1.8} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 18h2" />
    </>
  ),
  education: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3L2 9l10 6 10-6-10-6z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 11v5a6 6 0 0012 0v-5" />
    </>
  ),
  expense: (
    <>
      <circle cx="12" cy="12" r="9" strokeWidth={1.8} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 17V7M9 10l3-3 3 3" />
    </>
  ),

  // ─── OBJETIVOS ──────────────────────────────────────────────
  car: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 11l1.5-4.5A2 2 0 018.4 5h7.2a2 2 0 011.9 1.5L19 11" />
      <rect x="3" y="11" width="18" height="7" rx="2" strokeWidth={1.8} />
      <circle cx="7.5" cy="18" r="1.5" strokeWidth={1.8} />
      <circle cx="16.5" cy="18" r="1.5" strokeWidth={1.8} />
    </>
  ),
  plane: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M22 16v-2l-8.5-5V3.5A1.5 1.5 0 0012 2a1.5 1.5 0 00-1.5 1.5V9L2 14v2l8.5-2.5V19L8 20.5V22l4-1 4 1v-1.5L13.5 19v-5.5L22 16z" />
    </>
  ),
  graduation: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3L2 9l10 6 10-6-10-6z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 11v5a6 6 0 0012 0v-5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M22 9v5" />
    </>
  ),
  shield: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </>
  ),
  heart: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" strokeWidth={1.8} />
      <circle cx="12" cy="12" r="5" strokeWidth={1.8} />
      <circle cx="12" cy="12" r="1.5" strokeWidth={1.8} fill="currentColor" />
    </>
  ),
  trophy: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 5h3v2a3 3 0 01-3 3M7 5H4v2a3 3 0 003 3" />
    </>
  ),

  // ─── CUENTAS ────────────────────────────────────────────────
  wallet: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </>
  ),
  bank: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M5 10v8M9 10v8M15 10v8M19 10v8M3 18h18M3 21h18M12 3L2 9h20l-10-6z" />
    </>
  ),
  card: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" strokeWidth={1.8} />
      <path strokeLinecap="round" strokeWidth={1.8} d="M2 10h20M6 15h3" />
    </>
  ),
  cash: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" strokeWidth={1.8} />
      <circle cx="12" cy="12" r="2.5" strokeWidth={1.8} />
    </>
  ),

  // ─── UI / GENERALES ─────────────────────────────────────────
  "trending-up": (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 17l6-6 4 4 8-8" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14 7h7v7" />
    </>
  ),
  "trending-down": (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 7l6 6 4-4 8 8" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14 17h7v-7" />
    </>
  ),
  "arrow-up": (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 19V5M5 12l7-7 7 7" />
    </>
  ),
  "arrow-down": (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 5v14M5 12l7 7 7-7" />
    </>
  ),
  download: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v12m0 0l-4-4m4 4l4-4" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
    </>
  ),
  lightbulb: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9V16a1 1 0 001 1h5a1 1 0 001-1v-2.1A6 6 0 0012 3z" />
    </>
  ),
  money: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" strokeWidth={1.8} />
      <circle cx="12" cy="12" r="2.5" strokeWidth={1.8} />
      <path strokeLinecap="round" strokeWidth={1.8} d="M6 10v.01M18 14v.01" />
    </>
  ),
};

// Icono por defecto si el name no existe en el mapa
const FALLBACK = (
  <circle cx="12" cy="12" r="9" strokeWidth={1.8} />
);

export default function Icon({ name, className = "w-5 h-5" }: IconProps) {
  const content = ICONS[name] ?? FALLBACK;
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {content}
    </svg>
  );
}

// Lista de iconos disponibles (útil para selectores en formularios)
export const ICONOS_CATEGORIA_INGRESO = [
  "salary", "freelance", "investment", "gift", "income",
];

export const ICONOS_CATEGORIA_GASTO = [
  "food", "transport", "home", "entertainment", "health",
  "shopping", "subscription", "education", "expense",
];

export const ICONOS_OBJETIVO = [
  "home", "car", "plane", "graduation", "shield",
  "heart", "target", "trophy",
];

export const ICONOS_CUENTA = [
  "wallet", "bank", "card", "cash",
];
