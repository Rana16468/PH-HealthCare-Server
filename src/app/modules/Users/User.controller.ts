import { Request, RequestHandler, Response } from "express";
import { UserService } from "./User.services";
import catchAsync from "../../shared/catchAsync";
import sendRespone from "../../shared/sendRespone";
import httpStatus from 'http-status-codes';
import pick from "../../shared/pick";
import { userFilterableFields } from "./User.constant";

const createAdmin=async(req:Request,res:Response)=>{


  

  try{
    const result=await UserService.createAdminFromDb(req);
    
    res.status(200).json({success:true,message:"User is Created",data:result});
  }
  catch(error:any)
  {
    res.status(500).json({success:false,message:error?.name || "Something went wrong",error})
  }

}

const createDoctor:RequestHandler=catchAsync(async(req,res)=>{
 
  const result=await UserService.createDoctorFromDb(req);
  sendRespone(res,{success:true,status:httpStatus.CREATED,message:"Successfully Doctor Created",data:result});

});

const  createPatient:RequestHandler=catchAsync(async(req,res)=>{


  const result=await UserService.createPatientIntoDb(req);
  sendRespone(res,{success:true,status:httpStatus.CREATED,message:"Successfully Patient Created",data:result});

})

const getAll:RequestHandler=catchAsync(async(req,res)=>{


  const filter= pick(req.query,userFilterableFields);
  
  const option=pick(req.query,['page','limit','sortBy','orderBy']);
  
  // console.log(option);
  
      const result=await UserService.getAllFromDb(filter,option);
      sendRespone(res,{status:httpStatus.OK,success:true,message:"Get User All Featch",meta: result.meta,data:result.data})
     
    
  
     
    
  
  });

  const chnageProfileStatus:RequestHandler=catchAsync(async(req,res)=>{

    const {id}=req.params;

    const result=await UserService.chnageProfileStatusFromDb(id,req.body);
    sendRespone(res,{status:httpStatus.OK,success:true,message:"Change Profile Status",data:result});


  });

export const  UserController={
    createAdmin,
    createDoctor,
    getAll,
    chnageProfileStatus,
    createPatient
}