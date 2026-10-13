# Fundamentos de clientes, mesas y reservas (SPR1-03)

Se conservan los nombres `Customer`, `RestaurantTable` y `Reservation`, los módulos
de Jhon y sus campos de API en camelCase. Las tablas y columnas siguen el diagrama.

- `customers.phone_customer` es `varchar(30)`; `created_at` y `updated_at` se
  generan y actualizan automáticamente con tipo `timestamptz`.
- `RestaurantTable` usa la tabla `tables`. Sus columnas son `id_table`,
  `table_number`, `capacity`, `zone` y `status`; no incluye fechas en el diagrama.
- `capacity` y `reservations.guest_count` son `smallint` positivos (hasta 32767).
- Las zonas son `PLANTA1` y `PLANTA2`. Los estados de mesa son `AVAILABLE`,
  `OCCUPIED` y `OUT_OF_SERVICE`; no existe `RESERVED`.
- Las reservas tienen `starts_at`, `ends_at`, `guest_count`, `notes`,
  `cancelled_at`, `created_at` y `updated_at`, además de sus IDs y estado.
- Sus estados son `PENDING`, `CONFIRMED`, `CHECKED_IN`, `CANCELLED`, `NO_SHOW` y
  `COMPLETED`. El valor predeterminado es `PENDING`.
- El módulo registra `Reservation` en TypeORM. Se activan las FK reserva →
  cliente, reserva → mesa, orden → mesa y orden → reserva, con los índices
  correspondientes. La reserva de la orden mantiene su `UNIQUE` existente.

## Contrato de API

Los DTOs mantienen `nameCustomer`, `phoneCustomer`, `emailCustomer`, `tableNumber`,
`customerId`, `tableId` y `partySize`. Al implementar la persistencia, mapearlos a
las columnas correspondientes: `name_customer`, `phone_customer`,
`email_customer`, `table_number`, `customer_id`, `table_id` y `guest_count`.

La fecha que antes se llamaba `reservationId` se reemplaza por un intervalo real:

```json
{
  "customerId": "3f1c2a9e-8b7d-4c1e-9a55-2d6f0b7e4a10",
  "tableId": "9f1c2a9e-8b7d-4c1e-9a55-2d6f0b7e4a10",
  "startsAt": "2026-10-20T20:00:00-05:00",
  "endsAt": "2026-10-20T21:00:00-05:00",
  "partySize": 4,
  "status": "PENDING",
  "notes": null
}
```

El ID de reserva se genera como UUID en PostgreSQL. Las fechas deben incluir
zona horaria y el final debe ser posterior al inicio. Las actualizaciones
parciales no aceptan `null` para campos obligatorios; `notes` y `cancelledAt`
sí pueden limpiarse. Las tres rutas usan UUID y rechazan campos desconocidos.

## Migración y reglas del modelo

```sh
npm run migration:run
npm run migration:generate -- src/database/migrations/SchemaCheck --check
```

La nueva migración conserva las ocho anteriores y crea las tres tablas del
entregable. Los CHECK validan capacidades y aforos positivos e intervalos válidos.
Dos triggers impiden reservar más personas que la capacidad de la mesa o reducir
la capacidad por debajo del aforo de sus reservas existentes. La lectura de la
capacidad toma un bloqueo compartido sobre la mesa.

Una restricción de exclusión GiST, con `btree_gist`, impide solapamientos para
`PENDING`, `CONFIRMED` y `CHECKED_IN`. El rango es `[starts_at, ends_at)`: una
reserva puede empezar cuando termina otra. Reservas de mesas diferentes no se
bloquean entre sí. Se incluye un índice GiST sobre el rango temporal.

Estas reglas usan las [restricciones sobre rangos de PostgreSQL](https://www.postgresql.org/docs/current/rangetypes.html#RANGETYPES-CONSTRAINT)
y [triggers](https://www.postgresql.org/docs/current/plpgsql-trigger.html) para
comprobar el aforo relacionado con otra tabla.

Si ya existen órdenes con UUID de mesas/reservas inexistentes, la migración
rechaza las FK y revierte la transacción. Se necesita una migración de datos que
relacione esos registros; no se crean mesas ficticias ni se borran órdenes.
La reversión requiere las tres tablas nuevas vacías para conservar sus datos.

Los servicios mantienen los stubs del sprint. Este entregable prepara el modelo,
las validaciones, los repositorios y las restricciones; no implementa el CRUD
ni las transiciones de estados de negocio.
