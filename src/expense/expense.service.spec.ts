import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExpenseService } from './expense.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { User } from '../user/entities/user.entity';
import { Expense } from './entities/expense.entity';

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

const mockExpenseDto: CreateExpenseDto = {
  description: 'description',
  date: '2024-01-01',
  value: 50,
};

const mockExpense: Expense = {
  id: 0,
  description: 'description',
  date: new Date('2024-01-01'),
  value: 50,
  user: mockUser,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const defaultUserRepositoryMock = {
  findOneByOrFail: jest.fn().mockResolvedValue(mockUser),
};

const defaultExpenseRepositoryMock = {
  save: jest.fn().mockResolvedValue(mockExpense),
  create: jest.fn().mockResolvedValue({ ...mockExpenseDto, user: mockUser }),
  findBy: jest.fn().mockResolvedValue([mockExpense]),
  findOneBy: jest.fn().mockResolvedValue(mockExpense),
  softDelete: jest.fn().mockResolvedValue(undefined),
};

const setupTestingModule = (
  userRepositoryMock: typeof defaultUserRepositoryMock,
  expenseRepositoryMock: typeof defaultExpenseRepositoryMock,
) => {
  return Test.createTestingModule({
    providers: [
      ExpenseService,
      {
        provide: getRepositoryToken(Expense),
        useValue: expenseRepositoryMock,
      },
      {
        provide: getRepositoryToken(User),
        useValue: userRepositoryMock,
      },
    ],
    imports: [EventEmitterModule.forRoot()],
  }).compile();
};

describe('ExpenseService', () => {
  let service: ExpenseService;

  beforeEach(async () => {
    const module: TestingModule = await setupTestingModule(
      defaultUserRepositoryMock,
      defaultExpenseRepositoryMock,
    );

    service = module.get<ExpenseService>(ExpenseService);
  });

  it('Deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('Deve inserir com sucesso uma despesa', () => {
      const expense = service.create(0, mockExpenseDto);
      expect(expense).resolves.toEqual(mockExpense);
    });

    it('Deve lançar uma exceção NotFoundException se o usuário não for encontrado', async () => {
      const userRepositoryMock = {
        findOneByOrFail: jest
          .fn()
          .mockRejectedValue(new NotFoundException('Usuário não encontrado')),
      };

      const module: TestingModule = await setupTestingModule(
        userRepositoryMock,
        defaultExpenseRepositoryMock,
      );
      const serviceWithNotFoundException =
        module.get<ExpenseService>(ExpenseService);

      const expense = serviceWithNotFoundException.create(1, mockExpenseDto);

      await expect(expense).rejects.toThrow(NotFoundException);
    });

    it('Deve lançar uma exceção BadRequestException se a data for futura', async () => {
      const futureDateMockExpenseDto = mockExpenseDto;
      futureDateMockExpenseDto.date = '2025-01-01';

      const expense = service.create(0, futureDateMockExpenseDto);

      await expect(expense).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAllByUser()', () => {
    it('Deve retornar as despesas do usuário', () => {
      const expenses = service.findAllByUser(0);
      expect(expenses).resolves.toEqual([mockExpense]);
    });
  });

  describe('findOne()', () => {
    it('Deve retornar uma despesa do usuário', () => {
      const expense = service.findOne(0);
      expect(expense).resolves.toEqual(mockExpense);
    });
  });

  describe('remove()', () => {
    it('Deve remover a despesa de um usuário', async () => {
      const retVal = await service.remove(0);
      expect(retVal).toBeUndefined();
    });
  });
});
