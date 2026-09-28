import { AppShell } from '@/components/layout/app-shell';

export default function CompanySettingsPage() {
  return (
    <AppShell>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Configuración de empresa</h1>
        <p className="mt-2 text-sm text-slate-600">Información legal, contacto y logo corporativo.</p>
      </div>
    </AppShell>
  );
}
