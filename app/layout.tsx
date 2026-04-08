import './globals.css'
import type { Metadata } from 'next'
import { env } from '@/core/config/env'

export const metadata: Metadata = {
  title: env.appName,
  description: 'Plataforma interna de gestão operacional e técnica',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}