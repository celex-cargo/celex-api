import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from '../common/roles.enum';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, role } = createUserDto;

    const existing = await this.userModel.findOne({ email });
    if (existing) {
      throw new BadRequestException('Email is already in use');
    }

    const validRoles = [UserRole.SHIPPER, UserRole.CARRIER, UserRole.BROKER];
    if (role && !validRoles.includes(role)) {
      throw new BadRequestException('Invalid role');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = new this.userModel({
      email,
      password: hashedPassword,
      role,
    });

    return createdUser.save();
  }
}
