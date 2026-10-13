# Fundamentos de categorías y menú

Estas entidades y DTOs siguen el modelo relacional canónico del equipo.

- `categories.id_category` es INTEGER IDENTITY y se genera en PostgreSQL.
- `categories.name_category` es obligatorio, único y admite hasta 50 caracteres.
- `categories.status` acepta `ACTIVE` o `INACTIVE`; su valor inicial es `ACTIVE`.
- `menu_items.id_menu_item` es UUID y se genera en PostgreSQL.
- `menu_items.category_id` es INTEGER, obligatorio y referencia una categoría existente. No es autoincremental. Su FK tiene un índice.
- `menu_items.state` acepta `ACTIVE` o `INACTIVE`; su valor inicial es `ACTIVE`.
- `menu_items.availability` acepta `AVAILABLE` o `UNAVAILABLE`; su valor inicial es `AVAILABLE`.
- Las dos descripciones admiten `NULL`. Estas dos tablas no incluyen columnas de fechas en el diagrama.

Los módulos registran sus entidades en TypeORM. La relación es una categoría con muchos productos de menú; no se puede eliminar una categoría que todavía tenga productos.

## Datos de entrada

Ejemplo para crear una categoría:

```json
{
  "name_category": "Entradas",
  "description": null,
  "status": "ACTIVE"
}
```

Ejemplo para crear un producto de menú:

```json
{
  "name_dish": "Sopa",
  "unit_price": 12000.5,
  "category_id": 1,
  "state": "ACTIVE",
  "availability": "AVAILABLE"
}
```

Los estados y descripciones son opcionales al crear un registro. El precio debe ser no negativo, tener como máximo dos decimales y caber en NUMERIC(12,2). Las actualizaciones permiten enviar solo los campos que cambian; los campos obligatorios del modelo no admiten `NULL`.

Los DTOs usan `name_category`, `category_id`, `state` y `availability`. Los campos anteriores `name`, `parent_category_id`, `id_category`, `status` de producto y `available_quantity` no forman parte de estos cuerpos de entrada. Las rutas de categoría usan IDs enteros; las rutas de producto usan UUID.

## Migración del esquema

La migración anterior se conserva. `CanonicalCategoryAndMenu` aplica el ajuste al modelo canónico como una migración nueva:

```bash
npm run migration:run
```

El esquema anterior del PR tenía categorías con IDs UUID y productos sin categoría. Por eso esta migración y su reversión requieren que `categories` y `menu_items` estén vacías. Ambas tablas se bloquean y se comprueba que no tengan registros antes de cambiar columnas. Si ya contienen datos, la operación se detiene y revierte la transacción; se necesita una migración de datos que conserve y relacione esos registros antes de continuar.

## Alcance

Estos cambios preparan enums, entidades, relaciones, DTOs y módulos. Los servicios conservan los métodos de ejemplo generados por Nest; la persistencia de los endpoints CRUD se implementará en otra tarea.
