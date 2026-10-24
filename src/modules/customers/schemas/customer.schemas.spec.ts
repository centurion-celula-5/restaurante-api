import { ValidationPipe } from '@nestjs/common';
import { CreateCustomerDto } from '../dto/create-customer.dto.js';
import {
  createCustomerSchema,
  customerIdSchema,
  listCustomersQuerySchema,
  updateCustomerSchema,
} from './customer.schemas.js';

const validBody = {
  nameCustomer: 'Carlos',
  phoneCustomer: '3023828158',
  emailCustomer: 'carlos@example.test',
};

describe('createCustomerSchema', () => {
  it('acepta un cuerpo válido y lo normaliza', () => {
    const result = createCustomerSchema.safeParse({
      nameCustomer: ' Carlos ',
      phoneCustomer: '3023828158',
      emailCustomer: ' CARLOS@EXAMPLE.TEST ',
    });
    expect(result.success).toBe(true);
    expect(result.data).toEqual(validBody);
  });

  it('acepta un teléfono de exactamente 30 caracteres', () => {
    const result = createCustomerSchema.safeParse({
      ...validBody,
      phoneCustomer: '1'.repeat(30),
    });
    expect(result.success).toBe(true);
  });

  it('rechaza un teléfono de 31 caracteres', () => {
    const result = createCustomerSchema.safeParse({
      ...validBody,
      phoneCustomer: '1'.repeat(31),
    });
    expect(result.success).toBe(false);
  });

  it('rechaza claves desconocidas', () => {
    const result = createCustomerSchema.safeParse({ ...validBody, role: 'x' });
    expect(result.success).toBe(false);
  });

  it('rechaza un email con formato inválido', () => {
    const result = createCustomerSchema.safeParse({
      ...validBody,
      emailCustomer: 'nope',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza si falta un campo obligatorio', () => {
    const result = createCustomerSchema.safeParse({ nameCustomer: 'Carlos' });
    expect(result.success).toBe(false);
  });
});

describe('updateCustomerSchema', () => {
  it('acepta un solo campo', () => {
    expect(
      updateCustomerSchema.safeParse({ phoneCustomer: '300' }).success,
    ).toBe(true);
  });

  it.each(['nameCustomer', 'phoneCustomer', 'emailCustomer'])(
    'rechaza null en %s',
    (field) => {
      expect(updateCustomerSchema.safeParse({ [field]: null }).success).toBe(
        false,
      );
    },
  );
});

describe('customerIdSchema', () => {
  it('acepta un UUID válido', () => {
    expect(
      customerIdSchema.safeParse('3f1c2a9e-8b7d-4c1e-9a55-2d6f0b7e4a10')
        .success,
    ).toBe(true);
  });

  it('rechaza un UUID inválido', () => {
    expect(customerIdSchema.safeParse('abc').success).toBe(false);
  });
});

describe('listCustomersQuerySchema', () => {
  it('aplica valores por defecto', () => {
    expect(listCustomersQuerySchema.parse({})).toEqual({ page: 1, limit: 10 });
  });

  it('convierte strings a número', () => {
    const result = listCustomersQuerySchema.parse({ page: '2', limit: '20' });
    expect(result).toEqual({ page: 2, limit: 20 });
  });

  it('rechaza limit de 500', () => {
    expect(listCustomersQuerySchema.safeParse({ limit: '500' }).success).toBe(
      false,
    );
  });

  it('rechaza un filtro vacío', () => {
    expect(
      listCustomersQuerySchema.safeParse({ nameCustomer: '  ' }).success,
    ).toBe(false);
  });
});

describe('paridad entre Zod y class-validator (CreateCustomerDto)', () => {
  const pipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  const cases: [string, unknown][] = [
    ['válido', validBody],
    [
      'válido con espacios y mayúsculas',
      {
        nameCustomer: ' Carlos ',
        phoneCustomer: ' 3023828158 ',
        emailCustomer: ' CARLOS@EXAMPLE.TEST ',
      },
    ],
    ['teléfono de 30', { ...validBody, phoneCustomer: '1'.repeat(30) }],
    ['teléfono de 31', { ...validBody, phoneCustomer: '1'.repeat(31) }],
    ['nombre de 150', { ...validBody, nameCustomer: 'a'.repeat(150) }],
    ['nombre de 151', { ...validBody, nameCustomer: 'a'.repeat(151) }],
    ['nombre solo espacios', { ...validBody, nameCustomer: '   ' }],
    ['email inválido', { ...validBody, emailCustomer: 'nope' }],
    ['clave extra', { ...validBody, role: 'x' }],
    [
      'falta phoneCustomer',
      { nameCustomer: 'Carlos', emailCustomer: 'a@b.co' },
    ],
  ];

  it.each(cases)('mismo veredicto en: %s', async (_label, payload) => {
    const zodAccepts = createCustomerSchema.safeParse(payload).success;

    let classValidatorAccepts = true;
    try {
      await pipe.transform(payload, {
        type: 'body',
        metatype: CreateCustomerDto,
      });
    } catch {
      classValidatorAccepts = false;
    }

    expect(zodAccepts).toBe(classValidatorAccepts);
  });
});
