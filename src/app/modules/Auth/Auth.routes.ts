

import express from 'express';
import { AuthController } from './Auth.controller';

const router=express();

router.post("/login",AuthController.loginUser);
router.post('/refreshToken',AuthController.refreshToken);

export const AuthRouter=router;