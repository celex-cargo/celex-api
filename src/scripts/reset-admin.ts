import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

type UserDoc = {
  _id: any;
  email: string;
  password: string;
};

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userModel = app.get<Model<UserDoc>>(getModelToken('User'));

  const email = process.env.ADMIN_EMAIL || 'admin@celexcargo.com';
  const plain = process.env.ADMIN_PASSWORD || 'ChangeMe!12345';
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);

  const hash = await bcrypt.hash(plain, saltRounds);

  const res = await userModel.updateOne({ email }, { $set: { password: hash } });

  console.log(`[reset-admin] matched=${(res as any).matchedCount ?? (res as any).n ?? 0} modified=${(res as any).modifiedCount ?? (res as any).nModified ?? 0}`);
  await app.close();
}

run().catch((e) => { console.error(e); process.exit(1); });
