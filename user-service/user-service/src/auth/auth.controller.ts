import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../users/dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: { email: string; password: string }) {
    const data = await this.authService.login(body.email, body.password);
    return { statusCode: 200, intOpCode: 0, data };
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const data = await this.authService.register({
      username:  body.username,
      email:     body.email,
      fullName:  body.fullName  || '',
      address:   body.address   || '',
      phone:     body.phone     || '',
      birthdate: body.birthdate || '',
      password:  body.password,
    });
    return { statusCode: 201, intOpCode: 0, data };
  }

  @Post('logout')
  @HttpCode(200)
  async logout() {
    const data = await this.authService.logout();
    return { statusCode: 200, intOpCode: 0, data };
  }
}