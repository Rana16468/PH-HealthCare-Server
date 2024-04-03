import { RequestHandler } from "express";
import catchAsync from "../../shared/catchAsync";
import { ScheduleService } from "./Schedule.services";
import sendRespone from "../../shared/sendRespone";
import httpStatus from 'http-status-codes';


const CreateSchedule:RequestHandler=catchAsync(async(req,res)=>{

    const result=await ScheduleService.CreateScheduleIntoDb(req.body);
    sendRespone(res,{success:true,status:httpStatus.CREATED,message:"Schedule Successfully Created",data:result});
});

export const ScheduleController={
    CreateSchedule
}