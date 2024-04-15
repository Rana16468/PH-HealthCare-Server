import { UserRole } from '@prisma/client';
import express from 'express';
import { PrescriptionController } from './Prescription.controller';
import auth from '../../middleWeres/auth';


const router=express.Router();

router.post("/",auth(UserRole.DOCTOR),PrescriptionController.CreatePrescription);
router.get("/my-prescription",auth(UserRole.PATIENT),PrescriptionController.PatientPrescription)


export const PrescriptionRouter=router
