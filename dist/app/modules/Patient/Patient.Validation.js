"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const UpdatePatientValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Name is required" }).min(1).optional(),
        contractNumber: zod_1.z.string({ required_error: "Contract number is required" }).optional(),
        gender: zod_1.z.enum([client_1.Gender.MALE, client_1.Gender.FEMALE]).optional(),
        profilePhoto: zod_1.z.string({ required_error: 'image is not Requried' }).url().optional(),
        address: zod_1.z.string({ required_error: "Address is not required" }).optional(),
        patientHealthData: zod_1.z.object({
            dateOfBirth: zod_1.z.string({ required_error: "Date of Birth in not Required" }).optional(),
            bloodGroup: zod_1.z.enum([client_1.BloodGroup.AB_NEGATIVE, client_1.BloodGroup.AB_POSITIVE, client_1.BloodGroup.A_NEGATIVE, client_1.BloodGroup.A_POSITIVE, client_1.BloodGroup.B_NEGATIVE, client_1.BloodGroup.B_POSITIVE, client_1.BloodGroup.O_NEGATIVE, client_1.BloodGroup.O_POSITIVE]).optional(),
            hasAllergies: zod_1.z.boolean().default(false).optional(),
            hasDiabetes: zod_1.z.boolean().default(false).optional(),
            height: zod_1.z.string().optional(),
            weight: zod_1.z.string().optional(),
            smokingStatus: zod_1.z.boolean().default(false).optional(),
            dietaryPreferences: zod_1.z.string().optional(),
            pregnancyStatus: zod_1.z.boolean().default(false).optional(),
            mentalHealthHistory: zod_1.z.string().optional(),
            immunizationStatus: zod_1.z.string().optional(),
            hasPastSurgeries: zod_1.z.boolean().default(false).optional(),
            recentAnxiety: zod_1.z.boolean().default(false).optional(),
            recentDepression: zod_1.z.boolean().default(false).optional(),
            maritalStatus: zod_1.z.enum([client_1.MaritalStatus.MARRIED, client_1.MaritalStatus.UNMARRIED]).optional()
        }).optional(),
        medicalRepor: zod_1.z.object({
            reportName: zod_1.z.string().optional(),
            reportLink: zod_1.z.string().optional()
        }).optional()
    }).optional()
});
exports.PatientValidation = {
    UpdatePatientValidationSchema
};
