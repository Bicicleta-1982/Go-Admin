# Pantallas por módulo

## 1. Inicio / Dashboard
- Muestra KPIs financieros y operativos.
- Indicadores: saldo bancario, deuda vencida, deuda por vencer, ventas del mes, oportunidades abiertas, tareas pendientes.
- Acciones: filtros por periodo y rol, exportación de reportes, enlaces a detalle.
- Roles: admin, finanzas, ventas (convisibilidad adaptada según permisos).

## 2. Configuración de empresa
- Datos legales: razón social, RUT, dirección, ciudad, contacto.
- Logo y configuración de la empresa.
- Acciones: editar, guardar, historial de cambios.
- Roles: admin.

## 3. Parámetros y tasas
- Parámetros de IVA, retención, condiciones y fechas vigentes.
- Acciones: crear, editar, desactivar, ver historial.
- Roles: admin, finanzas.

## 4. Usuarios
- Listado de usuarios del sistema.
- Crear, desactivar, cambiar rol y revisar actividad.
- Roles: admin.

## 5. Registro de auditoría
- Listado de eventos con filtros por usuario, tabla, fecha y acción.
- Acciones: consultar, exportar, buscar por texto.
- Roles: admin.

## 6. Proveedores
- Listado con búsqueda por nombre/RUT, filtros y paginación.
- Ficha del proveedor: contacto, medios de pago, cuentas bancarias, documentos, saldo pendiente, pagos, historial.
- Acciones: crear, editar, desactivar, anexar archivos, exportar.
- Roles: admin, finanzas.

## 7. Compras y documentos de compra
- Registro de facturas, exentas, notas de crédito y notas de débito.
- Validación de folio + tipo + proveedor.
- Acciones: crear, editar, anular, adjuntar PDF/XML, ver saldo.
- Roles: admin, finanzas.

## 8. Cuentas por pagar
- Vista con saldos, vencidos, próximos a vencer, agrupación por proveedor.
- Acciones: exportar Excel, filtrar por plazo y saldo.
- Roles: admin, finanzas.

## 9. Bancos
- Cuentas bancarias, movimientos, importación de cartolas, plantillas de mapeo, historial.
- Acciones: crear cuenta, importar archivo, ver vista previa, confirmar, revertir importación.
- Roles: admin, finanzas.

## 10. Pagos
- Registro de pagos por transferencia, cheque, efectivo u otro.
- Asignación a facturas por pagar con distribución por monto.
- Acciones: crear pago, aplicar a documentos, adjuntar comprobante, exportar nómina.
- Roles: admin, finanzas.

## 11. Conciliación bancaria
- Dos columnas: movimientos sin conciliar y pagos/cobros no relacionados.
- Sugerencias con puntaje y confirmación manual.
- Acciones: sugerir, conciliar, deshacer conciliación, exportar resumen.
- Roles: admin, finanzas.

## 12. CRM: clientes
- Listado con filtros, búsqueda por RUT/nombre y estado.
- Ficha 360: datos empresariales, contactos, oportunidades, actividades, cotizaciones y documentos.
- Acciones: crear, editar, desactivar, importar desde Excel.
- Roles: admin, ventas.

## 13. Pipeline de oportunidades
- Vista Kanban con etapas personalizables.
- Mover oportunidades entre etapas por mouse y teclado.
- Acciones: crear, editar, ganar, perder con motivo obligatorio, filtrar por ejecutivo.
- Roles: admin, ventas.

## 14. Actividades y tareas
- Registro de llamadas, reuniones, tareas y correos.
- Vista de tareas de hoy y vencidas.
- Roles: admin, ventas.

## 15. Cotizaciones
- Crear cotizaciones con líneas, descuentos y validación.
- Generar PDF, cambiar estado, convertir en venta si es aceptada.
- Roles: admin, ventas.

## 16. Ventas y documentos de venta
- Registro de ventas, clientes, montos, fechas de vencimiento y documentos asociados.
- Acciones: crear, editar, anular, exportar.
- Roles: admin, ventas, finanzas (lectura opcional).

## 17. Cuentas por cobrar
- Vista de antigüedad de deuda por cliente, ejecutivo y plazo.
- Acciones: filtrar, exportar, ver detalle.
- Roles: admin, finanzas, ventas.

## 18. Cobros / cobranza
- Registro de abonos, asignación a documentos y gestión de cobro.
- Roles: admin, finanzas, ventas.

## 19. SII / importación RCV
- Carga de archivos CSV del SII, vista previa y validación.
- Cruce con documentos y exportación de informes mensuales.
- Roles: admin, finanzas.

## 20. Informes y dashboard
- Libro de compras, libro de ventas, antigüedad, flujo de caja y KPI.
- Acciones: exportar Excel, ver detalle, filtrar por período.
- Roles: admin, finanzas, ventas (según alcance).

## 21. Fórmulas y validaciones reutilizables
- RUT, IVA, montos CLP, fechas de Santiago, cálculos de documento tributario.
- Se usan en cada formulario y en validación del backend.
- Roles: no aplica; son utilidades transversales.
