import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  SHIPPER = 'SHIPPER',
  CARRIER = 'CARRIER',
  ADMIN = 'ADMIN',
}

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: UserRole, default: UserRole.SHIPPER })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
