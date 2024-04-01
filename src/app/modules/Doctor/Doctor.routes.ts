import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middleWeres/auth';
import { UserRole } from '@prisma/client';
import { DoctorController } from './Doctor.controller';
import { upload } from '../../utility/sendImageToCloudinary';
import validateRequest from '../../middleWeres/validateRequest';
import { DoctorValidation } from './Doctor.Validation';



const router=express.Router();


router.patch("/:id",
auth(UserRole.DOCTOR,UserRole.ADMIN,UserRole.SUPER_ADMIN),
upload.single('file'),(req:Request,res:Response,next:NextFunction)=>{
      
    req.body=JSON.parse(req.body.data)
    next();
},
validateRequest(DoctorValidation.UpdateDoctorValidation)
,
DoctorController.UpdateDoctor

)
export const DoctorRouter=router;