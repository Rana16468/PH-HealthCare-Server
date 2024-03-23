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

const changePassword=catchAsync(async(req:Request,res:Response)=>{

    

    const result=await AuthServices.changePasswordIntoDb(req.user,req.body);
    sendRespone(res,{status:httpStatus.OK,success:true,message:"Password Chnage Successfully",data:result})



});

const forgotPassword=catchAsync(async(req:Request,res:Response)=>{

    const result=await AuthServices.forgotPassword(req.body);
    sendRespone(res,{status:httpStatus.OK,success:true,message:"Forgot Password Successfully",data:result})

});

const resetPassword=catchAsync(async(req:Request,res:Response)=>{

    const token=req.headers.authorization || ""

    const result=await AuthServices.resetPassword(token,req.body);
    sendRespone(res,{status:httpStatus.OK,success:true,message:"Reset Password Successfully Executed",data:result})
})
export const AuthController={
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
}