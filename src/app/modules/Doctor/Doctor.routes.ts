import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middleWeres/auth';
import { UserRole } from '@prisma/client';
import { DoctorController } from './Doctor.controller';
import { upload } from '../../utility/sendImageToCloudinary';
import validateRequest from '../../middleWeres/validateRequest';
import { DoctorValidation } from './Doctor.Validation';



const router=express.Router();

// get all doctor router

router.get('/',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),DoctorController.getAllDoctor);

// get specific id

router.get("/:id",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),DoctorController.getByIdDoctor);

// delete doctor
router.delete(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    DoctorController.deleteDoctor
);

// soft delete by the doctor
router.delete(
    '/soft/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    DoctorController.softDeleteDoctor);

    
// update router
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