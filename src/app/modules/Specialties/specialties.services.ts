import { Request } from "express"
import { IFile } from "../../Interfaces/file";
import { sendImageToCloudinary } from "../../utility/sendImageToCloudinary";
import prisma from "../../shared/prisma";




const createSpecialtiesIntoDb=async(req:Request)=>{

    const file=req.file as IFile
    if(file)
     {
      const {secure_url}= await sendImageToCloudinary(file.filename,file.path) as any;
      req.body.icon =secure_url;
     }

     const result=await prisma.specialties.create({
        data:req.body
     });


    return result
}

const GetAllSpecialtiesIntoDb=async()=>{

    return await prisma.specialties.findMany({});
}

const DeleteSpecialtiesIntoDb=async(id:string)=>{

       const deleteSpeciaalties=await prisma.specialties.delete({
        where:{
            id
        }
       })
    return deleteSpeciaalties
}

export const SpecialtiesService={
    createSpecialtiesIntoDb,
    GetAllSpecialtiesIntoDb,
    DeleteSpecialtiesIntoDb
}