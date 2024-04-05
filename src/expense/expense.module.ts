import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { JwtService } from '@nestjs/jwt';
import { Expense } from './entities/expense.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, User])],
  controllers: [ExpenseController],
  providers: [ExpenseService, JwtService],
})
export class ExpenseModule {}
