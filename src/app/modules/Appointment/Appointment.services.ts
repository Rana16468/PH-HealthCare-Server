import { Prisma, UserRole } from "@prisma/client";
import { IPaginationOptions } from "../../Interfaces/pagination";
import calculatePagination from "../../helper/paginationHelper";
import prisma from "../../shared/prisma"
import { v4 as uuidv4 } from 'uuid';

const createAppointmentIntoDb=async(email:string,payload:{doctorId:string,scheduleId:string})=>{



    const patientData=await prisma.patient.findUniqueOrThrow({
        where:{
            email
        },
        select:{
            id:true
        }
    });

    const doctorData=await prisma.doctor.findUniqueOrThrow({
        where:{
            id:payload
            .doctorId
        },
        select:{
            id:true,
            appointmentFee:true
        
        }
    });

        await prisma.doctorSchedules.findFirstOrThrow({
        where:{
            doctorId:doctorData.id,
            scheduleId:payload.scheduleId,
            isBooked:false
        }

    });

    const videoCallingId=uuidv4();
     const result=await prisma.$transaction(async(transactionClient)=>{
        const appointmentData=await transactionClient.appointment.create({
            data:{
                doctorId:doctorData?.id,
                patientId:patientData.id,
                scheduleId:payload.scheduleId,
                videoCallingId
            },
            include:{
                 patient:true,
                 doctor:true,
                 schedule:true
            }
        });

          await transactionClient.doctorSchedules.update({
            where:{
                doctorId_scheduleId:{
                    doctorId:doctorData.id,
                    scheduleId:payload.scheduleId

                }

            },
            data:{
                isBooked:true,
                appointmentId:appointmentData.id
            }
        });
        //companyName,randomNumber-dateTime,
        const today=new Date();
        const  transactionId='PH-HealthCare-'+today.getFullYear()+"-"+ today.getMonth()+"-"+ today.getDay()+"-"+today.getHours()+"-"+today.getMinutes()+"-"+today.getSeconds()+"-"+today.getMilliseconds();
     
        await transactionClient.payment.create({
            data:{
                appointmentId:appointmentData.id,
                amount:doctorData.appointmentFee,
                transactionId,
              

            }
        })
        return appointmentData
     })

    return result; 
}

const GetMyAppointmentFromDB=async( user:{
    email:string,
    role:string
},filters:any,options: IPaginationOptions)=>{
    const { limit,page,sortBy,orderBy,skip} = calculatePagination(options);
    const {  ...filterData } = filters;
    const andConditions: Prisma.AppointmentWhereInput[] = [];


   if(UserRole.PATIENT===user.role)
    {
        andConditions.push({
            patient:{
                email:user.email
            }
        })
    }
    else if(UserRole.DOCTOR===user.role)
        {
            andConditions.push({
                doctor:{
                    email:user.email
                }
            })
        }
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map(key => ({
            [key]: {
                equals: (filterData as any)[key],
            },
        }));
        andConditions.push(...filterConditions);
    }

    const whereConditions: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.appointment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.orderBy
            ? { [options.sortBy]: options.orderBy }
            : { createdAt: 'desc' },
        include: UserRole.PATIENT===user.role?{
            doctor:true,
            schedule:true
        }:{patient:{
            include:{
                patientHealthData:true,
                medicalRepor:true
            }
        },schedule:true,}


    });

    const total = await prisma.appointment.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };


  

}

export const AppointmentService={
    createAppointmentIntoDb,
    GetMyAppointmentFromDB
}