# Proyecto: Sistema de Gestión Administrativa — Comercial el vencedor limitada

## Sobre la empresa
- Razón social: Comercial el vencedor limitada
- RUT: 89.347.700-8
- Rubro / giro: comercio minorista / distribución / venta de productos y servicios
- Ciudad: Chillán
- Número aproximado de usuarios del sistema: 8
- Bancos que usa la empresa: Banco Estado, Banco de Chile, MercadoPago
- Volumen aproximado: 10-100 documentos por mes

## Sobre quien dirige el proyecto
Tengo conocimientos básicos de programación y estoy aprendiendo.
- Explícame en español simple qué hiciste y por qué, sin jerga innecesaria.
- Cuando necesite hacer algo manual (crear cuentas, variables de entorno, comandos), dame pasos numerados exactos.
- Si algo es riesgoso o irreversible (borrar datos, migraciones destructivas, cambiar auth), DETENTE y pregúntame antes.

## Stack (no cambiar sin justificarlo y pedir aprobación)
- Next.js (versión estable actual, App Router) + React + TypeScript estricto
- Tailwind CSS + shadcn/ui + Lucide icons
- Supabase: PostgreSQL, Auth, Storage, Row Level Security
- Validación: Zod en cliente y servidor
- Tablas: TanStack Table · Formularios: React Hook Form
- Exportación Excel: una sola librería liviana
- Tests: Vitest (lógica) + Playwright (flujos críticos)
- Despliegue: Vercel
- No agregar dependencias sin explicar para qué sirven.

## Reglas de negocio chilenas (transversales)
- Moneda: pesos chilenos (CLP) sin decimales. Guardar montos como enteros (bigint), nunca float.
- Soporte opcional de UF/USD solo como referencia, con tipo de cambio y fecha guardados.
- IVA: parámetro configurable en la tabla `settings` (valor actual 19 %), nunca escrito fijo en el código.
- RUT: validar dígito verificador (módulo 11); guardar normalizado sin puntos y con guion (ej. 12345678-5); mostrar con formato 12.345.678-5.
- Fechas y horas: zona horaria America/Santiago. Formato de fecha dd-mm-aaaa en pantalla.
- Tipos de documento tributario según códigos SII (33 factura, 34 exenta, 56 nota débito, 61 nota crédito, etc.), guardados en una tabla, no fijos en el código.
- Tasas legales (IVA, retención honorarios, etc.) siempre en tablas de parámetros con fecha de vigencia.

## Reglas críticas
- NO inventar datos de la empresa, clientes, proveedores ni cifras. Usar datos de ejemplo claramente marcados como "DEMO" solo en el seed de desarrollo.
- Los cálculos tributarios y contables deben quedar marcados para validación de un contador antes de usarse en producción.
- Todo monto se calcula en el servidor; el cliente solo muestra.
- Ningún registro financiero se borra físicamente: se anula (soft delete) con motivo, usuario y fecha.
- Toda creación, edición, anulación y cambio de estado se registra en `audit_log`.

## Seguridad
- Secretos solo en variables de entorno; mantener `.env.example` sin valores reales.
- RLS activado en TODAS las tablas. Ninguna tabla accesible sin política explícita.
- La clave `service_role` de Supabase solo en código de servidor, jamás en el cliente.
- Roles: `admin`, `finanzas`, `ventas`, `lectura`. Permisos verificados en servidor Y en RLS.
- Validar tipo y tamaño de archivos subidos (PDF, XML, CSV, XLSX; máx. 10 MB).
- No mostrar stack traces al usuario. Errores con mensaje claro en español.

## Convenciones de código
- Código, tablas y variables en inglés; textos de interfaz en español de Chile.
- Estructura por módulos: src/modules/<modulo>/{components,actions,queries,schemas,types}.
- Server Actions o Route Handlers para escrituras; nunca escribir en la base directamente desde el cliente.
- Migraciones SQL versionadas en supabase/migrations. Nunca editar una migración ya aplicada.
- Componentes pequeños y reutilizables. Comentarios solo donde la lógica no sea obvia.

## Interfaz
- Aplicación de escritorio primero (uso de oficina), pero usable en tablet y teléfono.
- Diseño sobrio y profesional: barra lateral con módulos, tablas densas pero legibles, filtros, búsqueda, paginación.
- Estados de carga (skeleton), vacío y error en todas las listas.
- Confirmación antes de anular o acciones irreversibles.
- Accesible: navegación por teclado, foco visible, etiquetas en formularios, buen contraste.

## Definición de "terminado" para cada fase
1. `npm run lint` sin errores.
2. `npm run typecheck` sin errores.
3. `npm run test` en verde.
4. `npm run build` exitoso.
5. Migraciones aplicadas y RLS verificado.
6. Resumen final: qué se hizo, cómo probarlo paso a paso en el navegador, qué quedó pendiente.
7. Actualizar docs/PROGRESO.md.
8. Commit con mensaje descriptivo en español.

## Documentos del proyecto
- docs/ARQUITECTURA.md — decisiones técnicas
- docs/MODELO_DATOS.md — tablas y relaciones
- docs/PROGRESO.md — estado de cada fase
- docs/PENDIENTES.md — preguntas abiertas y decisiones por validar
