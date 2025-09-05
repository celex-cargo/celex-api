"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const users_service_1 = require("../users/users.service");
const roles_enum_1 = require("../common/roles.enum");
async function run() {
    var _a, _b;
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    try {
        const users = app.get(users_service_1.UsersService);
        const email = (_a = process.env.ADMIN_EMAIL) !== null && _a !== void 0 ? _a : 'admin@celexcargo.com';
        const password = (_b = process.env.ADMIN_PASSWORD) !== null && _b !== void 0 ? _b : 'ChangeMe!12345';
        const exists = await users.findByEmail(email);
        if (exists) {
            console.log(`[seed] admin already exists: ${email}`);
        }
        else {
            await users.create({ email, password, role: roles_enum_1.UserRole.ADMIN });
            console.log(`[seed] admin created: ${email}`);
        }
    }
    catch (e) {
        console.error(e);
        process.exitCode = 1;
    }
    finally {
        await app.close();
    }
}
run();
//# sourceMappingURL=seed-admin.js.map