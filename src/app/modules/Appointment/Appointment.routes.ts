

import express from 'express';
import auth from '../../middleWeres/auth';
import { UserRole } from '@prisma/client';
import { AppointmentController } from './Appointment.controller';
import validateRequest from '../../middleWeres/validateRequest';
import { AppointmentValidation } from './Appointment.validation';

const router=express.Router();
router.post("/",auth(UserRole.PATIENT),validateRequest(AppointmentValidation.CreateAppointmentSchema),AppointmentController.createAppointment);
router.get("/my-appointment",auth(UserRole.DOCTOR,UserRole.PATIENT),AppointmentController.GetMyAppointment);
// task ----> Get All Appointment filtering --->only accesable admin and super admin
router.patch('/status/:id',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN,UserRole.DOCTOR),AppointmentController.changeAppointmentStatus);

export const AppointmentRouter=router;