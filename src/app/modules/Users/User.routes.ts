import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './User.controller';
import auth from '../../middleWeres/auth';
import { UserRole } from '@prisma/client';
import { upload } from '../../utility/sendImageToCloudinary';
import validateRequest from '../../middleWeres/validateRequest';
import { userValidation } from './User.Validation';

const router=express.Router();



router.get("/",auth(UserRole.SUPER_ADMIN,UserRole.ADMIN),UserController.getAll);

router.post('/create-admin',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),upload.single('file'),(req:Request,res:Response,next:NextFunction)=>{
    req.body=JSON.parse(req.body.data)
    next();
},validateRequest(userValidation.createAdminValidation),UserController.createAdmin);

router.post('/create-doctor',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),upload.single('file'),(req:Request,res:Response,next:NextFunction)=>{
      
    
    req.body=JSON.parse(req.body.doctor)
    next();
},validateRequest(userValidation.createDoctorValidation),UserController.createDoctor);


router.post('/create-patient',upload.single('file'),(req:Request,res:Response,next:NextFunction)=>{
      
    
    req.body=JSON.parse(req.body.patient)
    next();
},validateRequest(userValidation.createPatientValidation),UserController.createPatient);

router.patch("/:id/status",validateRequest(userValidation.chnageProfileStatusValidation),auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),UserController.chnageProfileStatus);


export  const UserRoutes=router;