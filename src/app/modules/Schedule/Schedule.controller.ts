import { RequestHandler } from "express";
import catchAsync from "../../shared/catchAsync";
import { ScheduleService } from "./Schedule.services";
import sendRespone from "../../shared/sendRespone";
import httpStatus from 'http-status-codes';
import pick from "../../shared/pick";
import { scheduleFilterableFields } from "./Schedule.constant";


const CreateSchedule:RequestHandler=catchAsync(async(req,res)=>{

    const result=await ScheduleService.CreateScheduleIntoDb(req.body);
    sendRespone(res,{success:true,status:httpStatus.CREATED,message:"Schedule Successfully Created",data:result});
});

const GetAllSchedule:RequestHandler=catchAsync(async(req,res)=>{
    const filter= pick(req.query,scheduleFilterableFields);
    
    const option=pick(req.query,['page','limit','sortBy','orderBy']);

    const {email}=req.user;

    const result=await ScheduleService.GetAllScheduleFromDb(filter,option,email);
    sendRespone(res,{success:true,status:httpStatus.OK,message:"Get All Schedule Successfully",meta:result.meta,data:result.data});
});
const GetByIdSchedule:RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ScheduleService.GetByIdFromDB(id);
   sendRespone(res, {
    status: httpStatus.OK,
      success: true,
      message: 'Schedule retrieval successfully',
      data: result,
    });
  });
  
  const DeleteSchedule:RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ScheduleService.GetDeleteFromDB(id);
    sendRespone(res, {
      status: httpStatus.OK,
      success: true,
      message: 'Schedule deleted successfully',
      data: result,
    });
  });

export const ScheduleController={
    CreateSchedule,
    GetAllSchedule,
    GetByIdSchedule,
    DeleteSchedule
}