import { Request } from "express";
import prisma from "../../shared/prisma"
import { IFile } from "../../Interfaces/file";
import { sendImageToCloudinary } from "../../utility/sendImageToCloudinary";



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
    UpdateDoctorIntoDb
}