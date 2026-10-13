import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CreateCategoryDto } from './create-category.dto.js';
import { UpdateCategoryDto } from './update-category.dto.js';

describe('Category payload validation', () => {
  const pipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  const create = (payload: unknown) =>
    pipe.transform(payload, { type: 'body', metatype: CreateCategoryDto });

  const update = (payload: unknown) =>
    pipe.transform(payload, { type: 'body', metatype: UpdateCategoryDto });

  it('accepts the diagram fields, trims the name and allows a null description', async () => {
    const category = await create({
      name_category: '  Entradas  ',
      description: null,
    });

    expect(category.name_category).toBe('Entradas');
    expect(category.description).toBeNull();
  });

  it.each(['ACTIVE', 'INACTIVE'])(
    'accepts the canonical status %s',
    async (status) => {
      await expect(
        create({ name_category: 'Entradas', status }),
      ).resolves.toBeDefined();
    },
  );

  it.each(['   ', 'a'.repeat(51)])(
    'rejects an invalid category name',
    async (name_category) => {
      await expect(create({ name_category })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );

  it.each(['PAUSED', null])(
    'rejects an invalid category status',
    async (status) => {
      await expect(
        create({ name_category: 'Entradas', status }),
      ).rejects.toBeInstanceOf(BadRequestException);
    },
  );

  it('rejects a parent category field absent from the model', async () => {
    await expect(
      create({ name_category: 'Entradas', parent_category_id: 1 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('allows changing only the status or clearing the nullable description', async () => {
    await expect(update({ status: 'INACTIVE' })).resolves.toBeDefined();
    await expect(update({ description: null })).resolves.toBeDefined();
  });

  it('rejects clearing the required category name during an update', async () => {
    await expect(update({ name_category: null })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
