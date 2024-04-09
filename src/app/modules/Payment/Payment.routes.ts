


import express from 'express';
import { PaymentController } from './Payment.controller';

const router=express.Router();


router.post("/init-payment/:appointmentId",PaymentController.InitPayment);
router.get('/ipn',PaymentController.ValidatePayment);
export const PaymentRouters=router;