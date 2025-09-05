import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcryptjs';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const users = app.get(UsersService);
    const auth  = app.get(AuthService);

    const email = process.env.ADMIN_EMAIL || 'admin@celexcargo.com';
    const password = process.env.ADMIN_PASSWORD || '1QAZ0plm';

    const u = await users.findByEmail(email);
    console.log('user found:', !!u, u && { email: u.email, role: u.role });

    if (u?.password) {
      const ok = await bcrypt.compare(password, u.password);
      console.log('bcrypt.compare =>', ok);
    }

    // ✅ امضا را درست صدا بزن
    const tokens = await auth.login(email, password);
    console.log('LOGIN OK -> access_token length:', tokens?.access_token?.length);
  } catch (e: any) {
    console.error('LOGIN FAILED:', e?.response ?? e?.message ?? e);
  } finally {
    await app.close();
  }
}

run().catch(e => { console.error(e); process.exit(1); });
