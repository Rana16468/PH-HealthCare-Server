
import express, { NextFunction, Request, Response } from 'express';
import { AdminController } from './Admin.controller';
import validateRequest from '../../middleWeres/validateRequest';
import { AdminValidation } from './Admin.validation';
const router=express.Router();





router
.get('/',AdminController.getAll);
router.get("/:id",AdminController.getById);
router.patch("/:id", validateRequest(AdminValidation.UpdateAdminSchema),AdminController.update);
router.delete('/:id',AdminController.deleted);
router.delete('/soft/:id',AdminController.softDelete);
export const AdminRouter=router;