import express from 'express';
import auth from '../../middleWeres/auth';
import { UserRole } from '@prisma/client';
import { PatientController } from './Patient.controller';
import { PatientValidation } from './Patient.Validation';
import validateRequest from '../../middleWeres/validateRequest';


const router=express();

router.get("/",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),PatientController.GetAllPatient);
router.get("/:id",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),PatientController.GetByPatientId);
router.patch('/:id',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN,UserRole.PATIENT),validateRequest(PatientValidation.UpdatePatientValidationSchema),PatientController.UpdatePatient);
router.delete("/:id",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),PatientController.DeletePatient);
router.delete("/soft/:id",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),PatientController.SoftPatientDelete);

export const PatientRouter=router;