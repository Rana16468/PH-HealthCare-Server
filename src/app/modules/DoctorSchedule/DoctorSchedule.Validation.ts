import {z} from 'zod';

const ScheduleIdSchema = z.string().uuid();
const createDoctorScheduleSchema=z.object({
    body:z.object({
        scheduleIds:z.array(ScheduleIdSchema)
    })
});


export const DoctorScheduleValidation={
    createDoctorScheduleSchema
}

