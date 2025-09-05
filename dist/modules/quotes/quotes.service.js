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
exports.QuotesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const quote_schema_1 = require("./schemas/quote.schema");
let QuotesService = class QuotesService {
    constructor(model) {
        this.model = model;
        this.defaultRates = { 'URC-VIE': 4.0 };
        this.securityFixed = 15;
        this.handlingFixed = 20;
        this.fuelPct = 0.12;
        this.warPct = 0.03;
    }
    async create(dto) {
        var _a, _b, _c;
        const lane = `${(_a = dto.origin) === null || _a === void 0 ? void 0 : _a.toUpperCase()}-${(_b = dto.dest) === null || _b === void 0 ? void 0 : _b.toUpperCase()}`;
        const ratePerKg = (_c = this.defaultRates[lane]) !== null && _c !== void 0 ? _c : 5.0;
        const volKg = (dto.dims || []).reduce((sum, d) => sum + ((d.l * d.w * d.h) / 6000) * d.pcs, 0);
        const chargeableKg = Math.max(dto.grossKg, Math.ceil(volKg));
        const base = +(ratePerKg * chargeableKg).toFixed(2);
        const fuel = +(base * this.fuelPct).toFixed(2);
        const war = +(base * this.warPct).toFixed(2);
        const security = this.securityFixed;
        const handling = this.handlingFixed;
        const total = +(base + fuel + war + security + handling).toFixed(2);
        const doc = new this.model({
            origin: dto.origin.toUpperCase(),
            dest: dto.dest.toUpperCase(),
            grossKg: dto.grossKg,
            dims: dto.dims || [],
            chargeableKg,
            ratePerKg,
            breakdown: { base, fuel, war, security, handling, total },
        });
        return doc.save();
    }
    findOne(id) {
        return this.model.findById(id).lean();
    }
};
exports.QuotesService = QuotesService;
exports.QuotesService = QuotesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(quote_schema_1.Quote.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], QuotesService);
//# sourceMappingURL=quotes.service.js.map