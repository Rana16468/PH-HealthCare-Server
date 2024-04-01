import { Gender, UserStatus } from '@prisma/client';
import {z} from  'zod';

const createAdminValidation=z.object({


    body:z.object({

        password:z.string({required_error:"password is Required"}),
        admin:z.object({
            name:z.string({required_error:"name is Required"}),
            email:z.string({required_error:"email is Required"}),
            contractNumber:z.string({required_error:"contractNumber is Required"}),
            profilePhoto:z.string().url().optional()

        })
    })
});

const createDoctorValidation=z.object({

body:z.object({
     password:z.string({required_error:"password is Required"}),
     doctor:z.object({
        name: z.string({required_error:"name is Required"}).min(1),
        email: z.string({required_error:"email is Required"}).email(),
        profilePhoto: z.string({required_error:"profile is Not Required"}).url().optional(),
        contractNumber: z.string({required_error:"Contruct Number is Required"}),
        address: z.string({required_error:"Address is Not Required"}).optional(),
        registrationNumber: z.string({required_error:"Registration Number is  Required"}),
        experience: z.number().int().default(0),
        gender: z.enum([Gender.MALE,Gender.FEMALE]),
        appointmentFee: z.number({required_error:"appointmentFee is Requred"}).int(),
        qualification: z.string({required_error:" qualification is Requred"}),
        currentWorkingPlease: z.string({required_error:"currentWorkingPlease is Requred"}),
        designation: z.string({required_error:" designation is Requred"}),
        averageRating: z.number({required_error:"Average Rating is Optional"}).int().optional(),
        
       
        })
  
    })
});

const createPatientValidation=z.object({

    body:z.object({
        password:z.string({required_error:"password is Required"}),
        patient:z.object({
            name: z.string({ required_error: "Name is required" }).min(1),
            email: z.string({ required_error: "Email is required" }).email(),
            profilePhoto: z.string({ required_error: "Profile photo is not required" }).url().optional(),
            contractNumber: z.string({ required_error: "Contract number is required" }),
            gender: z.enum([Gender.MALE,Gender.FEMALE]),
            address: z.string({ required_error: "Address is not required" }).optional()
        })

    })
});

const chnageProfileStatusValidation=z.object({

    body:z.object({

        status:z.enum([UserStatus.ACTIVE,UserStatus.BLOCKED,UserStatus.DELETED]  )

    })
});

const updateUserProfileValidation=z.object({
    body:z.object({
        name:z.string({required_error:"name is Required"}).optional(),
        email:z.string({required_error:"email is Required"}).optional(),
        contractNumber:z.string({required_error:"contractNumber is Required"}).optional(),
        profilePhoto:z.string().url().optional(),
        address: z.string({required_error:"Address is Not Required"}).optional(),
        registrationNumber: z.string({required_error:"Registration Number is  Required"}).optional(),
        experience: z.number().int().default(0).optional(),
        gender: z.enum([Gender.MALE,Gender.FEMALE]).optional(),
        appointmentFee: z.number({required_error:"appointmentFee is Requred"}).int().optional(),
        qualification: z.string({required_error:" qualification is Requred"}).optional(),
        currentWorkingPlease: z.string({required_error:"currentWorkingPlease is Requred"}).optional(),
        designation: z.string({required_error:" designation is Requred"}).optional(),
        averageRating: z.number({required_error:"Average Rating is Optional"}).int().optional().optional(),
       
    }).optional()
})
    

export const userValidation={
    createAdminValidation,
    createDoctorValidation,
    createPatientValidation,
    chnageProfileStatusValidation,
    updateUserProfileValidation
}

