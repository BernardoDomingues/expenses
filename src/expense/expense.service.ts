import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import * as dayjs from 'dayjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ExpenseService {
  constructor(
    private eventEmitter: EventEmitter2,

    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userId: number, { description, date, value }: CreateExpenseDto) {
    const user = await this.userRepository
      .findOneByOrFail({ id: userId })
      .catch(() => {
        throw new NotFoundException('Usuário não encontrado');
      });

    if (dayjs(date).isAfter(dayjs())) {
      throw new BadRequestException('Data não pode ser futura!');
    }

    const expense = this.expenseRepository.create({
      description,
      date,
      value,
      user,
    });

    const savedExpense = await this.expenseRepository.save(expense);

    this.eventEmitter.emit('expense.created', savedExpense);

    return savedExpense;
  }

  async findAllByUser(userId: number) {
    const user = await this.userRepository
      .findOneByOrFail({ id: userId })
      .catch(() => {
        throw new NotFoundException('Usuário não encontrado');
      });

    return this.expenseRepository.findBy({ user });
  }

  findOne(id: number) {
    return this.expenseRepository.findOneBy({ id });
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return this.expenseRepository.update(id, updateExpenseDto);
  }

  remove(id: number) {
    return this.expenseRepository.softDelete(id);
  }
}
