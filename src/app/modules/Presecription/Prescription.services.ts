import { AppointmentStatus, PaymentStatus, Prescription } from "@prisma/client";
import { IAuthUser } from "../../Interfaces/common"
import prisma from "../../shared/prisma"
import ApiError from "../../errors/ApiError";
import httpStatus from 'http-status-codes';
import { IPaginationOptions } from "../../Interfaces/pagination";
import calculatePagination from "../../helper/paginationHelper";


const CreatePrescriptionIntoDb=async(user:IAuthUser,payload:Partial<Prescription>)=>{

const appointmentData=await prisma.appointment.findUniqueOrThrow({
    where:{
        id:payload.appointmentId,
        status:AppointmentStatus.COMPLETED,
        paymentStatus:PaymentStatus.PAID
    },
    include:{
        doctor:true
    }
});

    if(!(user?.email===appointmentData.doctor.email))
    {

        throw new ApiError(httpStatus.BAD_REQUEST,"That is Not Your Prescription","");

    }
    const result=await prisma.prescription.create({
        data:{
            appointmentId:appointmentData.id,
            doctorId:appointmentData.doctorId,
            patientId:appointmentData.patientId,
            instructions:payload.instructions as string, 
            followUpDate:payload.followUpDate || null

        },
        include:{
            patient:true,
            
        }
    })

    return result
}

const PatientPrescriptionFromDb=async(user:IAuthUser,option:IPaginationOptions)=>{


    const {limit,page,sortBy,orderBy,skip}=calculatePagination(option);
    const result=await prisma.prescription.findMany({
        where:{
            patient:{
                email:user?.email
            }
        },
        skip,
        take:limit,
        orderBy:option.sortBy && option.orderBy?{
            [option.sortBy]:option.orderBy
        }:{
            createdAt: 'desc',
        },
        include:{
            doctor:true,
            patient:true,
            appointment:true

        }
    });
    const total = await prisma.prescription.count({
        where:{
            patient:{
                email:user?.email
            }
        } ,
      });

    return {
        meta:{
            total,
            page,
            limit
        },data:result
    }
}

export const PresecriptionServices={
    CreatePrescriptionIntoDb,
    PatientPrescriptionFromDb
}