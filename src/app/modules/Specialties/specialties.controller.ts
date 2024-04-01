import { RequestHandler } from "express";
import catchAsync from "../../shared/catchAsync";
import { SpecialtiesService } from "./specialties.services";
import sendRespone from "../../shared/sendRespone";
import httpStatus from 'http-status-codes';

const createSpecialties:RequestHandler=catchAsync(async(req,res)=>{


    
    const result=await SpecialtiesService.createSpecialtiesIntoDb(req);
    sendRespone(res,{success:true,status:httpStatus.OK,message:"Create Specificialties Successfully",data:result});


});

const  GetAllSpecialties:RequestHandler=catchAsync(async(req,res)=>{

    const result=await SpecialtiesService.GetAllSpecialtiesIntoDb();
    sendRespone(res,{success:true,status:httpStatus.OK,message:"Get Successfully All Specialties Data",data:result})
});

const DeleteSpecialties:RequestHandler=catchAsync(async(req,res)=>{

    const result=await SpecialtiesService.DeleteSpecialtiesIntoDb(req.params.id);
    sendRespone(res,{success:true,status:httpStatus.OK,message:"Delete Successfully All Specialties Data",data:result})

})

export const SpecialtiesController={
    createSpecialties,
    GetAllSpecialties,
    DeleteSpecialties
}