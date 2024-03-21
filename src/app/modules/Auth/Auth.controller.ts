import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AuthServices } from "./Auth.services";
import sendRespone from "../../shared/sendRespone";
import httpStatus from "http-status-codes"


const loginUser=catchAsync(async(req:Request,res:Response)=>{

    const result=await AuthServices.loginUserFromDb(req.body);
    const {  refreshToken, accessToken, needPasswordChange}=result;
    res.cookie('refreshToken',refreshToken,{
        secure:false,
        httpOnly:true
    });
    sendRespone(res,{status:httpStatus.OK,success:true,message:"Login IN Successfylly",data:{
        accessToken,
        needPasswordChange
    }})


});

const  refreshToken=catchAsync(async(req:Request,res:Response)=>{
//https://www.npmjs.com/package/cookie-parser
    const {refreshToken}=req.cookies;
    const result=await AuthServices.refreshToken(refreshToken);
    sendRespone(res,{status:httpStatus.OK,success:true,message:"Refresh Token Get Successfully",data:result})



});
export const AuthController={
    loginUser,
    refreshToken
}