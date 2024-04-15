import { AppointmentStatus, PaymentStatus, Prisma, UserRole } from "@prisma/client";
import { IPaginationOptions } from "../../Interfaces/pagination";
import calculatePagination from "../../helper/paginationHelper";
import prisma from "../../shared/prisma"
import { v4 as uuidv4 } from 'uuid';
import ApiError from "../../errors/ApiError";
import httpStatus from 'http-status-codes';
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

const changeAppointmentStatusFromDb=async(appointmentId:string,status:AppointmentStatus,user:{
    role:string,
    email:string
})=>{

    const appointmentData= await prisma.appointment.findUniqueOrThrow({
        where:{
            id:appointmentId
        
        },
       include:{
        doctor:true
       }
    });
   

    if(user.role===UserRole.DOCTOR )
    {
        if(!(user.email===appointmentData.doctor.email))
        {
            throw new ApiError(httpStatus.BAD_REQUEST,"This Not Your Appointment","");

        }
    }
    const result=await prisma.appointment.update({
        where:{
            id:appointmentData.id
        },
        data:{
            status
        }
    })

    return result
}

/*SCHEDULED
INPROGRESS
COMPLETED
CANCELED */

const CancleUnpaidAppointments=async()=>{

    const thirtyMinAgo=new Date(Date.now()-30*60*1000);
    const unPaidAppointment=await prisma.appointment.findMany({
        where:{
            createdAt:{
                lte:thirtyMinAgo
            },
            paymentStatus:PaymentStatus.UNPAID
        }
    });
    const unPaidAppointmentToCancel=unPaidAppointment?.map((appointment)=>appointment.id)
    await prisma.$transaction(async(tx)=>{

        await tx.payment.deleteMany({
            where:{
                appointmentId:{
                    in:unPaidAppointmentToCancel
                }
            }
        });
        await tx.appointment.deleteMany({
            where:{
                id:{
                    in:unPaidAppointmentToCancel
                }
            }
        });

        for(const unPaidAppoint  of unPaidAppointment)
            {
                await tx.doctorSchedules.updateMany({
                    where:{
                       doctorId:unPaidAppoint.doctorId,
                       scheduleId:unPaidAppoint.scheduleId

                    },
                    data:{
                        isBooked:false
                    }
                });
            }
    
       

    });
  
}

export const AppointmentService={
    createAppointmentIntoDb,
    GetMyAppointmentFromDB,
    changeAppointmentStatusFromDb,
    CancleUnpaidAppointments
}