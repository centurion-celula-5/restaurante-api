import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CreateTableDto } from './create-table.dto.js';
import { UpdateTableDto } from './update-table.dto.js';

describe('Table payload validation', () => {
  const pipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  const body = { tableNumber: 'T-01', capacity: 4, zone: 'PLANTA1' };
  const create = (payload: unknown) =>
    pipe.transform(payload, { type: 'body', metatype: CreateTableDto });
  const update = (payload: unknown) =>
    pipe.transform(payload, { type: 'body', metatype: UpdateTableDto });
  it('trims the table number and accepts the smallint upper bound', async () => {
    const table = await create({
      ...body,
      tableNumber: ' T-01 ',
      capacity: 32767,
    });
    expect(table.tableNumber).toBe('T-01');
  });
  it.each([0, -1, 1.5, 32768])(
    'rejects invalid capacities',
    async (capacity) => {
      await expect(create({ ...body, capacity })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );
  it.each(['AVAILABLE', 'OCCUPIED', 'OUT_OF_SERVICE'])(
    'accepts canonical table status %s',
    async (status) => {
      await expect(update({ status })).resolves.toBeDefined();
    },
  );
  it('rejects RESERVED, an invalid zone and blank table numbers', async () => {
    await expect(update({ status: 'RESERVED' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(create({ ...body, zone: 'TERRACE' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(
      create({ ...body, tableNumber: '   ' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
  it.each(['tableNumber', 'capacity', 'zone', 'status'])(
    'rejects null in required field %s on update',
    async (field) => {
      await expect(update({ [field]: null })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );
});
