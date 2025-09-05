"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwbModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const awb_schema_1 = require("./schemas/awb.schema");
const awb_service_1 = require("./awb.service");
const awb_controller_1 = require("./awb.controller");
const booking_schema_1 = require("../bookings/schemas/booking.schema");
let AwbModule = class AwbModule {
};
exports.AwbModule = AwbModule;
exports.AwbModule = AwbModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: awb_schema_1.Awb.name, schema: awb_schema_1.AwbSchema },
                { name: booking_schema_1.Booking.name, schema: booking_schema_1.BookingSchema },
            ]),
        ],
        controllers: [awb_controller_1.AwbController],
        providers: [awb_service_1.AwbService],
        exports: [awb_service_1.AwbService],
    })
], AwbModule);
//# sourceMappingURL=awb.module.js.map