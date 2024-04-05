import {z} from 'zod';

const createScheduleSchema=z.object({
    body:z.object({
        startDate:z.string({required_error:"start date is Required"}),
        endDate:z.string({required_error:"End Date is Required"}),
        startTime:z.string({required_error:"Start Time is Required"}),
        endTime:z.string({required_error:"End Time is Required"})
    })
});


export const ScheduleValidation={
    createScheduleSchema
}