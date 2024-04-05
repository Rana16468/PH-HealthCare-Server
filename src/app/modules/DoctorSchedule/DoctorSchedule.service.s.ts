import { Request } from "express"
import prisma from "../../shared/prisma";
import { IPaginationOptions } from "../../Interfaces/pagination";
import calculatePagination from "../../helper/paginationHelper";
import { Prisma } from "@prisma/client";
import { IFilterRequest } from "./DoctorSchedule.Interface";
import ApiError from "../../errors/ApiError";
import httpStatus from 'http-status-codes';

const CreateDoctorScheduleIntoDb=async(req:Request)=>{

    const {email}=req.user;

    const doctorData=await prisma.doctor.findUniqueOrThrow({
        where:{
            email
        },
        select:{
            id:true
        }
    });

    const doctorScheduleData=req.body.scheduleIds.map((scheduleId :string)=>({doctorId:doctorData.id,scheduleId}));
    const result=await prisma.doctorSchedules.createMany({
        data:doctorScheduleData
    });
    return result;
}

const GetAllDoctorScheduleIntoDb=async( params: IFilterRequest,option: IPaginationOptions,email:string)=>{
    const {startDate,endDate,...filterData}=params;

   
    
    
    const {limit,page,skip}=calculatePagination(option);
    const andConditions = [];

   

    if(startDate && endDate)
      {
        andConditions.push({
          AND:[
            {
              schedule:{
                startDateTime:{
                    gte:startDate
                  }
              }
            },
            {
              schedule:{
                endDateTime:{
                    lte:endDate
                  }
              }
            }
          ]
        })
      }

    

      if (Object.keys(filterData).length > 0) {
        if(typeof filterData.isBooked==="string" && filterData.isBooked==="true")
            {
               filterData.isBooked=true;
            }
        else if(typeof filterData.isBooked==='string' && filterData.isBooked==="false")
         {
                   filterData.isBooked=false
         }
         
        andConditions.push({
          AND: Object.keys(filterData).map(key => {
            return {
              [key]: {
                equals: (filterData as any)[key],
              },
            };
          }),
        });
      }
   

      const whereConditions: Prisma.DoctorSchedulesWhereInput=
    andConditions.length > 0 ? { AND: andConditions } : {};

   
   
    const result = await prisma.doctorSchedules.findMany({
        
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
          option.sortBy && option.orderBy
            ? { [option.sortBy]: option.orderBy }
            : {
              
              },
      });
      const total = await prisma.doctorSchedules.count({
        where: whereConditions
      });
    

    return  {
        meta: {
          total,
          page,
          limit,
        },
        data: result,
      };


};

const DeleteDoctorScheduleFromDb=async(scheduleId:string,email:string)=>{

    const doctorData=await prisma.doctor.findFirstOrThrow({
        where:{
            email
        },
        select:{
            id:true
        }
    });

    const isBookedSchedule=await prisma.doctorSchedules.findUnique({
       where:{
            doctorId_scheduleId:{
            doctorId:doctorData.id,
            scheduleId
        },
        isBooked:true
       }
    });
        if(isBookedSchedule)
        {
            throw new ApiError(httpStatus.BAD_REQUEST,"This Schedule Alredy Booked","")

        }
    const deleteDoctorSchedule=await prisma.doctorSchedules.delete({
        where:{
            doctorId_scheduleId:{
                doctorId:doctorData.id,
                scheduleId
            }
        }
    });

    return deleteDoctorSchedule
}

export const DoctorScheduleService={
    CreateDoctorScheduleIntoDb,
    GetAllDoctorScheduleIntoDb,
    DeleteDoctorScheduleFromDb
}