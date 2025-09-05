import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RtGuard } from './guards/rt.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../common/roles.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.auth.register(dto.email, dto.password, dto.role ?? UserRole.SHIPPER);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  async refresh(@Req() req: any) {
    // req.user = { sub, email, refreshToken } از استراتژی رفرش
    return this.auth.refresh(req.user.sub, req.user.refreshToken);
  }

  @UseGuards(RtGuard)
  @Post('logout')
  async logout(@Req() req: any) {
    return this.auth.logout(req.user.sub);
  }
}

