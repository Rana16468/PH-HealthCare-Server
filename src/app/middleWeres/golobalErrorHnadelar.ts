import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes';

const golobalErrorHnadelar = (err:Error,req:Request,res:Response,next:NextFunction) => {


   let statusCode=httpStatus.INTERNAL_SERVER_ERROR;
   let  message=err?.message || "Something went wrong";
   let success=false;
   let error=err;
    if(err instanceof PrismaClientValidationError)
    {
            statusCode=httpStatus.INTERNAL_SERVER_ERROR,
            success=false,
            message="Validation Error",
            error=err
    }
    else if(err instanceof PrismaClientKnownRequestError)
        //https://www.prisma.io/docs/orm/reference/error-reference#error-codes
        {
            if(err.code==="P2002")
                {
                    statusCode=httpStatus.INTERNAL_SERVER_ERROR,
                    success=false,
                    message="Unique constraint failed on the fields",
                    error=err
                }

        }


    res.status(statusCode).send({
        success,
        message,
        error
       })
       next();
   
};

export default golobalErrorHnadelar;