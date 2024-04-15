import { RequestHandler } from "express";
import catchAsync from "../../shared/catchAsync";
import httpStatus from 'http-status-codes';
import sendRespone from "../../shared/sendRespone";
import { ReviewServices } from "./review.services";


const CreateReview:RequestHandler=catchAsync(async(req,res)=>{

    const {role,email}=req.user;

    const result=await ReviewServices.CreateReviewIntoDb({role,email},req.body);
    sendRespone(res,{success:true,status:httpStatus.CREATED,message:"Review Successfully Created",data:result});
});

export const ReviewController={
    CreateReview
}