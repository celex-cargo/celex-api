import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '../common/roles.enum';

@Injectable()
export class UsersService {
  private readonly saltRounds: number;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly config: ConfigService,
  ) {
    this.saltRounds = parseInt(
      this.config.get('BCRYPT_SALT_ROUNDS') ?? '12',
      10,
    );
  }

  async findByEmail(
    email: string,
    withPassword = false,
  ): Promise<UserDocument | null> {
    const q = this.userModel.findOne({
      email: typeof email === 'string' ? email.trim().toLowerCase() : email,
    });
    if (withPassword) q.select('+password');
    return q.exec();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }


  async findByIdWithRefresh(id: string) {
    return this.userModel.findById(id).select('+refreshTokenHash').exec();
  }

  async updateById(id: string, payload: Partial<User>) {
    return this.userModel.findByIdAndUpdate(id, payload, { new: true }).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async create(dto: CreateUserDto): Promise<UserDocument> {
    const email = dto.email.trim().toLowerCase();

    const exists = await this.userModel.findOne({ email }).lean();
    if (exists) throw new ConflictException('Email is already registered');

    const hashed = await bcrypt.hash(dto.password, this.saltRounds);

    // اگر enum شما SHIPPER داشته باشد، پیش‌فرض SHIPPER می‌شود؛ وگرنه USER.
    const defaultRole: UserRole = UserRole.SHIPPER;

    const created = new this.userModel({
      name: dto.name,
      email,
      password: hashed,
      role: dto.role ?? defaultRole,
    });

    return created.save();
  }

  async updateProfile(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    const update: any = { ...dto };
    if (dto.email) update.email = dto.email.trim().toLowerCase();
    if (dto.password) update.password = await bcrypt.hash(dto.password, this.saltRounds);

    const user = await this.userModel
      .findByIdAndUpdate(id, update, { new: true })
      .exec();

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // برای فاز Refresh Token مفید است
  async setRefreshTokenHash(
    userId: string,
    hash: string | null,
  ): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, { refreshTokenHash: hash })
      .exec();
  }
}

