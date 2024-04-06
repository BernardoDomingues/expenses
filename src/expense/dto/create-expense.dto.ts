import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'description não deve ser vazio!' })
  @IsString({ message: 'description deve ser uma string!' })
  @MaxLength(191, { message: 'description deve ter no máximo 191 caracteres!' })
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'date não deve ser vazio!' })
  @IsString({ message: 'date deve ser uma string!' })
  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
    message: 'date deve ser formatada como yyyy-mm-dd',
  })
  date: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'value não deve ser vazio!' })
  @IsNumber({}, { message: 'value deve ser um número!' })
  @Min(1, { message: 'value deve ser positivo!' })
  value: number;
}
