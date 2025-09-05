import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../common/roles.enum';

type JwtPayload = { sub: string; email: string; role: UserRole };
type Tokens = { access_token: string; refresh_token: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ------ helpers
  private async signAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: this.config.get<string>('JWT_EXPIRES_IN') ?? '1d',
    });
  }

  private async signRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d',
    });
  }

  private async issueTokensAndPersistRtHash(
    userId: string,
    email: string,
    role: UserRole,
  ): Promise<Tokens> {
    const payload: JwtPayload = { sub: userId, email, role };
    const [access, refresh] = await Promise.all([
      this.signAccessToken(payload),
      this.signRefreshToken(payload),
    ]);

    const rounds = parseInt(this.config.get<string>('BCRYPT_SALT_ROUNDS') ?? '12', 10);
    const rtHash = await bcrypt.hash(refresh, rounds);
    await this.usersService.setRefreshTokenHash(userId, rtHash);

    return { access_token: access, refresh_token: refresh };
  }

  // ------ public API
  async register(email: string, password: string, role: UserRole = UserRole.SHIPPER): Promise<Tokens> {
    const user = await this.usersService.create({ email, password, role });
    const id = (user as any)._id?.toString();
    return this.issueTokensAndPersistRtHash(id, email, role);
  }

  async login(email: string, password: string): Promise<Tokens> {
    const user = await this.usersService.findByEmail(email, true);
    if (!user) throw new NotFoundException('User not found');

    const ok = await bcrypt.compare(password, (user as any).password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const id = (user as any)._id?.toString();
    return this.issueTokensAndPersistRtHash(id, user.email, user.role);
  }

  async refresh(userId: string, presentedRt: string): Promise<Tokens> {
    const user = await this.usersService.findByIdWithRefresh(userId);
    if (!user || !(user as any).refreshTokenHash) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const match = await bcrypt.compare(presentedRt, (user as any).refreshTokenHash);
    if (!match) throw new UnauthorizedException('Invalid refresh token');

    const id = (user as any)._id.toString();
    return this.issueTokensAndPersistRtHash(id, user.email, user.role);
  }

  async logout(userId: string): Promise<{ success: true }> {
    await this.usersService.setRefreshTokenHash(userId, null);
    return { success: true };
  }
}

