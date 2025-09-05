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
exports.CapacityService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const capacity_schema_1 = require("./schemas/capacity.schema");
let CapacityService = class CapacityService {
    constructor(model) {
        this.model = model;
    }
    create(dto) {
        const doc = new this.model(Object.assign(Object.assign({}, dto), { etdUtc: new Date(dto.etdUtc), etaUtc: new Date(dto.etaUtc) }));
        return doc.save();
    }
    find(query) {
        const filter = {};
        if (query.origin)
            filter.origin = query.origin.toUpperCase();
        if (query.dest)
            filter.dest = query.dest.toUpperCase();
        if (query.from || query.to) {
            filter.etdUtc = {};
            if (query.from)
                filter.etdUtc.$gte = new Date(query.from);
            if (query.to)
                filter.etdUtc.$lte = new Date(query.to);
        }
        return this.model.find(filter).sort({ etdUtc: 1 }).lean();
    }
};
exports.CapacityService = CapacityService;
exports.CapacityService = CapacityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(capacity_schema_1.Capacity.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CapacityService);
//# sourceMappingURL=capacity.service.js.map