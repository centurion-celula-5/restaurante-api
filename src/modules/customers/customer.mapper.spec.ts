import { Customer } from './entities/customer.entity.js';
import { toCustomerResponse } from './customer.mapper.js';

describe('toCustomerResponse', () => {
  const entity = Object.assign(new Customer(), {
    id_customer: '3f1c2a9e-8b7d-4c1e-9a55-2d6f0b7e4a10',
    name_customer: 'Carlos Perez',
    phone_customer: '3023828158',
    email_customer: 'carlos@example.test',
    created_at: new Date('2026-10-18T15:00:00.000Z'),
    updated_at: new Date('2026-10-18T16:30:00.000Z'),
    reservations: [{ id: 'no-debe-salir' }],
  });

  it('devuelve exactamente los campos del DTO de salida', () => {
    const result = toCustomerResponse(entity);
    expect(Object.keys(result)).toEqual([
      'idCustomer',
      'nameCustomer',
      'phoneCustomer',
      'emailCustomer',
      'createdAt',
      'updatedAt',
    ]);
  });

  it('mapea los valores y formatea las fechas en ISO', () => {
    expect(toCustomerResponse(entity)).toEqual({
      idCustomer: '3f1c2a9e-8b7d-4c1e-9a55-2d6f0b7e4a10',
      nameCustomer: 'Carlos Perez',
      phoneCustomer: '3023828158',
      emailCustomer: 'carlos@example.test',
      createdAt: '2026-10-18T15:00:00.000Z',
      updatedAt: '2026-10-18T16:30:00.000Z',
    });
  });

  it('no filtra propiedades extra de la entidad', () => {
    const result = toCustomerResponse(entity) as unknown as Record<
      string,
      unknown
    >;
    expect(result).not.toHaveProperty('reservations');
    expect(result).not.toHaveProperty('id_customer');
  });
});
