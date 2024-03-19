import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes';

const golobalErrorHnadelar = (error:Error,req:Request,res:Response,next:NextFunction) => {

    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        success:false,
        message:error?.message || "Something went wrong",
        error
       })
       next();
   
};

export default golobalErrorHnadelar;