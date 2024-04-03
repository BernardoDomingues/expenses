import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Nome de usuário deve ser uma string' })
  username: string;

  @IsString({ message: 'Email de usuário deve ser uma string' })
  @IsEmail()
  email: string;

  @IsString({ message: 'Senha de usuário deve ser uma string' })
  password: string;

  @IsString({ message: 'Confirmação de senha de usuário deve ser uma string' })
  confirmPassword: string;
}
