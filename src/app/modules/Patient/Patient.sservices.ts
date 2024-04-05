import { Patient, Prisma, UserStatus } from '@prisma/client';
import { Request } from "express"
import prisma from "../../shared/prisma"
import { IPatientFilterRequest } from './Patient.Interface';
import { IPaginationOptions } from '../../Interfaces/pagination';
import calculatePagination from '../../helper/paginationHelper';
import { patientSearchableFields } from './Patient.constant';





const  GetAllPatientFromDB =async( params: IPatientFilterRequest,option: IPaginationOptions)=>{

    const {searchTerm,...filterData}=params

    const {limit,page,sortBy,orderBy,skip}=calculatePagination(option);
    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
          OR: patientSearchableFields.map(field => ({
            [field]: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          })),
        });
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
      andConditions.push({
        isDeleted: false,
      });

      const whereConditions: Prisma.PatientWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.patient.findMany({
        include: {
         medicalRepor: true,
          patientHealthData: true,
        },
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
          option.sortBy && option.orderBy
            ? { [option.sortBy]: option.orderBy }
            : {
                createdAt: 'desc',
              },
      });
      const total = await prisma.patient.count({
        where: whereConditions,
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

const GetByPatientIdFromDB = async (id: string): Promise<Patient | null> => {
    const result = await prisma.patient.findUnique({
      where: {
        id,
        isDeleted: false,
      },
      include: {
        medicalRepor: true,
        patientHealthData: true,
      },
    });
    return result;
  };

const DeletePatientIntoDb=async(id:string):Promise<Patient | null>=>{

    const result=await prisma.$transaction(async(transctionClient)=>{
        // delete medical report 
      await transctionClient.medicalRepor.deleteMany({
        where:{
            patientId:id
        }
      });
      // delete  patient health  Data 

      await transctionClient.patientHealthData.delete({
        where:{
            patientId:id
        }
      });

      // delete patient table data 

     const deletedpatientData= await transctionClient.patient.delete({
        where:{
            id
        }
      });

      await transctionClient.user.delete({
        where:{
            email:deletedpatientData.email
        }
      });
      return deletedpatientData

    });
    return result
};

const SoftPatientDeleteIntoDb = async (id: string): Promise<Patient> => {

    return await prisma.$transaction(async transactionClient => {
      const deletedPatient = await transactionClient.patient.update({
        where: { id },
        data: {
          isDeleted: true,
        },
      });
  
      await transactionClient.user.update({
        where: {
          email: deletedPatient.email,
        },
        data: {
          status: UserStatus.DELETED,
        },
      });
  
      return deletedPatient;
    });
  };


const UpdatePatientIntoDb=async(id:string,req:Request):Promise<Patient | null>=>{

    const {patientHealthData,medicalRepor,...patientData}=req.body;

    const patientInfo=await prisma.patient.findUniqueOrThrow({
        where:{
            id,
            isDeleted:false
        },
        select:{
            id:true
        }
    });

    // transaction rollback

       await prisma.$transaction(async(transactionClient)=>{

          await transactionClient.patient.update({
            // update patient data
            where:{
                id
            },
            data:patientData,
            include:{
                medicalRepor:true,
                patientHealthData:true
            }
        });

        // create or update patent health data 

       if(patientHealthData)
       {
           await transactionClient.patientHealthData.upsert({
              where:{
                patientId:patientInfo.id,
              },
              update:patientHealthData,
              create:{...patientHealthData, patientId :patientInfo.id}

        });
        
       }

       if(medicalRepor)
       {
        await transactionClient.medicalRepor.create({
            data:{ patientId :patientInfo.id,...medicalRepor}
        })
       
       }
       
    })

    return await prisma.patient.findUnique({
        where:{
            id:patientInfo.id
        },include:{
            patientHealthData:true,
            medicalRepor:true
        }
       });
}


export  const PatientService={
    UpdatePatientIntoDb,
    DeletePatientIntoDb,
    GetAllPatientFromDB,
    GetByPatientIdFromDB,
    SoftPatientDeleteIntoDb
}