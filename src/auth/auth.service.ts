import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthDto } from './dto/authorize.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async authorize(authData: AuthDto) {
    let user = null;

    try {
      user = await this.userRepository.findOneByOrFail({
        email: authData.email,
      });
    } catch (error) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    const isMatch = await bcrypt.compare(authData.password, user.password);

    if (!isMatch) throw new ForbiddenException('Senha incorreta!');

    delete user.password;

    return {
      token: this.jwtService.sign(
        { ...user },
        {
          secret: process.env.SECRET,
          algorithm: 'HS256',
          expiresIn: '4h',
        },
      ),
    };
  }
}
