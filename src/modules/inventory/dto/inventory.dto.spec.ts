import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CreateInventoryDto } from './create-inventory.dto.js';
import { UpdateInventoryDto } from './update-inventory.dto.js';
import { CreateInventoryMovementDto } from './create-inventory-movement.dto.js';
import { UpdateInventoryMovementDto } from './update-inventory-movement.dto.js';
import { CreateMenuItemIngredientDto } from './create-menu-item-ingredient.dto.js';
import { UpdateMenuItemIngredientDto } from './update-menu-item-ingredient.dto.js';

describe('Inventory payload validation', () => {
  const pipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  const validate = (
    payload: unknown,
    metatype:
      | typeof CreateInventoryDto
      | typeof UpdateInventoryDto
      | typeof CreateInventoryMovementDto
      | typeof UpdateInventoryMovementDto
      | typeof CreateMenuItemIngredientDto
      | typeof UpdateMenuItemIngredientDto,
  ) => pipe.transform(payload, { type: 'body', metatype });
  const item = {
    codeProduct: 'INV-001',
    nameProduct: 'Carne',
    unitBase: 'GR',
    minimumStock: 500,
  };
  const uuid = '3f1c2a9e-8b7d-4c1e-9a55-2d6f0b7e4a10';
  const movement = {
    inventoryItemId: uuid,
    movementType: 'ENTRY',
    movementSource: 'PURCHASE',
    quantity: 250.125,
    performedByUserId: uuid,
  };
  const ingredient = {
    menuItemId: uuid,
    inventoryItemId: uuid,
    quantityRequired: 125.5,
  };

  it('keeps existing field names and permits defaults and false activation', async () => {
    const result = await validate(
      { ...item, codeProduct: ' INV-001 ', isActive: false },
      CreateInventoryDto,
    );
    expect(result.codeProduct).toBe('INV-001');
    expect(result.currentStock).toBeUndefined();
    expect(result.isActive).toBe(false);
  });
  it('requires minimumStock and rejects the old stock typo', async () => {
    const { minimumStock, ...withoutMinimum } = item;
    await expect(
      validate(withoutMinimum, CreateInventoryDto),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      validate({ ...item, currentStop: minimumStock }, CreateInventoryDto),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
  it.each([null, '', '100', -1, 0.0001, 1_000_000_000])(
    'rejects stock values incompatible with numeric(12,3)',
    async (currentStock) => {
      await expect(
        validate({ ...item, currentStock }, CreateInventoryDto),
      ).rejects.toBeInstanceOf(BadRequestException);
    },
  );
  it.each([
    'codeProduct',
    'nameProduct',
    'unitBase',
    'minimumStock',
    'currentStock',
    'isActive',
  ])('rejects clearing required item field %s on update', async (field) => {
    await expect(
      validate({ [field]: null }, UpdateInventoryDto),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
  it.each(['ENTRY', 'CONSUME', 'RETURN', 'ADJUSTMENT'])(
    'accepts canonical movement type %s',
    async (movementType) => {
      await expect(
        validate({ ...movement, movementType }, CreateInventoryMovementDto),
      ).resolves.toBeDefined();
    },
  );
  it.each(['ORDER', 'PURCHASE', 'MANUAL', 'SYSTEM'])(
    'accepts canonical movement source %s',
    async (movementSource) => {
      await expect(
        validate({ ...movement, movementSource }, CreateInventoryMovementDto),
      ).resolves.toBeDefined();
    },
  );
  it('rejects RETURM and permits nullable order references and reasons', async () => {
    await expect(
      validate(
        { ...movement, movementType: 'RETURM' },
        CreateInventoryMovementDto,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      validate(
        { ...movement, orderItemId: null, reason: null },
        CreateInventoryMovementDto,
      ),
    ).resolves.toBeDefined();
  });
  it.each([0.0001, 1_000_000_000, '250'])(
    'rejects invalid movement precision, range or types',
    async (quantity) => {
      await expect(
        validate({ ...movement, quantity }, CreateInventoryMovementDto),
      ).rejects.toBeInstanceOf(BadRequestException);
    },
  );
  it('validates UUIDs and preserves required fields in movement update schemas', async () => {
    await expect(
      validate(
        { ...movement, inventoryItemId: '123' },
        CreateInventoryMovementDto,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      validate(
        { ...movement, performedByUserId: null },
        CreateInventoryMovementDto,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      validate({ quantity: null }, UpdateInventoryMovementDto),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      validate({ reason: null }, UpdateInventoryMovementDto),
    ).resolves.toBeDefined();
  });
  it('accepts composite ingredient IDs and permits changing only its quantity', async () => {
    await expect(
      validate(ingredient, CreateMenuItemIngredientDto),
    ).resolves.toBeDefined();
    await expect(
      validate({ quantityRequired: 50.25 }, UpdateMenuItemIngredientDto),
    ).resolves.toBeDefined();
    await expect(
      validate({ menuItemId: uuid }, UpdateMenuItemIngredientDto),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
  it.each([0, -1, 0.0001, 1_000_000_000, null])(
    'rejects invalid ingredient quantities',
    async (quantityRequired) => {
      await expect(
        validate(
          { ...ingredient, quantityRequired },
          CreateMenuItemIngredientDto,
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    },
  );
});
