

import prisma from '../../shared/prisma';
import { SSLService } from '../SSL/SSL.services';
import { Request } from 'express';
import { PaymentStatus } from '@prisma/client';

const InitPaymentIntoSSL =async(appointmentId:string)=>{

    const paymentData=await prisma.payment.findUniqueOrThrow({
        where:{
            appointmentId
        },
        include:{
            appointment:{
                include:{
                    patient:true
                }
            }
        },
    });

    const initPaymentData={
        amount:paymentData.amount,
        transactionId:paymentData.transactionId,
        name:paymentData.appointment.patient.name,
        email:paymentData.appointment.patient.email,
        address:paymentData.appointment.patient.address,
        contractNumber:paymentData.appointment.patient.contractNumber

    }
   const result=await SSLService.sslInitPayment(initPaymentData) 

  return {
    paymentUrl:result.GatewayPageURL
  }
}

const ValidatePaymentIntoSSL=async(req:any)=>{
    const payload=req.query;

  /*  const payload=req.query;

  if(!payload || !payload.status || !(payload.status==="VALID") )
    {
        return {
            message:"Invalidate Payment"
        }
    }

   const respone=await SSLService.validitePayment(payload);
   if(respone?.status!=="VALID")
    {
        return {
            message:"payment Failed"
        }
    }*/
//https://developer.sslcommerz.com/doc/v4/
// ssl commerz ipn linser

/*amount=1150.00&bank_tran_id=151114130739MqCBNx5&card_brand=VISA&card_issuer=BRAC+BANK%2C+LTD.&card_issuer_country=Bangladesh&card_issuer_country_code=BD&card_no=432149XXXXXX0667&card_type=VISA-Brac+bank¤cy=BDT&status=VALID&store_amount=1104.00&store_id=iinde650138cb385ca&tran_date=2015-11-14+13%3A07%3A12&tran_id=5646dd9d4b484&val_id=151114130742Bj94IBUk4uE5GRj&verify_sign=ad2fcec4f13952a2fd2ce15031c95607&verify_key=amount%2Cbank_tran_id%2Ccard_brand%2Ccard_issuer%2Ccard_issuer_country%2Ccard_issuer_country_code%2Ccard_no%2Ccard_type%2Ccurrency%2Cstatus%2Cstore_amount%2Cstore_id%2Ctran_date%2Ctran_id%2Cval_id */
        const respone=payload

        await prisma.$transaction(async(tx)=>{

            const updatePaymentData=await tx.payment.update({
            where:{
                transactionId:respone?.tran_id
            },
            data:{
                paymentStatus:PaymentStatus.PAID,
                paymentGatewayData:respone
            }
            });
             await tx.appointment.update({
                 where:{
                    id:updatePaymentData.appointmentId
                 },
                 data:{
                    paymentStatus:PaymentStatus.PAID
                 }
             })
        })
        

  return {
    message:"Payment Success"
  }
}

export const PaymentService={
    InitPaymentIntoSSL,
    ValidatePaymentIntoSSL
}