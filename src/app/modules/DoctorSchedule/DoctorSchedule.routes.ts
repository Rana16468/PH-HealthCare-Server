

import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middleWeres/auth';
import { DoctorScheduleController } from './DoctorSchedule.controller';
import validateRequest from '../../middleWeres/validateRequest';
import { DoctorScheduleValidation } from './DoctorSchedule.Validation';




const router=express.Router();

router.post("/",auth(UserRole.DOCTOR),validateRequest(DoctorScheduleValidation.createDoctorScheduleSchema),DoctorScheduleController.CreateDoctorSchedule);
// task get with Id Doctor Schedule 
// task get all doctor schedule
router.get("/",auth(UserRole.ADMIN,UserRole.DOCTOR,UserRole.SUPER_ADMIN),DoctorScheduleController.GetAllDoctorSchedule);
router.delete("/:id",auth(UserRole.DOCTOR),DoctorScheduleController.DeleteDoctorSchedule);
export const DoctorScheduleRouter=router;