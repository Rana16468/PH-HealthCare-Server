import { Request } from "express";
import prisma from "../../shared/prisma"
import { IFile } from "../../Interfaces/file";
import { sendImageToCloudinary } from "../../utility/sendImageToCloudinary";
import { IDoctorFilterRequest } from "./Doctor.interface";
import { IPaginationOptions } from "../../Interfaces/pagination";
import calculatePagination from "../../helper/paginationHelper";
import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { doctorSearchableFields } from "./Doctor.constant";


const  getAllDoctorFromDB=async(filters: IDoctorFilterRequest,options: IPaginationOptions)=>{

    const { limit,page,sortBy,orderBy,skip} = calculatePagination(options);
    const { searchTerm, specialties, ...filterData } = filters;

   

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }

    // doctor >  doctorSpecialties > specialties table

    if (specialties && specialties.length > 0) {
        // Corrected specialties condition
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialties: {
                        title: {
                            contains: specialties,
                            mode: 'insensitive',
                        },
                    },
                },
            },
        });
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map(key => ({
            [key]: {
                equals: (filterData as any)[key],
            },
        }));
        andConditions.push(...filterConditions);
    }

    andConditions.push({
        isDeleted: false,
    });

    const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.orderBy
            ? { [options.sortBy]: options.orderBy }
            : { averageRating: 'desc' },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        },
    });

    const total = await prisma.doctor.count({
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


const getByIdDoctorFromDB = async (id: string): Promise<Doctor | null> => {
    const result = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            doctorSpecialties: {
                include: {
                   specialties: true
                }
            }
        }
    });
    return result;
};

const deleteDoctorFromDB = async (id: string): Promise<Doctor> => {
    return await prisma.$transaction(async transactionClient => {
        const deleteDoctor = await transactionClient.doctor.delete({
            where: {
                id,
            },
        });

        await transactionClient.user.delete({
            where: {
                email: deleteDoctor.email,
            },
        });

        return deleteDoctor;
    });
};

const softDeleteDoctorFromDb = async (id: string): Promise<Doctor> => {
    return await prisma.$transaction(async transactionClient => {
        const deleteDoctor = await transactionClient.doctor.update({
            where: { id },
            data: {
                isDeleted: true,
            },
        });

        await transactionClient.user.update({
            where: {
                email: deleteDoctor.email,
            },
            data: {
                status:UserStatus.DELETED,
            },
        });

        return deleteDoctor;
    });
};





const UpdateDoctorIntoDb=async(id:string,req:Request)=>{

   const doctorInfo= await prisma.doctor.findUniqueOrThrow({
        where:{
            id
        }
    });

    const {specialties,...doctorData}=req.body;
  const file=req.file as IFile
    if(file)
     {
      const {secure_url}= await sendImageToCloudinary(file.filename,file.path) as any;
      doctorData.profilePhoto =secure_url;
     }


     await prisma.$transaction(async(transactionClient)=>{

        await transactionClient.doctor.update({
            where:{
                id
            },
            data:doctorData,
            include:{
                doctorSpecialties:true
            }
        })

      if(specialties && specialties.length>0)
      {
        // delete specialties
        const deleteSpecialties=specialties.filter((speciality:{ specialitiesId:string,isDeleted:boolean})=>speciality.isDeleted);
        const createSpecialties=specialties.filter((speciality:{ specialitiesId:string,isDeleted:boolean})=>!speciality.isDeleted);
        for (var specialtiy of deleteSpecialties)
        {
            await transactionClient.doctorSpecialties.deleteMany({
                where:{
                    doctorId: doctorInfo.id,
                    specialitiesId:specialtiy.specialitiesId,
                }

            }) 
        }
        // create specialties
        
        for (var specialtiy of createSpecialties)
        {
            await transactionClient.doctorSpecialties.create({
                data:{
                    doctorId: doctorInfo.id,
                    specialitiesId:specialtiy.specialitiesId,
                }

            }) 
        }


       
     }
    
     });
     
     


     const result = await prisma.doctor.findUnique({
        where: {
            id: doctorInfo.id
        },
        include: {
            doctorSpecialties: {
                include: {
                   specialties:true
                }
            }
        }
    })
    return result;
}

export const DoctorService={
    UpdateDoctorIntoDb,
    getAllDoctorFromDB,
    getByIdDoctorFromDB,
    deleteDoctorFromDB,
    softDeleteDoctorFromDb
}