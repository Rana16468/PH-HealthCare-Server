import { RequestHandler } from "express";
import catchAsync from "../../shared/catchAsync";
import { AppointmentService } from "./Appointment.services";
import httpStatus from 'http-status-codes';
import sendRespone from "../../shared/sendRespone";
import pick from "../../shared/pick";


const createAppointment:RequestHandler=catchAsync(async(req,res)=>{


    const result=await AppointmentService.createAppointmentIntoDb(req.user.email,req.body);
    sendRespone(res,{success:true,status:httpStatus.CREATED,message:"Create Appointment Successfully",data:result})
});

const GetMyAppointment:RequestHandler=catchAsync(async(req,res)=>{


    const {email,role}=req.user;
    const filter= pick(req.query, ['status','paymentStatus']);
    const option=pick(req.query,['page','limit','sortBy','orderBy']);

   
    const result=await AppointmentService.GetMyAppointmentFromDB({email,role},filter,option);
    sendRespone(res,{success:true,status:httpStatus.OK,message:"Successfully Get My Appointment",meta:result.meta,data:result.data})

});

const changeAppointmentStatus:RequestHandler=catchAsync(async(req,res)=>{

    const {id}=req.params;
    const {status}=req.body;

    const {role,email}=req.user;

    const result=await AppointmentService.changeAppointmentStatusFromDb(id,status,{role,email});
    sendRespone(res,{success:true,status:httpStatus.OK,message:"Chnage Appoint Status Successfully",data:result});

})

export const AppointmentController={
    createAppointment,
    GetMyAppointment,
    changeAppointmentStatus
}