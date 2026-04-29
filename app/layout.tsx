// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tracki - Gestión de Finanzas',
  description: 'Controla tus gastos e ingresos de forma sencilla',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        {/* Aquí puedes añadir fuentes si las necesitas globales */}
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}