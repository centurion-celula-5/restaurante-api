# Fundamentos de usuarios y órdenes (SPR1-02)

Este entregable registra las entidades y repositorios de `users`, `orders` y
`order_items`. Los servicios de usuarios, órdenes y autenticación conservan los
stubs del sprint; todavía no guardan solicitudes HTTP, calculan precios del menú
ni implementan autenticación o hashing de contraseñas.

## Contrato del modelo

- `UserRole`: `ADMIN`, `EMPLOYEE`; el valor predeterminado es `EMPLOYEE`.
- `OrderStatus`: `PENDING`, `PREPARATION`, `DELIVERED`, `PAID`.
- `OrderItemStatus`: `PENDING`, `PREPARATION`, `READY`, `DELIVERED`, `CANCELLED`.
- Ambas entidades de órdenes usan `PENDING` por defecto y tienen `created_at` y
  `updated_at` con tipo `timestamptz`.
- `order_items.menu_item_id` referencia `menu_items.id_menu_item`. El nombre
  anterior `product_id` ya no pertenece al contrato.
- `orders.created_by_user_id` referencia `users.id_user` y
  `order_items.order_id` referencia `orders.id_order`.
- Las tres relaciones tienen FK e índices; eliminar registros referenciados
  se rechaza con `RESTRICT` para conservar el historial.
- `orders.reservation_id` admite `NULL` y tiene una restricción `UNIQUE`: una
  reserva solo puede originar una orden, pero pueden existir varias órdenes sin
  reserva.
- `unit_price` y `subtotal` son `numeric(12,2)`. El subtotal se genera en PostgreSQL
  como `quantity * unit_price`; el precio histórico se guarda en cada línea.

## Dependencia de SPR1-03

En `develop`, `Table` y `Reservation` todavía son clases vacías sin `@Entity`.
Por eso `table_id` y `reservation_id` se conservan como columnas UUID; todavía
no verifican la existencia de mesas o reservas en PostgreSQL. No se pueden activar
relaciones TypeORM contra esas clases sin impedir el arranque y las migraciones.

Al integrar el entregable de mesas y reservas, se deben añadir las relaciones a
`Table.id_table` y `Reservation.id_reservation`, y una nueva migración con ambas
FK. `table_id` ya tiene índice; la restricción única de `reservation_id` crea su
índice. Antes de añadir las FK, validar que los UUID almacenados correspondan a
registros existentes. Este PR no completa esa dependencia.

## Validación HTTP

Los controladores de usuarios y órdenes validan sus DTOs, rechazan campos
desconocidos y conservan los IDs UUID como cadenas. Los campos obligatorios no
aceptan `null` al actualizar; los campos anulables sí pueden limpiarse.

Ejemplo del contrato para crear una orden:

```json
{
  "table_id": "7d2a1f60-4b3c-4e8a-9f15-6c1d0b5e2a44",
  "status": "PENDING",
  "items": [
    {
      "menu_item_id": "3f1c9a52-8e4b-4d7a-9c10-2b6e5d8a7f31",
      "quantity": 2
    }
  ]
}
```

`status` es opcional. `created_by_user_id` y los precios se resolverán desde el
usuario autenticado y el menú cuando se implemente el servicio; no se reciben
como datos libres del cliente.

## Migraciones

Configurar la conexión PostgreSQL en `.env` y aplicar las migraciones pendientes:

```sh
npm run migration:run
```

La migración de SPR1-02 crea `orders` y `order_items`, sus índices y FK, y renombra
el valor anterior del ENUM de usuarios de `WAITER` a `EMPLOYEE`. Renombrar el valor
conserva los usuarios existentes y permite revertir el cambio sin borrarlos.

Las migraciones anteriores de `develop` se conservan. La conversión de categorías
y menú que llegó en SPR1-04 exige esas dos tablas vacías; si ya contienen datos,
ver [menu-model.md](menu-model.md) antes de aplicar las migraciones pendientes.

Después de modificar entidades, generar **otra** migración y revisar su SQL:

```sh
npm run migration:generate -- src/database/migrations/NombreDelCambio
npm run migration:run
```

No editar migraciones que otros compañeros ya hayan aplicado. Para comprobar que
las entidades y las migraciones coinciden:

```sh
npm run migration:generate -- src/database/migrations/SchemaCheck --check
```
