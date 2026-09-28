import { AppShell } from '@/components/layout/app-shell';

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Inicio</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Dashboard</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Saldo bancario</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">$ 1.500.000</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Por pagar</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">$ 540.000</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Por cobrar</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">$ 980.000</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
