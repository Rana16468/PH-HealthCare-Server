import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middleWeres/auth';
import { ReviewController } from './review.controller';


const router=express.Router();
router.post("/",auth(UserRole.PATIENT),ReviewController.CreateReview);

// tASK all review get task ---- accaessable only Admin And SuperADMIN

export const ReviewRouter=router;