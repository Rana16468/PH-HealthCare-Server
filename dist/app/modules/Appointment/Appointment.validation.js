"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentValidation = void 0;
const zod_1 = require("zod");
const CreateAppointmentSchema = zod_1.z.object({
    body: zod_1.z.object({
        doctorId: zod_1.z.string({ required_error: "doctor Id is Required" }).uuid(),
        scheduleId: zod_1.z.string({ required_error: "schedule Id is Required" }).uuid()
    })
});
exports.AppointmentValidation = {
    CreateAppointmentSchema
};
