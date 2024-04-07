import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException } from '@nestjs/common';

const mockUserDto: CreateUserDto = {
  username: 'user name',
  email: 'username@mail.com',
  password: '123',
  confirmPassword: '123',
};

const mockUser: User = {
  id: 0,
  username: 'user name',
  email: 'username@mail.com',
  password: '123',
  expenses: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const defaultUserRepositoryMock = {
  save: jest.fn().mockResolvedValue(mockUser),
  create: jest.fn().mockResolvedValue(mockUser),
  findOne: jest.fn().mockResolvedValue(null),
};

const setupTestingModule = (
  userRepositoryMock: typeof defaultUserRepositoryMock,
) => {
  return Test.createTestingModule({
    providers: [
      UserService,
      {
        provide: getRepositoryToken(User),
        useValue: userRepositoryMock,
      },
    ],
  }).compile();
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await setupTestingModule(
      defaultUserRepositoryMock,
    );

    service = module.get<UserService>(UserService);
  });

  it('Deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('Deve criar usuário', () => {
      const user = service.create(mockUserDto);
      expect(user).resolves.toEqual(mockUser);
    });

    it('Deve lançar uma exceção ConflictException se o email do usuário já estiver cadastrado', async () => {
      const userRepositoryMock = {
        ...defaultUserRepositoryMock,
        findOne: jest
          .fn()
          .mockRejectedValue(new ConflictException('Email já cadastrado!')),
      };

      const module: TestingModule =
        await setupTestingModule(userRepositoryMock);

      const serviceWithConflictException = module.get<UserService>(UserService);

      const user = serviceWithConflictException.create(mockUserDto);

      await expect(user).rejects.toThrow(ConflictException);
    });
  });
});
