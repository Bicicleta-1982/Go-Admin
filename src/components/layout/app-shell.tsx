import Link from 'next/link';
import { Building2, FileText, LayoutDashboard, Landmark, LogOut, ShieldCheck, Users } from 'lucide-react';
import { clsx } from 'clsx';
import { signOut } from '@/lib/auth';
import { getCurrentUserProfile } from '@/lib/user-profile';

const navItems = [
  { href: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { href: '/dashboard/configuracion-empresa', label: 'Configuración de empresa', icon: Building2 },
  { href: '/dashboard/parametros', label: 'Parámetros', icon: FileText },
  { href: '/dashboard/usuarios', label: 'Usuarios', icon: Users },
  { href: '/dashboard/auditoria', label: 'Auditoría', icon: ShieldCheck },
  { href: '/dashboard/bancos', label: 'Bancos', icon: Landmark },
];

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  finanzas: 'Finanzas',
  ventas: 'Ventas',
  lectura: 'Lectura',
};

export async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUserProfile();
  const initials = user?.full_name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'US';

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="w-72 border-r border-slate-200 bg-slate-950 text-slate-100">
        <div className="border-b border-slate-800 px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">ERP</p>
          <h1 className="mt-2 text-xl font-semibold">Go Admin</h1>
        </div>

        <nav className="space-y-1 p-3">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800',
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Comercial el vencedor limitada</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-800">Panel administrativo</h2>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
              {initials}
            </span>
            <div className="flex flex-col text-left">
              <span className="font-medium text-slate-800">{user?.email ?? 'Sin sesión'}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                {user ? roleLabels[user.role] ?? user.role : 'Sin rol'}
              </span>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="ml-1 inline-flex items-center rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
