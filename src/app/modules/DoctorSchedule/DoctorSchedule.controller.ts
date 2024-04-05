import { RequestHandler } from "express";
import catchAsync from "../../shared/catchAsync";
import { DoctorScheduleService } from "./DoctorSchedule.service.s";
import sendRespone from "../../shared/sendRespone";
import httpStatus from 'http-status-codes';
import pick from "../../shared/pick";
import { doctorScheduleFilterableFields } from "./DoctorSchedule.constant";


const CreateDoctorSchedule:RequestHandler=catchAsync(async(req,res)=>{


  
    const result=await DoctorScheduleService.CreateDoctorScheduleIntoDb(req);
    sendRespone(res,{success:true,status:httpStatus.CREATED,message:"Successfuly Created Doctor Schedule",data:result});
});

const  GetAllDoctorSchedule:RequestHandler=catchAsync(async(req,res)=>{

    

    const filter= pick(req.query,doctorScheduleFilterableFields);
    
    const option=pick(req.query,['page','limit','sortBy','orderBy']);

   


    const result=await DoctorScheduleService.GetAllDoctorScheduleIntoDb(filter,option,req.user.email);
    sendRespone(res,{success:true,status:httpStatus.OK,message:"Successfuly Get Doctor Schedule",data:result});
});

const DeleteDoctorSchedule=catchAsync(async(req,res)=>{


    const result=await DoctorScheduleService.DeleteDoctorScheduleFromDb(req.params.id,req.user.email);

    sendRespone(res,{success:true,status:httpStatus.OK,message:"Successfuly Deelete Doctor Schedule",data:result});

});

export const DoctorScheduleController={
    CreateDoctorSchedule,
    GetAllDoctorSchedule,
    DeleteDoctorSchedule
}