import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'email não deve ser vazio!' })
  @IsString({ message: 'email deve ser uma string!' })
  @IsEmail({}, { message: 'email inválido!' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'password não deve ser vazio!' })
  @IsString({ message: 'password deve ser uma string!' })
  password: string;
}
