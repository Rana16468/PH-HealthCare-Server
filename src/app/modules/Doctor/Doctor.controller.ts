import { RequestHandler } from "express";
import catchAsync from "../../shared/catchAsync";
import { DoctorService } from "./Doctor.services";
import sendRespone from "../../shared/sendRespone";
import httpStatus from 'http-status-codes';


const UpdateDoctor:RequestHandler=catchAsync(async(req,res)=>{


    const result=await DoctorService.UpdateDoctorIntoDb(req.params.id,req);
    sendRespone(res,{success:true,status:httpStatus.OK,message:"Update Doctoe Successfully",data:result});
});

export const DoctorController={
    UpdateDoctor
}