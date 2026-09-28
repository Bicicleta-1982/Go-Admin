# Arquitectura del sistema

## 1. Stack propuesto y justificación

- Next.js 14/15 con App Router: base de la aplicación web, routing con server components, API routes y server actions, buena integración con Supabase y despliegue en Vercel.
- React + TypeScript estricto: seguridad de tipos, escalabilidad y menos errores en validaciones y modelos de datos.
- Tailwind CSS + shadcn/ui: estilos consistente, componentes reutilizables, productividad y diseño profesional.
- Zod: validación del lado cliente y servidor; define esquemas compartidos para formularios y acciones.
- Supabase PostgreSQL + Auth + Storage + RLS: backend de base de datos, autenticación, almacenamiento y control granular de permisos.
- TanStack Table: tablas densas con filtros, orden, paginación y exportación.
- React Hook Form: manejo de formularios y validación con menos re-render.
- Vitest + Playwright: pruebas unitarias y pruebas de flujos críticos del navegador.
- Excel export: una librería liviana (por ejemplo, xlsx o sheetjs) para exportación de reportes y listados.
- Vercel: despliegue rápido y natural para Next.js, con integración sencilla con Supabase y variables de entorno.

## 2. Estructura de carpetas propuesta

```text
src/
  app/
    (auth)/
    (dashboard)/
    api/
    globals.css
  components/
    ui/
    layout/
    forms/
    tables/
  lib/
    utils/
    formats/
    validators/
    auth.ts
  modules/
    company/
    suppliers/
    banking/
    crm/
    sales/
    sii/
    dashboard/
    users/
    settings/
    audit/
  types/
    database.ts
    domain.ts
  hooks/
  server/
    actions/
    queries/
    services/
    validators/
  styles/
    tokens.css
supabase/
  migrations/
  seed/
  sql/
  policies/

docs/
  ARQUITECTURA.md
  MODELO_DATOS.md
  PANTALLAS.md
  PENDIENTES.md
  PROGRESO.md
```

## 3. Autenticación, roles y RLS

### Autenticación
- La autenticación se realiza con Supabase Auth, usando email + password.
- La cuenta admin se crea manualmente o via seed de desarrollo.
- Las credenciales no se exponen al cliente; la validación real se hace en el servidor.
- La recuperación de contraseña se gestiona por flujo nativo de Supabase.

### Roles
- admin: acceso total, administración de usuarios, configuración, auditoría y gestión operativa.
- finanzas: proveedores, pagos, bancos, conciliación y reportes financieros.
- ventas: clientes, oportunidades, cotizaciones, cobranzas y documentación relevante a ventas.
- lectura: solo consulta, sin permisos de edición ni cambios irreversibles.

### RLS y seguridad por capa
- Cada tabla tiene políticas explícitas por rol.
- En el backend, se valida también el rol del usuario y se bloquean acciones no permitidas.
- En el cliente, la UI oculta acciones no autorizadas, pero no reemplaza la validación del servidor.
- Las funciones de servidor comprueban permisos antes de ejecutar operaciones sensibles.

## 4. Auditoría y soft delete

### audit_log
- Todo cambio relevante queda registrado: creación, edición, anulación, aprobación, reconciliación, cambio de estado.
- Campos sugeridos:
  - id
  - table_name
  - record_id
  - action
  - user_id
  - created_at
  - metadata (jsonb)
  - reason
- Esto permite reconstruir cambios y facilita la trazabilidad en revisión interna y auditoría externa.

### Soft delete
- Ningún registro financiero se borra físicamente.
- Se marca como inactivo o anulado.
- Se registra motivo, usuario y fecha.
- Ejemplo: `is_deleted`, `deleted_at`, `deleted_by`, `deletion_reason`.
- Los listados filtrados por defecto deberían excluir registros anulados, pero la auditoría los conserva en histórico.

## 5. Integración con SII

La estrategia recomendada es un adaptador intercambiable con una interfaz común para importar y cruzar información tributaria.

### Opción A: importación manual de CSV del RCV (v1)
- El usuario sube los archivos CSV del Registro de Compras y Ventas descargados desde el sitio del SII.
- El sistema valida columnas, mes/año y filas.
- Se realiza un cruce por RUT + tipo de documento + folio.

Ventajas:
- No requiere certificados ni conexión en vivo.
- Más fácil de implementar y desplegar en la versión inicial.
- Permite aprender el formato real del SII antes de automatizar.

Riesgos:
- Depende de un archivo manual y correcto.
- Hay riesgo de errores humanos o inconsistencias si el usuario carga un CSV no real o sin limpiar.
- El proceso de importación requiere revisión y validación humana.

Qué necesitaría el usuario:
- Archivos CSV descargados desde el SII.
- Permiso para acceder al sitio del SII y manejar los documentos.
- Un responsable para revisar discrepancias y aplicar correcciones.

### Opción B: conexión vía API de un proveedor autorizado (futuro)
- Un adaptador encapsula la lógica y expone un contrato común para recibir facturas y estados del SII.
- La integración sería reemplazable por otra implementación sin tocar la lógica de negocio.

Ventajas:
- Menos carga manual y menos error humano.
- Mejor para volumen medio o alto.
- Permite automatizar reconciliación y reportes.

Riesgos:
- Requiere certificados, credenciales, costos y cumplimiento.
- Dependencia de un proveedor externo y compatibilidad con el SII.
- Más complejidad operativa y seguridad.

Qué necesitaría el usuario:
- Contrato o acceso a un proveedor de facturación electrónica.
- Certificados digitales vigentes.
- Revisión legal/contable para uso productivo.

### Recomendación
- En v1, priorizar la importación manual del RCV y mantener la arquitectura preparada para cambios de proveedor.
- El adaptador debe tener una interfaz simple: `import`, `validate`, `match`, `reconcile`, `generateReport`.

## 6. Estrategia bancaria

- Las cuentas bancarias de la empresa se registran en la base de datos con datos básicos y saldo inicial.
- La importación de cartolas desde CSV/XLSX permite una primera versión sin conexión directa con banca.
- El sistema debe soportar plantillas de mapeo por banco para asignar columnas de fecha, glosa, cargo, abono, saldo y folio.
- El proceso ideal es:
  1. Crear o reutilizar una plantilla por banco.
  2. Subir archivo.
  3. Ver vista previa.
  4. Detectar duplicados y errores.
  5. Confirmar importación.
  6. Registrar movimientos para posterior conciliación.

### Futuro: conexión directa con bancos
- Se dejará preparada una capa de servicio para integrar con APIs bancarias o proveedores de extractos.
- No se implementará en v1 porque mayormente los bancos chilenos aún no ofrecen facilidad de conexión directa para pequeñas empresas.
- La misma arquitectura de movimientos bancarios, plantillas y conciliación ayuda a migrar a una conexión real sin reescribir toda la capa de gestión financiera.

## 7. Consideraciones operativas

- Todo cálculo tributario y contable debe ser un apoyo para revisión por contador antes de producción.
- Los reportes de IVA y tributarios no reemplazan la declaración legal del SII.
- El diseño de la app prioriza uso de oficina, con navegación clara, filtros robustos y exportación en Excel.
- Los datos sensibles (RUT, bancos, montos) deben ir protegidos y no deben subirse a entornos de desarrollo con información real.
