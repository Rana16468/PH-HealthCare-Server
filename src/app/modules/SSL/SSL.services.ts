import axios from "axios";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import httpStatus from 'http-status-codes';
import { IPaymentData } from "./SSL.interface";

const sslInitPayment=async(paymentData:IPaymentData)=>{

   try{
    const data = {
        store_id :config.ssl_commerce.store_id,
        store_passwd :config.ssl_commerce.store_passwd,
        total_amount: paymentData?.amount,
        currency: 'BDT',
        tran_id: paymentData?.transactionId, // use unique tran_id for each api call
        success_url: config.ssl_commerce.success_url,
        fail_url: config.ssl_commerce.fail_url,
        cancel_url: config.ssl_commerce.cancel_url,
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method: 'N/A',
        product_name: 'Appointment',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: paymentData?.name,
        cus_email: paymentData?.email,
        cus_add1: paymentData?.address,
        cus_add2: 'N/A',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: paymentData?.contractNumber,
        cus_fax: '01711111111',
        ship_name: 'N/A',
        ship_add1: 'N/A',
        ship_add2: 'N/A',
        ship_city: 'N/A',
        ship_state: 'N/A',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };

   const respone=await axios({
    method:"POST",
    url:config.ssl_commerce.ssl_payment_api,
    data:data,
    headers:{
        "Content-Type":"application/x-www-form-urlencoded"
    }
   });
   return respone.data

   }
   catch(error){

    throw new ApiError(httpStatus.BAD_GATEWAY,"payment error occurted","");
   }

}

const validitePayment=async(payload:any)=>{

    try{
        const respone=await axios({
            method:"GET",
            url:`${config.ssl_commerce.ssl_validation_api}?val_id=${payload.val_id}&store_id=${config.ssl_commerce.store_id}&store_passwd=${config.ssl_commerce.store_passwd}&format=json`
        });
    
        return respone?.data;
    }
    catch(error)
    {
        throw new ApiError(httpStatus.BAD_REQUEST,"payment validation error","");
    }
}

export const SSLService={
    sslInitPayment,
    validitePayment
}