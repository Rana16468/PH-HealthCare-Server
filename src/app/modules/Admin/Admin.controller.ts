import { NextFunction, Request, Response } from "express";
import { AdminService } from "./Admin.services"
import pick from "../../shared/pick";
import { adminFilterableFields } from "./Admin.constants";
import httpStatus from 'http-status-codes';
import sendRespone from "../../shared/sendRespone";






const getAll=async(req:Request,res:Response,next:NextFunction)=>{


const filter= pick(req.query,adminFilterableFields);

const option=pick(req.query,['page','limit','sortBy','orderBy']);

// console.log(option);


   try{
    const result=await AdminService.getAllFromDb(filter,option);
    sendRespone(res,{status:httpStatus.OK,success:true,message:"Get All Featch",meta: result.meta,data:result.data})
   }
   catch(error:any){

    next(error);

   }

   
  

}

const getById=async(req:Request,res:Response,next:NextFunction)=>{
   
    try{
        const result=await AdminService.getbyIdFromDb(req.params.id);
        sendRespone(res,{status:httpStatus.OK,success:true,message:"Admin data Featched",data:result})
    }
    catch(error:any)
    {
        next(error);

    }
}

const update=async(req:Request,res:Response,next:NextFunction)=>{
    const {id}=req.params;
    
    try{

        const result=await AdminService.updateIntoDb(id,req.body)
        sendRespone(res,{status:httpStatus.OK,success:true,message:"Update Successfully",data:result})
    }
    catch(error:any)
    {
        next(error);
    }
    


}

const deleted=async(req:Request,res:Response,next:NextFunction)=>{
    const {id}=req.params;

    
    
    try{

        const result=await AdminService.deleteFromDb(id)
        sendRespone(res,{status:httpStatus.OK,success:true,message:"Admin Data Deleted",data:result})
    }
    catch(error:any)
    {
        next(error);


    }
    

}

const softDelete=async(req:Request,res:Response,next:NextFunction)=>{
    const {id}=req.params;

    
    
    try{

        const result=await AdminService.softDeleteFromDb(id)
        sendRespone(res,{status:httpStatus.OK,success:true,message:"Admin data Soft Deleted",data:result})
    }
    catch(error:any)
    {
        next(error);

    }
    

}


export const AdminController={
    getAll,
     getById,update,
     deleted,
     softDelete
}