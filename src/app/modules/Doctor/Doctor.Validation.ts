import { Gender } from '@prisma/client';
import {z} from 'zod';

const specialtiesSchema = z.object({
    specialitiesId: z.string({required_error:"specialitiesId is Required"}),
    isDeleted: z.boolean()
}).optional();

const UpdateDoctorValidation=z.object({
    body:z.object({
        name: z.string({required_error:"name is Required"}).min(1).optional(),
        email: z.string({required_error:"email is Required"}).email().optional(),
        profilePhoto: z.string({required_error:"profile is Not Required"}).url().optional().optional(),
        contractNumber: z.string({required_error:"Contruct Number is Required"}).optional(),
        address: z.string({required_error:"Address is Not Required"}).optional().optional(),
        gender: z.enum([Gender.MALE,Gender.FEMALE]).optional(),
        appointmentFee: z.number({required_error:"appointmentFee is Requred"}).int().optional(),
        qualification: z.string({required_error:" qualification is Requred"}).optional(),
        currentWorkingPlease: z.string({required_error:"currentWorkingPlease is Requred"}).optional(),
        designation: z.string({required_error:" designation is Requred"}).optional(),
        specialties: z.array(specialtiesSchema).optional()


    }).optional()
});

export const DoctorValidation={
    UpdateDoctorValidation
}