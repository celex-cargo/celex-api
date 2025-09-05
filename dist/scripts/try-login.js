"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const users_service_1 = require("../users/users.service");
const auth_service_1 = require("../auth/auth.service");
const bcrypt = require("bcryptjs");
async function run() {
    var _a, _b, _c;
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    try {
        const users = app.get(users_service_1.UsersService);
        const auth = app.get(auth_service_1.AuthService);
        const email = process.env.ADMIN_EMAIL || 'admin@celexcargo.com';
        const password = process.env.ADMIN_PASSWORD || '1QAZ0plm';
        const u = await users.findByEmail(email);
        console.log('user found:', !!u, u && { email: u.email, role: u.role });
        if (u === null || u === void 0 ? void 0 : u.password) {
            const ok = await bcrypt.compare(password, u.password);
            console.log('bcrypt.compare =>', ok);
        }
        const tokens = await auth.login(email, password);
        console.log('LOGIN OK -> access_token length:', (_a = tokens === null || tokens === void 0 ? void 0 : tokens.access_token) === null || _a === void 0 ? void 0 : _a.length);
    }
    catch (e) {
        console.error('LOGIN FAILED:', (_c = (_b = e === null || e === void 0 ? void 0 : e.response) !== null && _b !== void 0 ? _b : e === null || e === void 0 ? void 0 : e.message) !== null && _c !== void 0 ? _c : e);
    }
    finally {
        await app.close();
    }
}
run().catch(e => { console.error(e); process.exit(1); });
//# sourceMappingURL=try-login.js.map