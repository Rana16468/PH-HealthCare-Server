import express from 'express';
import auth from '../../middleWeres/auth';
import { UserRole } from '@prisma/client';
import { ScheduleController } from './Schedule.controller';


const router=express.Router();

router.post('/',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),ScheduleController.CreateSchedule);



export const ScheduleRoutes=router;