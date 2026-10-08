# Fundamentos de inventario (SPR1-01)

Se conserva la clase `InventoryItems` de Eduardo y se exporta también como
`InventoryItem`. `UnitBase` conserva sus importaciones y ofrece el alias
`InventoryUnit`, con los valores `GR`, `ML` y `UN`.

El módulo registra las tres entidades: artículos, movimientos e ingredientes
del menú. El modelo completo del equipo contiene 14 entidades, 16 FK y 14 ENUM.

- `inventory_items.id_inventory_item` es UUID; `minimum_stock` corrige el nombre
  anterior `mininum_stock`. Las existencias y el mínimo son `numeric(12,3)`.
- `updated_at` se actualiza automáticamente con TypeORM.
- `MovementType` acepta `ENTRY`, `CONSUME`, `RETURN` y `ADJUSTMENT`.
- `MovementSource` acepta `ORDER`, `PURCHASE`, `MANUAL` y `SYSTEM`.
- El movimiento referencia un artículo y un usuario. La referencia al detalle
  de orden y el motivo son anulables, como en el diagrama.
- `menu_item_ingredients` tiene PK compuesta por `menu_item_id` e
  `inventory_item_id`, dos FK y `quantity_required numeric(12,3)`.
- Las cinco relaciones nuevas tienen índices: el índice de la PK compuesta
  cubre el lado de menú y se agrega uno para su lado de inventario.
- Un trigger impide actualizar o borrar movimientos registrados. Las
  correcciones se realizan con otro movimiento; los registros referenciados se
  protegen con `RESTRICT`.

## DTOs y rutas

Se conservan `codeProduct`, `nameProduct` y `unitBase` en la API. `currentStop`
se corrige a `currentStock`; se incorporan `minimumStock` e `isActive`.
Las rutas usan UUID y los campos obligatorios no aceptan `null` al actualizar.
Los números deben caber en `numeric(12,3)` y tener como máximo tres decimales.

```json
{
  "codeProduct": "INV-001",
  "nameProduct": "Carne molida",
  "unitBase": "GR",
  "currentStock": 2000.125,
  "minimumStock": 500,
  "isActive": true
}
```

Los DTOs de movimientos usan `inventoryItemId`, `movementType`, `movementSource`,
`quantity`, `performedByUserId`, `orderItemId` y `reason`. Los dos últimos admiten
`null`. Se valida precisión y rango; las reglas de signo según el tipo de
movimiento se resolverán en la lógica de negocio.

Los DTOs de ingredientes usan `menuItemId`, `inventoryItemId` y
`quantityRequired`. Al actualizar, solo se permite la cantidad; la identidad
compuesta no se modifica. El DTO de actualización de movimientos existe como
esquema del sprint, pero no habilita un endpoint para modificar su historial.

## Migración

```sh
npm run migration:run
npm run migration:generate -- src/database/migrations/SchemaCheck --check
```

La migración nueva conserva las nueve anteriores. Renombra la columna del ID
con `QueryRunner.renameColumn`, conservando UUID, existencias, nombres, estado y
fechas. Inicializa el stock mínimo de artículos anteriores en cero y luego
retira el valor predeterminado: los artículos nuevos deben proporcionar su
mínimo. Crea movimientos, ingredientes, ENUM e índices y agrega las cinco FK.

La reversión conserva los artículos anteriores. Se detiene si hay movimientos,
ingredientes o mínimos distintos de cero que se perderían al volver al esquema
anterior.

## Alcance del sprint

Este entregable completa enums, entidades, relaciones, DTOs, módulos y migración.
Los servicios conservan los stubs del proyecto. Crear un movimiento no cambia
automáticamente las existencias: el servicio futuro debe guardar el movimiento
y actualizar el stock en una misma transacción. CRUD, autenticación y flujos de
pedidos/pagos/notificaciones requieren implementaciones posteriores.
