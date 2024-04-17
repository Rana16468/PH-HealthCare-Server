import express from 'express';
import { MetaController } from './Meta.controller';
import { UserRole } from '@prisma/client';
import auth from '../../middleWeres/auth';

const router=express.Router();

router.get('/',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN,UserRole.DOCTOR,UserRole.PATIENT),MetaController.fetchDashboardMetaData);
export const MetaRoutes=router;