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
exports.QuoteSchema = exports.Quote = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let QuoteBreakdown = class QuoteBreakdown {
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], QuoteBreakdown.prototype, "base", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], QuoteBreakdown.prototype, "fuel", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], QuoteBreakdown.prototype, "war", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], QuoteBreakdown.prototype, "security", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], QuoteBreakdown.prototype, "handling", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], QuoteBreakdown.prototype, "total", void 0);
QuoteBreakdown = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], QuoteBreakdown);
let Quote = class Quote {
};
exports.Quote = Quote;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Quote.prototype, "origin", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Quote.prototype, "dest", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Quote.prototype, "grossKg", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ l: Number, w: Number, h: Number, pcs: Number }], default: [] }),
    __metadata("design:type", Array)
], Quote.prototype, "dims", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Quote.prototype, "chargeableKg", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Quote.prototype, "ratePerKg", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: QuoteBreakdown }),
    __metadata("design:type", QuoteBreakdown)
], Quote.prototype, "breakdown", void 0);
exports.Quote = Quote = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Quote);
exports.QuoteSchema = mongoose_1.SchemaFactory.createForClass(Quote);
//# sourceMappingURL=quote.schema.js.map