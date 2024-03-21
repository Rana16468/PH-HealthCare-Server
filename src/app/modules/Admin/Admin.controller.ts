import { RequestHandler } from "express";
import { AdminService } from "./Admin.services"
import pick from "../../shared/pick";
import { adminFilterableFields } from "./Admin.constants";
import httpStatus from 'http-status-codes';
import sendRespone from "../../shared/sendRespone";
import catchAsync from "../../shared/catchAsync";



// higher order function 




const getAll:RequestHandler=catchAsync(async(req,res)=>{


    const filter= pick(req.query,adminFilterableFields);
    
    const option=pick(req.query,['page','limit','sortBy','orderBy']);
    
    // console.log(option);
    
        const result=await AdminService.getAllFromDb(filter,option);
        sendRespone(res,{status:httpStatus.OK,success:true,message:"Get All Featch",meta: result.meta,data:result.data})
       
      
    
       
      
    
    })

const getById:RequestHandler=catchAsync(async(req,res)=>{
  
        const result=await AdminService.getbyIdFromDb(req.params.id);
        sendRespone(res,{status:httpStatus.OK,success:true,message:"Admin data Featched",data:result})
    
    
})

const update:RequestHandler=catchAsync(async(req,res)=>{
        const {id}=req.params;
        const result=await AdminService.updateIntoDb(id,req.body)
        sendRespone(res,{status:httpStatus.OK,success:true,message:"Update Successfully",data:result})  
})

const deleted:RequestHandler=catchAsync(async(req,res)=>{
        const {id}=req.params;
        const result=await AdminService.deleteFromDb(id)
        sendRespone(res,{status:httpStatus.OK,success:true,message:"Admin Data Deleted",data:result})
})

const softDelete:RequestHandler=catchAsync(async(req,res)=>{
        const {id}=req.params;
        const result=await AdminService.softDeleteFromDb(id)
        sendRespone(res,{status:httpStatus.OK,success:true,message:"Admin data Soft Deleted",data:result})
})


export const AdminController={
    getAll,
     getById,update,
     deleted,
     softDelete
}