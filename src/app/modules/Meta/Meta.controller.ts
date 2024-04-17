import { RequestHandler } from "express";
import catchAsync from "../../shared/catchAsync";
import { MetaService } from "./Meta.services";
import sendRespone from "../../shared/sendRespone";
import httpStatus from 'http-status-codes';

const fetchDashboardMetaData:RequestHandler=catchAsync(async(req,res)=>{

  const {email,role}=req.user;
    const result=await MetaService.fetchDashboardMetaData({email,role});
    sendRespone(res,{success:true,status:httpStatus.OK,message:"Successfully Fetch",data:result})
});


export const MetaController={
    fetchDashboardMetaData
}