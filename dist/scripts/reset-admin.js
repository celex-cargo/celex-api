"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = require("bcrypt");
async function run() {
    var _a, _b, _c, _d;
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const userModel = app.get((0, mongoose_1.getModelToken)('User'));
    const email = process.env.ADMIN_EMAIL || 'admin@celexcargo.com';
    const plain = process.env.ADMIN_PASSWORD || 'ChangeMe!12345';
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
    const hash = await bcrypt.hash(plain, saltRounds);
    const res = await userModel.updateOne({ email }, { $set: { password: hash } });
    console.log(`[reset-admin] matched=${(_b = (_a = res.matchedCount) !== null && _a !== void 0 ? _a : res.n) !== null && _b !== void 0 ? _b : 0} modified=${(_d = (_c = res.modifiedCount) !== null && _c !== void 0 ? _c : res.nModified) !== null && _d !== void 0 ? _d : 0}`);
    await app.close();
}
run().catch((e) => { console.error(e); process.exit(1); });
//# sourceMappingURL=reset-admin.js.map