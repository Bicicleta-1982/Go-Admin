import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ERP Go Admin',
  description: 'Sistema administrativo para Comercial el vencedor limitada',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
