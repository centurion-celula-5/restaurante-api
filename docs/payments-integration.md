# Integración de pagos, notificaciones y auditoría (SPR1-05)

Se conserva la estructura de Kerin, los nombres de sus entidades, sus campos y
sus ENUM. `AuditLog` permanece en el módulo de pagos. La entidad de órdenes se
conserva como llegó a `develop` desde SPR1-02.

Se activan las relaciones que pide el diagrama y cuyos destinos ya existen:

- `payments.order_id` → `orders.id_order`.
- `notifications.recipient_user_id` → `users.id_user`.
- `audit_logs.user_id` → `users.id_user`.

Cada relación tiene una FK y conserva el índice existente. `RESTRICT` impide
borrar órdenes o usuarios referenciados. No se agregan relaciones inversas ni
se modifican las entidades de usuarios u órdenes para este cambio.

## Migraciones

```sh
npm run migration:run
npm run migration:generate -- src/database/migrations/SchemaCheck --check
```

La migración inicial de Kerin conserva su nombre y solo crea su versión antigua
de órdenes cuando esa tabla aún no existe. Así puede aplicarse sobre una base
que ya tenga las migraciones de `develop`.

`PrepareSharedOrders1791479959425` se ejecuta inmediatamente antes de
`UserAndOrderFoundations1791479959426`. Ese orden es intencional: reemplaza la
tabla antigua de órdenes del PR de Kerin únicamente cuando está vacía, para
permitir que SPR1-02 cree la versión canónica. Si encuentra órdenes antiguas
con datos, detiene la operación y conserva esos registros. La tabla canónica
que ya existe en una base de `develop` no se cambia.

`AlignNotificationsPaymentsAudit` cambia y elimina columnas del esquema antiguo;
su aplicación y reversión requieren que `audit_logs`, `notifications` y `payments`
estén vacías. Se bloquean las tablas y se comprueba esa condición antes de los
cambios. Si hay datos, se necesita una migración de datos; no se borran registros
automáticamente.

La última migración añade las tres FK. Si hay registros que apuntan a usuarios
u órdenes inexistentes, PostgreSQL rechaza la operación; corregir las referencias
antes de aplicarla. Las migraciones ya integradas de categorías y órdenes se
conservan sin cambios.

## Validación y alcance

El DTO de pagos acepta importes que caben en `numeric(12,2)`. Las actualizaciones
no permiten enviar `null` para campos obligatorios. El tipo de notificación puede
omitirse para usar `SYSTEM`, pero no puede ser `null`.

Las rutas de pagos reciben UUID, sin convertirlos a números. Los servicios
conservan el alcance de fundamentos del sprint; este ajuste no implementa el
CRUD de pagos, el envío de notificaciones ni un servicio de auditoría.

## Contrato de consulta de pagos (SPR2A)

Este cambio define los schemas, el DTO y el mapper. El cableado de validación
HTTP y la ejecución de consultas quedan pendientes de integrar la base común
del issue #16; no se habilitan operaciones de escritura ni se cargan relaciones.

El esquema de consulta permite filtrar por orden (`order_id`), método
(`payment_method`) y un rango inclusivo de `paid_at` (`paid_at_from` y
`paid_at_to`). Los filtros son opcionales. La paginación usa `page` desde 1 y
`limit` entre 1 y 100; si se omiten, sus valores son 1 y 20. Las fechas deben
incluir zona horaria y se representan como ISO 8601. Se rechazan filtros no
reconocidos, rangos invertidos y paginación vacía o no numérica.

Ejemplo válido:

```text
?order_id=3d0a1c42-cc7b-4d44-8f09-1a0a5ce8f7a4&payment_method=CARD&paid_at_from=2026-10-01T00:00:00.000Z&paid_at_to=2026-10-31T23:59:59.999Z&page=2&limit=25
```

Ejemplos inválidos:

```text
?order_id=not-a-uuid
?payment_method=CHECK
?page=&limit=101
?paid_at_from=2026-10-21T00:00:00.000Z&paid_at_to=2026-10-20T00:00:00.000Z
```

El DTO de salida contiene explícitamente `id_payment`, `order_id`, `amount`,
`payment_method`, `paid_at` y `created_at`. El importe se representa como una
cadena decimal con dos posiciones para conservar la escala monetaria
(`numeric(12,2)`); las fechas son cadenas ISO 8601 UTC. Ninguno de estos campos
es anulable y no se serializa la relación `order`.

Ejemplo de respuesta:

```json
{
  "id_payment": "9f20d9b2-c84e-4a8d-8ea9-28a61f2a3f15",
  "order_id": "3d0a1c42-cc7b-4d44-8f09-1a0a5ce8f7a4",
  "amount": "150000.00",
  "payment_method": "CARD",
  "paid_at": "2026-10-20T16:45:00.000Z",
  "created_at": "2026-10-20T16:45:01.000Z"
}
```
