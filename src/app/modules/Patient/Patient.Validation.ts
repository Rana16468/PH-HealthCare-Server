import { BloodGroup, Gender, MaritalStatus } from '@prisma/client';
import {z} from 'zod';

const UpdatePatientValidationSchema=z.object({
    body:z.object({
        name: z.string({ required_error: "Name is required" }).min(1).optional(),
        contractNumber: z.string({ required_error: "Contract number is required" }).optional(),
        gender: z.enum([Gender.MALE,Gender.FEMALE]).optional(),
        profilePhoto:z.string({required_error:'image is not Requried'}).url().optional(),        
        address: z.string({ required_error: "Address is not required" }).optional(),
        patientHealthData:z.object({
            dateOfBirth:z.string({required_error:"Date of Birth in not Required"}).optional(),
            bloodGroup:z.enum([BloodGroup.AB_NEGATIVE,BloodGroup.AB_POSITIVE,BloodGroup.A_NEGATIVE,BloodGroup.A_POSITIVE,BloodGroup.B_NEGATIVE,BloodGroup.B_POSITIVE,BloodGroup.O_NEGATIVE,BloodGroup.O_POSITIVE]).optional(),
            hasAllergies: z.boolean().default(false).optional(),
            hasDiabetes: z.boolean().default(false).optional(),
           height:z.string().optional(),
           weight:z.string().optional(),
           smokingStatus:z.boolean().default(false).optional(),
           dietaryPreferences:z.string().optional(),
           pregnancyStatus:z.boolean().default(false).optional(),
           mentalHealthHistory:z.string().optional(),
           immunizationStatus :z.string().optional(),
           hasPastSurgeries :z.boolean().default(false).optional(),
           recentAnxiety :z.boolean().default(false).optional(),
           recentDepression :z.boolean().default(false).optional(),
           maritalStatus :z.enum([MaritalStatus.MARRIED,MaritalStatus.UNMARRIED]).optional()

        }).optional(),
        medicalRepor:z.object({
            reportName:z.string().optional(),
            reportLink:z.string().optional()
        }).optional()
    }).optional()
});

export const PatientValidation={
    UpdatePatientValidationSchema
}