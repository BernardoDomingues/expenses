import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { TokenGuard } from 'src/token.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('myExpenses/:userId')
@ApiTags('Despesa')
@ApiUnauthorizedResponse()
@ApiBearerAuth('access-token')
@UseGuards(TokenGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(
    @Param('userId') userId: string,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return this.expenseService.create(+userId, createExpenseDto);
  }

  @Get()
  findAll(@Param('userId') userId: string) {
    return this.expenseService.findAllByUser(+userId);
  }

  @Get('expense/:id')
  findOne(@Param('id') id: string) {
    return this.expenseService.findOne(+id);
  }

  @Patch('expense/:id')
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expenseService.update(+id, updateExpenseDto);
  }

  @Delete('expense/:id')
  remove(@Param('id') id: string) {
    return this.expenseService.remove(+id);
  }
}
