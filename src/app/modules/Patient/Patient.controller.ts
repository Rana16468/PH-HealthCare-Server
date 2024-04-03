import { RequestHandler } from "express";
import catchAsync from "../../shared/catchAsync";
import { PatientService } from "./Patient.sservices";
import sendRespone from "../../shared/sendRespone";
import httpStatus from 'http-status-codes';
import pick from "../../shared/pick";
import { patientFilterableFields } from "./Patient.constant";


const  GetAllPatient:RequestHandler=catchAsync(async(req,res)=>{

    const filter= pick(req.query,patientFilterableFields);
    
    const option=pick(req.query,['page','limit','sortBy','orderBy']);

    const result=await PatientService.GetAllPatientFromDB(filter,option);
    sendRespone(res,{success:true,status:httpStatus.OK,message:"Get All Patient Successfully",meta:result.meta,data:result.data});
});

const  GetByPatientId:RequestHandler=catchAsync(async(req,res)=>{

    const result=await PatientService.GetByPatientIdFromDB(req.params.id);
})

const DeletePatient:RequestHandler=catchAsync(async(req,res)=>{

   
    const result=await PatientService.DeletePatientIntoDb(req.params.id);
    sendRespone(res,{success:true,status:httpStatus.OK,message:"Delete  Successfully",data:result});
});
const  SoftPatientDelete:RequestHandler=catchAsync(async(req,res)=>{
  
    const result=await PatientService.SoftPatientDeleteIntoDb(req.params.id);
    sendRespone(res,{success:true,status:httpStatus.OK,message:"Soft Delete  Successfully",data:result});

});

const  UpdatePatient:RequestHandler=catchAsync(async(req,res)=>{

    const result= await PatientService.UpdatePatientIntoDb(req.params.id,req);
    sendRespone(res,{success:true,status:httpStatus.OK,message:"Update Patient Info Successfully",data:result});
});


export const PatientController={
    UpdatePatient,
    DeletePatient,
    GetAllPatient,
    GetByPatientId,
    SoftPatientDelete
}