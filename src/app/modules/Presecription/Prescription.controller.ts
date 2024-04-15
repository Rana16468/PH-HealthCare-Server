import { RequestHandler } from "express";
import catchAsync from "../../shared/catchAsync";
import { PresecriptionServices } from "./Prescription.services";
import sendRespone from "../../shared/sendRespone";
import httpsStatus from 'http-status-codes';
import pick from "../../shared/pick";


const CreatePrescription:RequestHandler=catchAsync(async(req,res)=>{

    
    const{email,role}=req.user;
    const result=await PresecriptionServices.CreatePrescriptionIntoDb({email,role},req.body);
    sendRespone(res,{success:true,status:httpsStatus.CREATED,message:"Successfully Created Prescription",data:result})
});

const PatientPrescription:RequestHandler=catchAsync(async(req,res)=>{

    const option=pick(req.query,['page','limit','sortBy','orderBy']);

    const {email,role}=req.user;

    const result=await PresecriptionServices.PatientPrescriptionFromDb({email,role},option);
    sendRespone(res,{success:true,status:httpsStatus.CREATED,message:"Successfully Rectrive Patient Prescription",meta:result.meta,data:result.data})
})

export const PrescriptionController={
    CreatePrescription,
    PatientPrescription
}