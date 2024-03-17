import { Request, Response } from "express";
import { AdminService } from "./Admin.services"
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./Admin.constants";




const getAll=async(req:Request,res:Response)=>{


const filter= pick(req.query,adminFilterableFields);

const option=pick(req.query,['page','limit','sortBy','orderBy']);

// console.log(option);


   try{
    const result=await AdminService.getAllFromDb(filter,option);
    res.status(200).json({success:true,message:"Get All Featched",data:result});
   }
   catch(error:any){

    res.status(500).json({
        success:false,message:error?.name || 'Something went wrong',error
    });
   }

   
  

}

export const AdminController={
    getAll
}