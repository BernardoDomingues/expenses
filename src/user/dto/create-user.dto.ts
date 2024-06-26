import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'username não deve ser vazio!' })
  @IsString({ message: 'username deve ser uma string!' })
  username: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'email não deve ser vazio!' })
  @IsString({ message: 'email deve ser uma string!' })
  @IsEmail({}, { message: 'email inválido!' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'password não deve ser vazio!' })
  @IsString({ message: 'password deve ser uma string!' })
  password: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'confirmPassword não deve ser vazio!',
  })
  @IsString({ message: 'confirmPassword deve ser uma string!' })
  @IsIn([Math.random()], {
    message: 'confirmPassword deve ser igual ao password',
  })
  @ValidateIf((o) => {
    return o.password !== o.confirmPassword;
  })
  confirmPassword: string;
}
