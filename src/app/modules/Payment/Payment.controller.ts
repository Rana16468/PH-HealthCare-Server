import { RequestHandler } from "express";
import catchAsync from "../../shared/catchAsync";
import { PaymentService } from "./Payment.services";
import sendRespone from "../../shared/sendRespone";
import httpStatus from 'http-status-codes';


const InitPayment:RequestHandler=catchAsync(async(req,res)=>{
    

    const {appointmentId}=req.params;

    const result=await PaymentService.InitPaymentIntoSSL(appointmentId);
    sendRespone(res,{success:true,status:httpStatus.OK,message:"Payment Initilasation Successfully",data:result});


});

const ValidatePayment:RequestHandler=catchAsync(async(req,res)=>{

    const result=await PaymentService.ValidatePaymentIntoSSL(req);
    sendRespone(res,{success:true,status:httpStatus.OK,message:"Success Validate",data:result});

});

export const PaymentController={
    InitPayment,
    ValidatePayment
}