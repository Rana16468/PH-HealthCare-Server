import express, { NextFunction, Request, Response } from 'express';
import { SpecialtiesController } from './specialties.controller';
import validateRequest from '../../middleWeres/validateRequest';
import { SpecialtiesValidation } from './Specialties.Validation';
import { upload } from '../../utility/sendImageToCloudinary';
import auth from '../../middleWeres/auth';
import { UserRole } from '@prisma/client';


const router=express.Router();

router.get("/",auth(UserRole.DOCTOR,UserRole.SUPER_ADMIN,UserRole.ADMIN),SpecialtiesController.GetAllSpecialties)

router.post("/",
auth(UserRole.DOCTOR,UserRole.ADMIN,UserRole.SUPER_ADMIN),
upload.single('file'),(req:Request,res:Response,next:NextFunction)=>{
      
    req.body=JSON.parse(req.body.data)
    next();
},
validateRequest(SpecialtiesValidation.createSpecialtiesValidation),SpecialtiesController.createSpecialties);

router.delete("/:id",auth(UserRole.DOCTOR,UserRole.ADMIN,UserRole.SUPER_ADMIN),SpecialtiesController.DeleteSpecialties);
export const SpecialtiesRouter=router;