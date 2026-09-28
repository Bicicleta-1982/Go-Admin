# Modelo de datos

## 1. Principios del modelo

- El modelo usa inglés para tablas, columnas y relaciones.
- Las cantidades financieras se almacenan como enteros (`bigint`) en CLP.
- Los campos de fecha usan `timestamp with time zone` y se convierten a la zona horaria de Santiago en la capa de presentación.
- Los cambios relevantes se registran en `audit_log`.
- Los registros financieros no se eliminan; se marcan anulados.
- El manejador de archivos usa `attachments` y referencias simples a cada entidad.

## 2. Tablas transversales

### profiles
- id: uuid pk
- email: text unique
- full_name: text
- rut: text unique nullable
- role: text check (`admin`, `finanzas`, `ventas`, `lectura`)
- is_active: boolean
- created_at, updated_at
- deleted_at nullable

### company_settings
- id: uuid pk
- company_name: text
- rut: text
- address: text
- city: text
- phone: text
- email: text
- logo_url: text nullable
- fiscal_address: text nullable
- default_currency: text default `CLP`
- created_at, updated_at

### settings
- id: uuid pk
- key: text unique
- value: text
- description: text nullable
- valid_from: timestamp
- valid_to: timestamp nullable
- created_by: uuid fk profiles.id
- created_at

### audit_log
- id: uuid pk
- table_name: text
- record_id: uuid
- action: text
- user_id: uuid nullable fk profiles.id
- reason: text nullable
- metadata: jsonb
- created_at

### attachments
- id: uuid pk
- entity_type: text
- entity_id: uuid
- file_name: text
- mime_type: text
- file_size: bigint
- storage_path: text
- uploaded_by: uuid fk profiles.id
- created_at

### tax_document_types
- id: uuid pk
- sii_code: text unique
- name: text
- description: text nullable
- is_active: boolean
- created_at

Ejemplos de códigos SII: 33 factura, 34 exenta, 56 nota débito, 61 nota crédito, etc.

## 3. Proveedores

### suppliers
- id: uuid pk
- company_name: text
- rut: text unique
- business_activity: text nullable
- contact_email: text nullable
- phone: text nullable
- address: text nullable
- city: text nullable
- payment_terms_days: integer default 30
- status: text default `active`
- notes: text nullable
- created_at, updated_at
- is_deleted boolean default false

### supplier_contacts
- id: uuid pk
- supplier_id: uuid fk suppliers.id
- name: text
- position: text nullable
- email: text nullable
- phone: text nullable
- is_primary: boolean
- created_at

### supplier_bank_accounts
- id: uuid pk
- supplier_id: uuid fk suppliers.id
- bank_name: text
- account_type: text
- account_number: text
- iban: text nullable
- is_primary: boolean
- created_at

### purchase_documents
- id: uuid pk
- supplier_id: uuid fk suppliers.id
- tax_document_type_id: uuid fk tax_document_types.id
- folio: text
- issue_date: date
- due_date: date
- net_amount: bigint
- exempt_amount: bigint default 0
- tax_amount: bigint default 0
- total_amount: bigint
- status: text check (`pending`, `partial_paid`, `paid`, `cancelled`)
- glosa: text nullable
- cost_center: text nullable
- source: text default `manual`
- reference_id: uuid nullable
- is_deleted boolean default false
- created_at, updated_at

### purchase_document_lines
- id: uuid pk
- purchase_document_id: uuid fk purchase_documents.id
- description: text
- qty: numeric nullable
- unit_price: bigint nullable
- net_amount: bigint
- tax_amount: bigint
- total_amount: bigint
- created_at

### payables
- id: uuid pk
- supplier_id: uuid fk suppliers.id
- purchase_document_id: uuid fk purchase_documents.id nullable
- due_date: date
- amount_due: bigint
- status: text
- created_at

## 4. Bancos

### bank_accounts
- id: uuid pk
- bank_name: text
- account_type: text
- account_number: text
- currency: text default `CLP`
- opening_balance: bigint
- opening_balance_date: date
- is_active: boolean
- created_at

### bank_statements
- id: uuid pk
- bank_account_id: uuid fk bank_accounts.id
- imported_by: uuid fk profiles.id
- file_name: text
- file_hash: text
- import_date: timestamp
- status: text check (`preview`, `imported`, `reverted`)
- created_at

### bank_transactions
- id: uuid pk
- bank_account_id: uuid fk bank_accounts.id
- bank_statement_id: uuid nullable fk bank_statements.id
- movement_date: date
- description: text
- reference: text nullable
- transaction_type: text check (`debit`, `credit`)
- amount: bigint
- balance_after: bigint
- is_reconciled: boolean default false
- matched_document_id: uuid nullable
- created_at

### payments
- id: uuid pk
- supplier_id: uuid fk suppliers.id
- bank_account_id: uuid fk bank_accounts.id
- payment_date: date
- amount: bigint
- payment_method: text check (`transfer`, `check`, `cash`, `other`)
- attachment_id: uuid nullable fk attachments.id
- status: text
- created_at

### payment_allocations
- id: uuid pk
- payment_id: uuid fk payments.id
- purchase_document_id: uuid fk purchase_documents.id
- allocated_amount: bigint
- created_at

### reconciliations
- id: uuid pk
- bank_transaction_id: uuid fk bank_transactions.id
- payment_id: uuid nullable fk payments.id
- collection_id: uuid nullable
- reconciled_by: uuid fk profiles.id
- reconciled_at: timestamp
- reason: text nullable
- status: text

### bank_import_templates
- id: uuid pk
- bank_name: text
- template_name: text
- mapping: jsonb
- created_by: uuid fk profiles.id
- created_at

