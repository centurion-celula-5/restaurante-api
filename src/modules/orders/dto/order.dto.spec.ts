import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CreateOrderDto } from './create-order.dto.js';
import { UpdateOrderDto } from './update-order.dto.js';

describe('Order payload validation', () => {
  const pipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  const table_id = '7d2a1f60-4b3c-4e8a-9f15-6c1d0b5e2a44';
  const menu_item_id = '3f1c9a52-8e4b-4d7a-9c10-2b6e5d8a7f31';
  const body = { table_id, items: [{ menu_item_id, quantity: 2 }] };
  const create = (payload: unknown) =>
    pipe.transform(payload, { type: 'body', metatype: CreateOrderDto });
  const update = (payload: unknown) =>
    pipe.transform(payload, { type: 'body', metatype: UpdateOrderDto });

  it('accepts canonical menu item IDs and an omitted status', async () => {
    const result = await create(body);
    expect(result.items[0].menu_item_id).toBe(menu_item_id);
    expect(result.status).toBeUndefined();
  });

  it.each(['PENDING', 'PREPARATION', 'DELIVERED', 'PAID'])(
    'accepts canonical order status %s',
    async (status) => {
      await expect(create({ ...body, status })).resolves.toBeDefined();
    },
  );

  it.each(['pending', 'CANCELLED', null])(
    'rejects an invalid order status',
    async (status) => {
      await expect(create({ ...body, status })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );

  it.each([0, -1, 1.5, '2', 2_147_483_648])(
    'rejects an invalid item quantity',
    async (quantity) => {
      await expect(
        create({ table_id, items: [{ menu_item_id, quantity }] }),
      ).rejects.toBeInstanceOf(BadRequestException);
    },
  );

  it.each([[], null, [{ menu_item_id, quantity: 1 }, null]])(
    'rejects missing or invalid items',
    async (items) => {
      await expect(create({ table_id, items })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );

  it('rejects legacy product IDs and client supplied historical prices', async () => {
    await expect(
      create({ table_id, items: [{ product_id: menu_item_id, quantity: 1 }] }),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      create({
        table_id,
        items: [{ menu_item_id, quantity: 1, unit_price: 0 }],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('validates table, reservation and menu UUIDs', async () => {
    await expect(create({ ...body, table_id: '123' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(
      create({ ...body, reservation_id: '123' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      create({ table_id, items: [{ menu_item_id: '123', quantity: 1 }] }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('allows clearing the nullable reservation and changing only the status', async () => {
    await expect(update({ reservation_id: null })).resolves.toBeDefined();
    await expect(update({ status: 'PAID' })).resolves.toBeDefined();
  });

  it.each(['table_id', 'items', 'status'])(
    'rejects clearing required %s during an update',
    async (field) => {
      await expect(update({ [field]: null })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );
});
