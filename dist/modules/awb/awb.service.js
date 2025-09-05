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
exports.AwbService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const awb_schema_1 = require("./schemas/awb.schema");
const booking_schema_1 = require("../bookings/schemas/booking.schema");
const pdf_lib_1 = require("pdf-lib");
const fs = require("fs");
const path = require("path");
let AwbService = class AwbService {
    constructor(model, bookingModel) {
        this.model = model;
        this.bookingModel = bookingModel;
    }
    generateNumber() {
        const prefix = (process.env.AWB_PREFIX || '888').padStart(3, '0');
        const serial = Math.floor(1000000 + Math.random() * 9000000);
        const checkDigit = serial % 7;
        const number = `${prefix}${serial}${checkDigit}`;
        return { number, checkDigit };
    }
    async createForBooking(bookingId) {
        var _a, _b;
        const booking = await this.bookingModel.findById(bookingId).lean();
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        const { number, checkDigit } = this.generateNumber();
        const pdf = await pdf_lib_1.PDFDocument.create();
        const page = pdf.addPage([595, 842]);
        const font = await pdf.embedFont(pdf_lib_1.StandardFonts.Helvetica);
        const draw = (txt, x, y, size = 12) => page.drawText(txt, { x, y, size, font });
        draw('e-AWB (Celex Cargo)', 50, 800, 18);
        draw(`AWB: ${number}`, 50, 770, 14);
        draw(`Booking: ${bookingId}`, 50, 750);
        draw(`Shipper: ${((_a = booking.shipper) === null || _a === void 0 ? void 0 : _a.name) || '-'}`, 50, 730);
        draw(`Consignee: ${((_b = booking.consignee) === null || _b === void 0 ? void 0 : _b.name) || '-'}`, 50, 710);
        const pdfBytes = await pdf.save();
        const root = process.cwd();
        const dir = process.env.STORAGE_DIR || './storage';
        const awbDir = path.resolve(root, dir, 'awb');
        if (!fs.existsSync(awbDir))
            fs.mkdirSync(awbDir, { recursive: true });
        const pdfPath = path.resolve(awbDir, `${number}.pdf`);
        fs.writeFileSync(pdfPath, pdfBytes);
        const doc = new this.model({ bookingId, number, checkDigit, pdfPath });
        return doc.save();
    }
    findByNumber(awbNo) {
        return this.model.findOne({ number: awbNo }).lean();
    }
};
exports.AwbService = AwbService;
exports.AwbService = AwbService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(awb_schema_1.Awb.name)),
    __param(1, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AwbService);
//# sourceMappingURL=awb.service.js.map