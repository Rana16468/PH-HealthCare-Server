"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleValidation = void 0;
const zod_1 = require("zod");
const createScheduleSchema = zod_1.z.object({
    body: zod_1.z.object({
        startDate: zod_1.z.string({ required_error: "start date is Required" }),
        endDate: zod_1.z.string({ required_error: "End Date is Required" }),
        startTime: zod_1.z.string({ required_error: "Start Time is Required" }),
        endTime: zod_1.z.string({ required_error: "End Time is Required" })
    })
});
exports.ScheduleValidation = {
    createScheduleSchema
};
