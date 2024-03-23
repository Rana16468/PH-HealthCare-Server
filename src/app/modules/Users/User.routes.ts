import express from 'express';
import { UserController } from './User.controller';
import auth from '../../middleWeres/auth';
import { UserRole } from '@prisma/client';

const router=express.Router();



router.post('/',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),UserController.createAdmin);

export  const UserRoutes=router;