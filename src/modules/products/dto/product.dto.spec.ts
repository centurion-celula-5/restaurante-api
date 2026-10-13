import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CreateProductDto } from './create-product.dto.js';
import { UpdateProductDto } from './update-product.dto.js';

describe('Menu item payload validation', () => {
  const pipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  const payload = { name_dish: 'Sopa', unit_price: 12000.5, category_id: 1 };

  const create = (value: unknown) =>
    pipe.transform(value, { type: 'body', metatype: CreateProductDto });

  const update = (value: unknown) =>
    pipe.transform(value, { type: 'body', metatype: UpdateProductDto });

  it('accepts the diagram fields without requiring values that have database defaults', async () => {
    const product = await create({
      ...payload,
      name_dish: '  Sopa  ',
      description: null,
    });
    expect(product.name_dish).toBe('Sopa');
    expect(product.category_id).toBe(1);
    expect(product.description).toBeNull();
  });

  it.each([
    { state: 'ACTIVE', availability: 'AVAILABLE' },
    { state: 'INACTIVE', availability: 'UNAVAILABLE' },
  ])('accepts valid state and availability values', async (enums) => {
    await expect(create({ ...payload, ...enums })).resolves.toBeDefined();
  });

  it.each([1, 'ACTIVE', null])(
    'rejects invalid availability',
    async (availability) => {
      await expect(create({ ...payload, availability })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );

  it.each(['AVAILABLE', 'active', null])(
    'rejects invalid state',
    async (state) => {
      await expect(create({ ...payload, state })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );

  it.each([0, 1.5, 2_147_483_648, '461f03d0-3e4e-40f5-b34d-e26d34b47ff0'])(
    'requires a positive integer category ID',
    async (category_id) => {
      await expect(create({ ...payload, category_id })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );

  it.each([-1, 12.345, 10_000_000_000])(
    'rejects negative prices or values outside numeric(12,2)',
    async (unit_price) => {
      await expect(create({ ...payload, unit_price })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );

  it('rejects the legacy quantity field instead of treating it as availability', async () => {
    await expect(
      create({ ...payload, available_quantity: 1 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('accepts an availability-only update', async () => {
    await expect(
      update({ availability: 'UNAVAILABLE' }),
    ).resolves.toBeDefined();
  });

  it.each(['unit_price', 'category_id'])(
    'rejects null for a required column during an update',
    async (field) => {
      await expect(update({ [field]: null })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );
});
