import { AppShell } from '@/components/layout/app-shell';

export default function UsersPage() {
  return (
    <AppShell>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>
        <p className="mt-2 text-sm text-slate-600">Administración de usuarios y permisos.</p>
      </div>
    </AppShell>
  );
}
