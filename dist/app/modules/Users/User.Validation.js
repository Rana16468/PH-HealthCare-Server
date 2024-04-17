"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createAdminValidation = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string({ required_error: "password is Required" }),
        admin: zod_1.z.object({
            name: zod_1.z.string({ required_error: "name is Required" }),
            email: zod_1.z.string({ required_error: "email is Required" }),
            contractNumber: zod_1.z.string({ required_error: "contractNumber is Required" }),
            profilePhoto: zod_1.z.string().url().optional()
        })
    })
});
const createDoctorValidation = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string({ required_error: "password is Required" }),
        doctor: zod_1.z.object({
            name: zod_1.z.string({ required_error: "name is Required" }).min(1),
            email: zod_1.z.string({ required_error: "email is Required" }).email(),
            profilePhoto: zod_1.z.string({ required_error: "profile is Not Required" }).url().optional(),
            contractNumber: zod_1.z.string({ required_error: "Contruct Number is Required" }),
            address: zod_1.z.string({ required_error: "Address is Not Required" }).optional(),
            registrationNumber: zod_1.z.string({ required_error: "Registration Number is  Required" }),
            experience: zod_1.z.number().int().default(0),
            gender: zod_1.z.enum([client_1.Gender.MALE, client_1.Gender.FEMALE]),
            appointmentFee: zod_1.z.number({ required_error: "appointmentFee is Requred" }).int(),
            qualification: zod_1.z.string({ required_error: " qualification is Requred" }),
            currentWorkingPlease: zod_1.z.string({ required_error: "currentWorkingPlease is Requred" }),
            designation: zod_1.z.string({ required_error: " designation is Requred" }),
            averageRating: zod_1.z.number({ required_error: "Average Rating is Optional" }).int().optional(),
        })
    })
});
const createPatientValidation = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string({ required_error: "password is Required" }),
        patient: zod_1.z.object({
            name: zod_1.z.string({ required_error: "Name is required" }).min(1),
            email: zod_1.z.string({ required_error: "Email is required" }).email(),
            profilePhoto: zod_1.z.string({ required_error: "Profile photo is not required" }).url().optional(),
            contractNumber: zod_1.z.string({ required_error: "Contract number is required" }),
            gender: zod_1.z.enum([client_1.Gender.MALE, client_1.Gender.FEMALE]),
            address: zod_1.z.string({ required_error: "Address is not required" }).optional()
        })
    })
});
const chnageProfileStatusValidation = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([client_1.UserStatus.ACTIVE, client_1.UserStatus.BLOCKED, client_1.UserStatus.DELETED])
    })
});
const updateUserProfileValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: "name is Required" }).optional(),
        email: zod_1.z.string({ required_error: "email is Required" }).optional(),
        contractNumber: zod_1.z.string({ required_error: "contractNumber is Required" }).optional(),
        profilePhoto: zod_1.z.string().url().optional(),
        address: zod_1.z.string({ required_error: "Address is Not Required" }).optional(),
        registrationNumber: zod_1.z.string({ required_error: "Registration Number is  Required" }).optional(),
        experience: zod_1.z.number().int().default(0).optional(),
        gender: zod_1.z.enum([client_1.Gender.MALE, client_1.Gender.FEMALE]).optional(),
        appointmentFee: zod_1.z.number({ required_error: "appointmentFee is Requred" }).int().optional(),
        qualification: zod_1.z.string({ required_error: " qualification is Requred" }).optional(),
        currentWorkingPlease: zod_1.z.string({ required_error: "currentWorkingPlease is Requred" }).optional(),
        designation: zod_1.z.string({ required_error: " designation is Requred" }).optional(),
        averageRating: zod_1.z.number({ required_error: "Average Rating is Optional" }).int().optional().optional(),
    }).optional()
});
exports.userValidation = {
    createAdminValidation,
    createDoctorValidation,
    createPatientValidation,
    chnageProfileStatusValidation,
    updateUserProfileValidation
};
