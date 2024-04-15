
import { IAuthUser } from "../../Interfaces/common"
import prisma from "../../shared/prisma"
import ApiError from "../../errors/ApiError";
import httpStatus from 'http-status-codes';


const CreateReviewIntoDb=async(user:IAuthUser,payload:any)=>{

const patientData=await prisma.patient.findUniqueOrThrow({
    where:{
        email:user?.email
    },
    select:{
        id:true
    }
});


    const appointmentData=await prisma.appointment.findUniqueOrThrow({
        where:{
            id:payload.appointmentId
        }
    });

        if(!(patientData.id===appointmentData.patientId))
        {

            throw new ApiError(httpStatus.BAD_REQUEST,"Not Match Patient Info","")

        }
       const reviewResult=  await prisma.$transaction(async(tx)=>{
            
         const result=tx.review.create({
           data:{
           appointmentId:appointmentData.id ,
           doctorId:appointmentData.doctorId,
           patientId:appointmentData.patientId,
            rating:payload.rating ,
            comment:payload.comment
            
        }
    });
    const averageRating=await tx.review.aggregate({
        _avg:{
            rating :true
        }
    });

    await tx.doctor.update({
        where:{
            id:appointmentData.doctorId
        },
        data:{
            averageRating:averageRating._avg.rating as number
        }
    });
    return result
    
         })

    return reviewResult;
}

export const ReviewServices={
    CreateReviewIntoDb
}