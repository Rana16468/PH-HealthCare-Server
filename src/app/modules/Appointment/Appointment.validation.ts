import {z} from 'zod';


const CreateAppointmentSchema=z.object({
    body:z.object({
        doctorId:z.string({required_error:"doctor Id is Required"}).uuid(),
        scheduleId:z.string({required_error:"schedule Id is Required"}).uuid()
    })
});


export const AppointmentValidation={
    CreateAppointmentSchema
}