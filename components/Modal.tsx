// components/Modal.tsx
"use client";

import { useEffect } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string; // ej: "max-w-md", "max-w-lg"
};

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-lg",
}: ModalProps) {
  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    // Bloquear scroll del body cuando el modal está abierto
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden
      />

      {/* Diálogo */}
      <div
        className={`relative ${maxWidth} w-full bg-[#161d19] border border-[#3c4a42]/60 rounded-2xl shadow-2xl`}
        style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.5), 0 0 40px rgba(78,222,163,0.05)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#3c4a42]/40">
          <div>
            <h2 className="text-xl font-semibold text-[#dde4dd]">{title}</h2>
            {subtitle && <p className="text-sm text-[#bbcabf] mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-[#bbcabf] hover:text-[#dde4dd] transition-colors p-1 -m-1 cursor-pointer"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
