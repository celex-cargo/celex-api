import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { UserRole } from '../common/roles.enum';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const users = app.get(UsersService);
    const email = process.env.ADMIN_EMAIL ?? 'admin@celexcargo.com';
    const password = process.env.ADMIN_PASSWORD ?? 'ChangeMe!12345';

    const exists = await users.findByEmail(email);
    if (exists) {
      console.log(`[seed] admin already exists: ${email}`);
    } else {
      await users.create({ email, password, role: UserRole.ADMIN });
      console.log(`[seed] admin created: ${email}`);
    }
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}
run();
