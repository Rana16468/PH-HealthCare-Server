import { Request, Response } from "express";
import { UserService } from "./User.services";


const createAdmin=async(req:Request,res:Response)=>{



  try{
    const result=await UserService.createAdminFromDb(req.body);
    
    res.status(200).json({success:true,message:"User is Created",data:result});
  }
  catch(error:any)
  {
    res.status(500).json({success:false,message:error?.name || "Something went wrong",error})
  }

}

export const  UserController={
    createAdmin
}