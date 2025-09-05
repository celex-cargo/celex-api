import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '../../common/roles.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.refreshTokenHash;
    },
  },
})
export class User {
  @Prop({ trim: true })
  name?: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.SHIPPER })
  role: UserRole;

  @Prop({ type: String, select: false, default: null })
  refreshTokenHash?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
