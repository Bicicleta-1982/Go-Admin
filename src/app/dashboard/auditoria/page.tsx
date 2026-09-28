import { AppShell } from '@/components/layout/app-shell';

export default function AuditPage() {
  return (
    <AppShell>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Auditoría</h1>
        <p className="mt-2 text-sm text-slate-600">Registro de cambios de estado, anulaciones y acciones relevantes.</p>
      </div>
    </AppShell>
  );
}