## 5. CRM y ventas

### customers
- id: uuid pk
- customer_type: text check (`person`, `company`)
- name: text
- rut: text unique nullable
- business_activity: text nullable
- address: text nullable
- city: text nullable
- phone: text nullable
- email: text nullable
- payment_terms_days: integer default 30
- executive_id: uuid fk profiles.id
- status: text check (`prospect`, `active`, `inactive`)
- created_at, updated_at

### customer_contacts
- id: uuid pk
- customer_id: uuid fk customers.id
- name: text
- position: text nullable
- email: text nullable
- phone: text nullable
- is_primary: boolean
- created_at

### opportunities
- id: uuid pk
- customer_id: uuid fk customers.id
- title: text
- description: text nullable
- amount: bigint
- probability: integer
- stage_id: uuid fk pipeline_stages.id
- expected_close_date: date
- assigned_to: uuid fk profiles.id
- status: text default `open`
- loss_reason: text nullable
- created_at, updated_at

### pipeline_stages
- id: uuid pk
- name: text
- order_index: integer
- is_active: boolean

### activities
- id: uuid pk
- customer_id: uuid nullable fk customers.id
- opportunity_id: uuid nullable fk opportunities.id
- activity_type: text check (`call`, `meeting`, `email`, `task`)
- title: text
- notes: text nullable
- scheduled_at: timestamp
- due_date: date nullable
- assigned_to: uuid fk profiles.id
- status: text default `pending`
- created_at

### products_services
- id: uuid pk
- code: text unique
- name: text
- description: text nullable
- unit_price: bigint
- tax_type: text check (`taxable`, `exempt`)
- is_active: boolean
- created_at

### quotes
- id: uuid pk
- customer_id: uuid fk customers.id
- quote_number: text unique
- issue_date: date
- validity_days: integer
- subtotal: bigint
- discount: bigint default 0
- tax_amount: bigint
- total_amount: bigint
- status: text check (`draft`, `sent`, `accepted`, `rejected`, `expired`)
- created_at, updated_at

### quote_lines
- id: uuid pk
- quote_id: uuid fk quotes.id
- product_service_id: uuid fk products_services.id
- description: text
- quantity: numeric
- unit_price: bigint
- discount: bigint default 0
- subtotal: bigint
- total_amount: bigint

### sales_documents
- id: uuid pk
- customer_id: uuid fk customers.id
- tax_document_type_id: uuid fk tax_document_types.id
- folio: text
- issue_date: date
- due_date: date
- net_amount: bigint
- exempt_amount: bigint default 0
- tax_amount: bigint
- total_amount: bigint
- status: text default `pending`
- invoice_source: text
- created_at, updated_at

### receivables
- id: uuid pk
- customer_id: uuid fk customers.id
- sales_document_id: uuid fk sales_documents.id nullable
- due_date: date
- amount_due: bigint
- status: text
- created_at

### collections
- id: uuid pk
- customer_id: uuid fk customers.id
- collection_date: date
- amount: bigint
- payment_method: text
- notes: text nullable
- created_at

## 6. SII y integraciones

### sii_imports
- id: uuid pk
- import_type: text check (`purchase`, `sales`)
- period_month: integer
- period_year: integer
- file_name: text
- imported_by: uuid fk profiles.id
- imported_at: timestamp
- status: text check (`preview`, `validated`, `completed`, `rejected`)
- summary: jsonb

### sii_discrepancies
- id: uuid pk
- sii_import_id: uuid fk sii_imports.id
- entity_type: text
- entity_id: uuid nullable
- discrepancy_type: text
- description: text
- amount_delta: bigint nullable
- status: text
- created_at

## 7. Relaciones clave

- `profiles` 1:N con `audit_log`, `settings`, `attachments`, `bank_statements`.
- `suppliers` 1:N con `supplier_contacts`, `supplier_bank_accounts`, `purchase_documents`, `payables`, `payments`.
- `purchase_documents` 1:N con `purchase_document_lines`, `payment_allocations`, `payables`.
- `bank_accounts` 1:N con `bank_statements`, `bank_transactions`, `payments`.
- `customers` 1:N con `customer_contacts`, `opportunities`, `quotes`, `sales_documents`, `receivables`, `collections`.
- `tax_document_types` 1:N con `purchase_documents` y `sales_documents`.
- `sii_imports` 1:N con `sii_discrepancies`.

## 8. Políticas RLS sugeridas

Las políticas deben basarse en un modelo de permisos por rol.

- `profiles`: admin puede ver/editar todos; ventas/finanzas solo ven perfiles con permisos de negocio; lectura solo su propio perfil.
- `company_settings`: admin únicamente; finanzas/ventas pueden leer si se requiere.
- `settings`: admin y finanzas pueden leer; admin modifica.
- `audit_log`: admin solo lectura; otras filas no visibles.
- `suppliers`, `purchase_documents`, `payables`, `payments`: finanzas y admin.Editar; ventas solo lectura si es necesario para CRM.
- `customers`, `opportunities`, `quotes`, `sales_documents`, `collections`: ventas y admin pueden editar; lectura para finanzas si se revisan cobranzas.
- `bank_accounts`, `bank_statements`, `bank_transactions`, `reconciliations`: finanzas y admin.
- `attachments`: usuario dueño + roles autorizados.

## 9. FASE FUTURA (comentadas)

Estas tablas quedan reservadas para fases futuras y no bloquean el diseño actual:

- `employees`
- `payroll_runs`
- `payroll_items`
- `contracts`
- `contract_documents`
- `inventory_items`
- `inventory_movements`
- `stock_locations`

Esto permite que el modelo base sea extensible sin introducir acoplamientos indebidos o dependencias funcionales prematuras.
