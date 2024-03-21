import { z } from "zod";

const UpdateAdminSchema=z.object({
    body:z.object({
        name:z.string().optional(),
        profilePhoto:z.string().url().optional(),
        contractNumber:z.string().min(11,{message:"elivent Digit Needed"}).optional()
    })


});

export const AdminValidation={
    UpdateAdminSchema
}