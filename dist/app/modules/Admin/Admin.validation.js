"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidation = void 0;
const zod_1 = require("zod");
const UpdateAdminSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        profilePhoto: zod_1.z.string().url().optional(),
        contractNumber: zod_1.z.string().min(11, { message: "elivent Digit Needed" }).optional()
    })
});
exports.AdminValidation = {
    UpdateAdminSchema
};
