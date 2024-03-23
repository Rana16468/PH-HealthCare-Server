
import express, { NextFunction, Request, Response } from 'express';
import { AdminController } from './Admin.controller';
import validateRequest from '../../middleWeres/validateRequest';
import { AdminValidation } from './Admin.validation';
import auth from '../../middleWeres/auth';
import { UserRole } from '@prisma/client';
const router=express.Router();





router
.get('/',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),AdminController.getAll);
router.get("/:id",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),AdminController.getById);
router.patch("/:id", auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),validateRequest(AdminValidation.UpdateAdminSchema),AdminController.update);
router.delete('/:id',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),AdminController.deleted);
router.delete('/soft/:id',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),AdminController.softDelete);
export const AdminRouter=router;