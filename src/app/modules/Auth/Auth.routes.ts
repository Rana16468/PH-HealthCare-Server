

import express from 'express';
import { AuthController } from './Auth.controller';
import auth from '../../middleWeres/auth';
import { UserRole } from '@prisma/client';

const router=express();

router.post("/login",AuthController.loginUser);
router.post('/refreshToken',AuthController.refreshToken);
router.post('/chnage-password',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN,UserRole.PATIENT,UserRole.PATIENT),AuthController.changePassword);
router.post("/forgot-password",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN,UserRole.PATIENT,UserRole.PATIENT),AuthController.forgotPassword);
router.post("/reset-password",AuthController.resetPassword);

export const AuthRouter=router