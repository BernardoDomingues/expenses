import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/authorize.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

const mockUser: User = {
  id: 0,
  username: 'user name',
  email: 'username@mail.com',
  password: bcrypt.hashSync('123', 10),
  expenses: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const defaultUserRepositoryMock = {
  findOneByOrFail: jest.fn().mockResolvedValue(mockUser),
};

const defaultJwtMock = {
  sign: jest.fn().mockReturnValue('tokenExample'),
};

const setupTestingModule = (
  userRepositoryMock: typeof defaultUserRepositoryMock,
) => {
  return Test.createTestingModule({
    providers: [
      AuthService,
      JwtService,
      {
        provide: JwtService,
        useValue: defaultJwtMock,
      },
      UserService,
      {
        provide: getRepositoryToken(User),
        useValue: userRepositoryMock,
      },
    ],
  }).compile();
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await setupTestingModule(
      defaultUserRepositoryMock,
    );

    service = module.get<AuthService>(AuthService);
  });

  it('Deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('authorize()', () => {
    it('Deve autorizar o login e retornar o token', () => {
      const credentials: AuthDto = {
        email: 'username@mail.com',
        password: '123',
      };

      const token = service.authorize(credentials);
      expect(token).resolves.toEqual({ token: 'tokenExample' });
    });

    it('Deve lançar uma exceção NotFoundException se o usuário não for encontrado', async () => {
      const userRepositoryMock = {
        findOneByOrFail: jest
          .fn()
          .mockRejectedValue(new NotFoundException('Usuário não encontrado')),
      };

      const module: TestingModule =
        await setupTestingModule(userRepositoryMock);
      const serviceWithNotFoundException = module.get<AuthService>(AuthService);

      const credentials: AuthDto = {
        email: 'mail@mail.com',
        password: '123',
      };

      const token = serviceWithNotFoundException.authorize(credentials);

      await expect(token).rejects.toThrow(NotFoundException);
    });
  });

  it('Deve lançar uma exceção ForbiddenException se a credencial não for compativel', () => {
    const credentials: AuthDto = {
      email: 'username@mail.com',
      password: '1234',
    };

    const token = service.authorize(credentials);
    expect(token).rejects.toThrow(ForbiddenException);
  });
});
