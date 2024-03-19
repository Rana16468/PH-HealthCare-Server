
import express from 'express';
import { AdminController } from './Admin.controller';

const router=express.Router();

router
.get('/',AdminController.getAll);
router.get("/:id",AdminController.getById);
router.patch("/:id",AdminController.update);
router.delete('/:id',AdminController.deleted);
router.delete('/soft/:id',AdminController.softDelete);
export const AdminRouter=router;