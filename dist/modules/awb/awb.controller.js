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
exports.AwbController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const awb_service_1 = require("./awb.service");
const path = require("path");
let AwbController = class AwbController {
    constructor(service) {
        this.service = service;
    }
    create(bookingId) {
        return this.service.createForBooking(bookingId);
    }
    async pdf(awbNo, res) {
        const awb = await this.service.findByNumber(awbNo);
        if (!(awb === null || awb === void 0 ? void 0 : awb.pdfPath))
            return res.status(404).json({ message: 'AWB/PDF not found' });
        return res.sendFile(path.resolve(awb.pdfPath));
    }
};
exports.AwbController = AwbController;
__decorate([
    (0, common_1.Post)(':bookingId'),
    __param(0, (0, common_1.Param)('bookingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AwbController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':awbNo/pdf'),
    __param(0, (0, common_1.Param)('awbNo')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AwbController.prototype, "pdf", null);
exports.AwbController = AwbController = __decorate([
    (0, common_1.Controller)('awb'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [awb_service_1.AwbService])
], AwbController);
//# sourceMappingURL=awb.controller.js.map