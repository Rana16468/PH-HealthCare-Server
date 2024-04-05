import express from 'express';
import auth from '../../middleWeres/auth';
import { UserRole } from '@prisma/client';
import { ScheduleController } from './Schedule.controller';
import validateRequest from '../../middleWeres/validateRequest';
import { ScheduleValidation } from './Schedule.Validation';


const router=express.Router();

router.post('/',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),validateRequest(ScheduleValidation.createScheduleSchema),ScheduleController.CreateSchedule);
router.get('/',auth(UserRole.DOCTOR,UserRole.SUPER_ADMIN,UserRole.ADMIN),ScheduleController.GetAllSchedule);
// task  delete Schedule


export const ScheduleRoutes=router;