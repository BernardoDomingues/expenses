import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/authorize.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Autorização')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  authorize(@Body() authDto: AuthDto) {
    return this.authService.authorize(authDto);
  }
}
