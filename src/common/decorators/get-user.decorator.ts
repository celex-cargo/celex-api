import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * استفاده:
 *   @GetUser() کل یوزرِ داخل req.user
 *   @GetUser('sub') فقط userId
 *   @GetUser('email') فقط ایمیل
 */
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user; // توسط JwtStrategy ست می‌شود
    return data ? user?.[data] : user;
  },
);

