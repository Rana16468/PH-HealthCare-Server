import {addHours, addMinutes, format} from 'date-fns';
import prisma from '../../shared/prisma';
import { Prisma, Schedule } from '@prisma/client';
import calculatePagination from '../../helper/paginationHelper';
import { IPaginationOptions } from '../../Interfaces/pagination';
import { IFilterRequest } from './Schedule.interface';



const convertDateTime=async(data:Date)=>{

  const offset=data.getTimezoneOffset() * 60000;
  return new Date(data.getTime()+offset);


}

const CreateScheduleIntoDb=async(payload:{startDate:string,endDate:string,startTime:string,endTime:string}):Promise<Schedule[]>=>{

 //https://date-fns.org/v3.6.0/docs/Getting-Started
    const {startDate,endDate,startTime,endTime}=payload;

    const currentDate=new Date(startDate);
    const endingDate=new Date(endDate);
    const intervalTime=30;
    const schedule=[];
    
    while (currentDate <= endingDate)
    {
        const startDateTime = new Date(
            addMinutes(
              addHours(
                `${format(currentDate, 'yyyy-MM-dd')}`,
                Number(startTime.split(':')[0])
              ),
              Number(startTime.split(':')[1])
            )
          );

          const endDateTime = new Date(
            addMinutes(
              addHours(
                `${format(currentDate, 'yyyy-MM-dd')}`,
                Number(endTime.split(':')[0])
              ),
              Number(endTime.split(':')[1])
            )
          );

         
        while(startDateTime<endDateTime)
        {


          const s=await convertDateTime(startDateTime);
          const a=await convertDateTime(addMinutes(startDateTime,intervalTime));

          const scheduleData={
            startDateTime:s,
            endDateTime : a
          }

          // duplicate scheduling checking 
          const existingSchedule=await prisma.schedule.findFirst({
            where:{
              startDateTime:scheduleData.startDateTime,
              endDateTime:scheduleData.endDateTime
              
            }
          });

         
        if(!existingSchedule)
          {
            const result=await prisma.schedule.create({
              data:scheduleData
            });
            schedule.push(result);
          }
          startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
            
        }
        currentDate.setDate(currentDate.getDate() +1);
    }
  


    return schedule;
};

const GetAllScheduleFromDb=async( params: IFilterRequest,option: IPaginationOptions,email:string)=>{

  const {startDate,endDate,...filterData}=params;

  

    const {limit,page,skip}=calculatePagination(option);
    const andConditions = [];

    if(startDate && endDate)
      {
        andConditions.push({
          AND:[
            {
              startDateTime:{
                gte:startDate
              }
            },
            {
              endDateTime:{
                lte:endDate
              }
            }
          ]
        })
      }

    

      if (Object.keys(filterData).length > 0) {
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
   

      const whereConditions: Prisma.ScheduleWhereInput=
    andConditions.length > 0 ? { AND: andConditions } : {};

    // total Schedule - selected schedule 

    const doctorSchedule=await prisma.doctorSchedules.findMany({
      where:{
        doctor:{
          email
        }
      },
      select:{
        scheduleId:true
      }
    });
   const doctorScheduleIds=doctorSchedule?.map((scheduleId)=>scheduleId.scheduleId);
   
    const result = await prisma.schedule.findMany({
        
        where: {
          ...whereConditions,
          id:{
            notIn:doctorScheduleIds
          }
        },
        skip,
        take: limit,
        orderBy:
          option.sortBy && option.orderBy
            ? { [option.sortBy]: option.orderBy }
            : {
                createdAt: 'desc',
              },
      });
      const total = await prisma.schedule.count({
        where: {
          ...whereConditions,
          id:{
            notIn:doctorScheduleIds
          }
        },
      });
    

    return  {
        meta: {
          total,
          page,
          limit,
        },
        data: result,
      };
}

const GetByIdFromDB = async (id: string): Promise<Schedule | null> => {
  const result = await prisma.schedule.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const GetDeleteFromDB = async (id: string): Promise<Schedule> => {
  const result = await prisma.schedule.delete({
    where: {
      id,
    },
  });
  return result;
};

export const ScheduleService={
    CreateScheduleIntoDb,
    GetAllScheduleFromDb,
    GetByIdFromDB,
    GetDeleteFromDB
}