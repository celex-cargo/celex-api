import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/at.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/roles.enum';
import { GetUser } from '../common/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard) // همه‌ی روت‌های این کنترلر ابتدا با JWT محافظت می‌شوند
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ---------- پروفایل خود کاربر ----------
  @Get('me')
  me(@GetUser('sub') userId: string) {
    return this.usersService.findById(userId);
  }

  @Patch('me')
  updateMe(@GetUser('sub') userId: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  // ---------- فقط ادمین ----------
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}

