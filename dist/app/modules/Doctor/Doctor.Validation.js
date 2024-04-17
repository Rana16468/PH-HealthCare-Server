"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const specialtiesSchema = zod_1.z.object({
    specialitiesId: zod_1.z.string({ required_error: "specialitiesId is Required" }),
    isDeleted: zod_1.z.boolean()
}).optional();
const UpdateDoctorValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: "name is Required" }).min(1).optional(),
        email: zod_1.z.string({ required_error: "email is Required" }).email().optional(),
        profilePhoto: zod_1.z.string({ required_error: "profile is Not Required" }).url().optional().optional(),
        contractNumber: zod_1.z.string({ required_error: "Contruct Number is Required" }).optional(),
        address: zod_1.z.string({ required_error: "Address is Not Required" }).optional().optional(),
        gender: zod_1.z.enum([client_1.Gender.MALE, client_1.Gender.FEMALE]).optional(),
        appointmentFee: zod_1.z.number({ required_error: "appointmentFee is Requred" }).int().optional(),
        qualification: zod_1.z.string({ required_error: " qualification is Requred" }).optional(),
        currentWorkingPlease: zod_1.z.string({ required_error: "currentWorkingPlease is Requred" }).optional(),
        designation: zod_1.z.string({ required_error: " designation is Requred" }).optional(),
        specialties: zod_1.z.array(specialtiesSchema).optional()
    }).optional()
});
exports.DoctorValidation = {
    UpdateDoctorValidation
};
