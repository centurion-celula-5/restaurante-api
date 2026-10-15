import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

describe('UsersController', () => {
  let controller: UsersController;
  const usersService = { remove: vi.fn() };

  beforeEach(async () => {
    vi.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates DELETE /users/:id to the service and returns its result', async () => {
    const id = '7d2a1f60-4b3c-4e8a-9f15-6c1d0b5e2a44';
    usersService.remove.mockResolvedValue({ id_user: id });

    await expect(controller.remove(id)).resolves.toEqual({ id_user: id });
    expect(usersService.remove).toHaveBeenCalledWith(id);
  });
});