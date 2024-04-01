

import {z} from 'zod';

const createSpecialtiesValidation=z.object({

    body:z.object({
        title:z.string({required_error:"title is Requred"}),
        icon:z.string({required_error:"icon is Requred"}).optional()
    })
});

export const SpecialtiesValidation={
    createSpecialtiesValidation
}