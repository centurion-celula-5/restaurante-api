import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CreateCustomerDto } from './create-customer.dto.js';
import { UpdateCustomerDto } from './update-customer.dto.js';

describe('Customer payload validation', () => {
  const pipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  const body = {
    nameCustomer: 'Carlos',
    phoneCustomer: '3023828158',
    emailCustomer: 'carlos@example.test',
  };
  const create = (payload: unknown) =>
    pipe.transform(payload, { type: 'body', metatype: CreateCustomerDto });
  const update = (payload: unknown) =>
    pipe.transform(payload, { type: 'body', metatype: UpdateCustomerDto });
  it('preserves Jhon’s field names and normalizes strings', async () => {
    const customer = await create({
      ...body,
      nameCustomer: ' Carlos ',
      emailCustomer: ' CARLOS@EXAMPLE.TEST ',
    });
    expect(customer.nameCustomer).toBe('Carlos');
    expect(customer.emailCustomer).toBe('carlos@example.test');
  });
  it('limits the phone number to the diagram column length', async () => {
    await expect(
      create({ ...body, phoneCustomer: '1'.repeat(31) }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
  it.each(['nameCustomer', 'phoneCustomer', 'emailCustomer'])(
    'rejects null for required field %s on update',
    async (field) => {
      await expect(update({ [field]: null })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );
});
