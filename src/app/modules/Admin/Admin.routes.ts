
import express from 'express';
import { AdminController } from './Admin.controller';

const router=express.Router();

router
.get('/',AdminController.getAll);
export const AdminRouter=router;