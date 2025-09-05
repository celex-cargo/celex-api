"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const config_1 = require("@nestjs/config");
const user_schema_1 = require("./schemas/user.schema");
const roles_enum_1 = require("../common/roles.enum");
let UsersService = class UsersService {
    constructor(userModel, config) {
        var _a;
        this.userModel = userModel;
        this.config = config;
        this.saltRounds = parseInt((_a = this.config.get('BCRYPT_SALT_ROUNDS')) !== null && _a !== void 0 ? _a : '12', 10);
    }
    async findByEmail(email, withPassword = false) {
        const q = this.userModel.findOne({
            email: typeof email === 'string' ? email.trim().toLowerCase() : email,
        });
        if (withPassword)
            q.select('+password');
        return q.exec();
    }
    async findById(id) {
        const user = await this.userModel.findById(id).exec();
        if (!user)
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        return user;
    }
    async findByIdWithRefresh(id) {
        return this.userModel.findById(id).select('+refreshTokenHash').exec();
    }
    async updateById(id, payload) {
        return this.userModel.findByIdAndUpdate(id, payload, { new: true }).exec();
    }
    async findAll() {
        return this.userModel.find().exec();
    }
    async create(dto) {
        var _a;
        const email = dto.email.trim().toLowerCase();
        const exists = await this.userModel.findOne({ email }).lean();
        if (exists)
            throw new common_1.ConflictException('Email is already registered');
        const hashed = await bcrypt.hash(dto.password, this.saltRounds);
        const defaultRole = roles_enum_1.UserRole.SHIPPER;
        const created = new this.userModel({
            name: dto.name,
            email,
            password: hashed,
            role: (_a = dto.role) !== null && _a !== void 0 ? _a : defaultRole,
        });
        return created.save();
    }
    async updateProfile(id, dto) {
        const update = Object.assign({}, dto);
        if (dto.email)
            update.email = dto.email.trim().toLowerCase();
        if (dto.password)
            update.password = await bcrypt.hash(dto.password, this.saltRounds);
        const user = await this.userModel
            .findByIdAndUpdate(id, update, { new: true })
            .exec();
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async setRefreshTokenHash(userId, hash) {
        await this.userModel
            .findByIdAndUpdate(userId, { refreshTokenHash: hash })
            .exec();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService])
], UsersService);
//# sourceMappingURL=users.service.js.map