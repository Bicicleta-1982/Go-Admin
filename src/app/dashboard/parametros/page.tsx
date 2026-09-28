import { AppShell } from '@/components/layout/app-shell';

export default function ParametersPage() {
  return (
    <AppShell>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Parámetros</h1>
        <p className="mt-2 text-sm text-slate-600">IVA, tasas legales y vigencias.</p>
      </div>
    </AppShell>
  );
}
