import express, { Request, Response } from 'express';
import { UserController } from './User.controller';

const router=express.Router();

router.post('/',UserController.createAdmin);

export  const UserRoutes=router;