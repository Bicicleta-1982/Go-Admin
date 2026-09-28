# Preguntas pendientes

1. ¿La empresa necesita soporte para UF y USD solo como referencia, o también como operaciones reales?
2. ¿Se requiere controlar proveedores y clientes con varios contactos y varias cuentas bancarias?
3. ¿La empresa quiere un flujo de aprobación de cotizaciones o solo un proceso simple de venta?
4. ¿Hay datos reales o demo para usar en el seed de desarrollo? Si son reales, deben mantenerse fuera del entorno de prueba.
5. ¿La empresa ya tiene un dominio, correo institucional y plan de soporte para despliegue en Vercel/Supabase?
6. ¿Necesita que el sistema incluya inventario en una fase posterior o puede quedar fuera del alcance actual?
7. ¿Hay un responsable interno para revisar y validar los reportes de IVA y SII antes de usarlos formalmente?
8. ¿Se requiere acceso a un asesor externo para la revisión de la información entregada por el sistema?

### Decisiones ya aprobadas
- Soporte de UF/USD como referencia y operación real, con tipo de cambio y fecha registrados.
- La app debe mostrar saldos bancarios en tiempo real a ventas, no solo a finanzas/admin.
- Un vendedor solo ve sus clientes y oportunidades; el administrador ve todos.
- La versión inicial se centra en importación manual SII, no facturación electrónica directa.
- El proyecto se implementará con infraestructura nueva desde cero: Supabase + Vercel.
