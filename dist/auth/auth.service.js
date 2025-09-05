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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const roles_enum_1 = require("../common/roles.enum");
let AuthService = class AuthService {
    constructor(usersService, jwt, config) {
        this.usersService = usersService;
        this.jwt = jwt;
        this.config = config;
    }
    async signAccessToken(payload) {
        var _a;
        return this.jwt.signAsync(payload, {
            secret: this.config.get('JWT_SECRET'),
            expiresIn: (_a = this.config.get('JWT_EXPIRES_IN')) !== null && _a !== void 0 ? _a : '1d',
        });
    }
    async signRefreshToken(payload) {
        var _a;
        return this.jwt.signAsync(payload, {
            secret: this.config.get('JWT_REFRESH_SECRET'),
            expiresIn: (_a = this.config.get('JWT_REFRESH_EXPIRES_IN')) !== null && _a !== void 0 ? _a : '7d',
        });
    }
    async issueTokensAndPersistRtHash(userId, email, role) {
        var _a;
        const payload = { sub: userId, email, role };
        const [access, refresh] = await Promise.all([
            this.signAccessToken(payload),
            this.signRefreshToken(payload),
        ]);
        const rounds = parseInt((_a = this.config.get('BCRYPT_SALT_ROUNDS')) !== null && _a !== void 0 ? _a : '12', 10);
        const rtHash = await bcrypt.hash(refresh, rounds);
        await this.usersService.setRefreshTokenHash(userId, rtHash);
        return { access_token: access, refresh_token: refresh };
    }
    async register(email, password, role = roles_enum_1.UserRole.SHIPPER) {
        var _a;
        const user = await this.usersService.create({ email, password, role });
        const id = (_a = user._id) === null || _a === void 0 ? void 0 : _a.toString();
        return this.issueTokensAndPersistRtHash(id, email, role);
    }
    async login(email, password) {
        var _a;
        const user = await this.usersService.findByEmail(email, true);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const ok = await bcrypt.compare(password, user.password);
        if (!ok)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const id = (_a = user._id) === null || _a === void 0 ? void 0 : _a.toString();
        return this.issueTokensAndPersistRtHash(id, user.email, user.role);
    }
    async refresh(userId, presentedRt) {
        const user = await this.usersService.findByIdWithRefresh(userId);
        if (!user || !user.refreshTokenHash) {
            throw new common_1.UnauthorizedException('Refresh token not found');
        }
        const match = await bcrypt.compare(presentedRt, user.refreshTokenHash);
        if (!match)
            throw new common_1.UnauthorizedException('Invalid refresh token');
        const id = user._id.toString();
        return this.issueTokensAndPersistRtHash(id, user.email, user.role);
    }
    async logout(userId) {
        await this.usersService.setRefreshTokenHash(userId, null);
        return { success: true };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map