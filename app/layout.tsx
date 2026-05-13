// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

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
    <html lang="es" className={manrope.variable}>
      <body className="antialiased min-h-screen flex flex-col bg-[#0e1511] text-[#dde4dd] font-sans">
        {children}
      </body>
    </html>
  )
}
