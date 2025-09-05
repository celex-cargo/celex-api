import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    // Dev mode: allow all but set a fake user from header
    if (process.env.AUTH_DISABLED === 'true' || process.env.AUTH_DISABLED === '1') {
      const role = (req.headers['x-user-role'] as string) || 'BUYER_USER';
      req.user = { id: 'dev-user', role };
      return true;
    }
    // TODO: connect real JWT later
    return true;
  }
}
