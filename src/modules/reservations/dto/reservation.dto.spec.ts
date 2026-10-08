import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CreateReservationDto } from './create-reservation.dto.js';
import { UpdateReservationDto } from './update-reservation.dto.js';

describe('Reservation payload validation', () => {
  const pipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  const body = {
    customerId: '3f1c2a9e-8b7d-4c1e-9a55-2d6f0b7e4a10',
    tableId: '9f1c2a9e-8b7d-4c1e-9a55-2d6f0b7e4a10',
    startsAt: '2026-10-20T20:00:00-05:00',
    endsAt: '2026-10-20T21:00:00-05:00',
    partySize: 4,
  };
  const create = (payload: unknown) =>
    pipe.transform(payload, { type: 'body', metatype: CreateReservationDto });
  const update = (payload: unknown) =>
    pipe.transform(payload, { type: 'body', metatype: UpdateReservationDto });

  it('accepts a real interval and nullable optional notes', async () => {
    await expect(create({ ...body, notes: null })).resolves.toBeDefined();
    await expect(
      create({ ...body, endsAt: '2026-10-21T02:00:00Z' }),
    ).resolves.toBeDefined();
  });
  it.each([
    'PENDING',
    'CONFIRMED',
    'CHECKED_IN',
    'CANCELLED',
    'NO_SHOW',
    'COMPLETED',
  ])('accepts canonical reservation status %s', async (status) => {
    await expect(create({ ...body, status })).resolves.toBeDefined();
  });
  it.each(['CACELED', 'RESERVED', null])(
    'rejects an invalid status',
    async (status) => {
      await expect(create({ ...body, status })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );
  it.each([0, -1, 1.5, '4', 32768])(
    'rejects invalid guest counts',
    async (partySize) => {
      await expect(create({ ...body, partySize })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );
  it.each([
    '2026-10-20T20:00:00-05:00',
    '2026-10-20T19:00:00-05:00',
    '2026-10-21T00:30:00Z',
    '2026-02-30T21:00:00-05:00',
    '2026-10-20T21:00:00',
  ])(
    'rejects invalid or non-positive intervals, including different offsets',
    async (endsAt) => {
      await expect(create({ ...body, endsAt })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );
  it('requires both interval endpoints instead of a date called reservationId', async () => {
    const { startsAt, endsAt, ...withoutInterval } = body;
    await expect(
      create({ ...withoutInterval, reservationId: startsAt }),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      create({ ...body, reservationId: endsAt }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
  it.each(['customerId', 'tableId'])(
    'requires a valid UUID in %s',
    async (field) => {
      await expect(create({ ...body, [field]: '123' })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );
  it.each([
    'customerId',
    'tableId',
    'startsAt',
    'endsAt',
    'partySize',
    'status',
  ])('rejects clearing required field %s on update', async (field) => {
    await expect(update({ [field]: null })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
  it('allows partial updates and clearing nullable fields', async () => {
    await expect(
      update({ notes: null, cancelledAt: null }),
    ).resolves.toBeDefined();
    await expect(update({ endsAt: body.endsAt })).resolves.toBeDefined();
  });
});
