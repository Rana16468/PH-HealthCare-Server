import { Admin, Doctor, Patient, Prisma, PrismaClient, UserRole, UserStatus } from "@prisma/client";
import bcrypt from 'bcrypt';
import config from "../../config";

import { sendImageToCloudinary } from "../../utility/sendImageToCloudinary";
import { IFile } from "../../Interfaces/file";
import { IPaginationOptions } from "../../Interfaces/pagination";
import calculatePagination from "../../helper/paginationHelper";
import { userSearchAbleField } from "./User.constant";
import { JwtHeader } from "jsonwebtoken";
import { Request } from "express";
import { IAuthUser } from "../../Interfaces/common";
const prisma=new PrismaClient();

const createAdminFromDb=async(req:Request):Promise<Admin>=>{
   const file=req.file as IFile
  if(file)
  {
   const {secure_url}= await sendImageToCloudinary(file.filename,file.path) as any;
   req.body.admin.profilePhoto =secure_url
  }

    const hashedPassword:string= await bcrypt.hash(req.body.password,Number(config.bcrypt_salt_rounds));

    const userData={
        email:req.body.admin.email,
        password:hashedPassword,
        role:UserRole.ADMIN

    }

   const result=await prisma.$transaction(async(transactionClient)=>{
    await transactionClient.user.create({
        data:userData
    });

    const createdAdminData=await transactionClient.admin.create({
        data:req.body.admin
    });
    return createdAdminData;
   })

    return result;
}

const createDoctorFromDb=async(req:Request):Promise<Doctor>=>{

    // console.log(req.body);
    // console.log(req.file);
    const file=req.file as IFile
    if(file)
  {
   const {secure_url}= await sendImageToCloudinary(file.filename,file.path) as any;
   req.body.doctor.profilePhoto =secure_url;
  }
  const hashedPassword:string= await bcrypt.hash(req.body.password,Number(config.bcrypt_salt_rounds));
  const userData={
    email:req.body.doctor.email,
    password:hashedPassword,
    role:UserRole.DOCTOR

}

const result=await prisma.$transaction(async(transactionClient)=>{
    await transactionClient.user.create({
        data:userData
    });

    const createdDoctorData=await transactionClient.doctor.create({
        data:req.body.doctor
    });
    return createdDoctorData;
   })

    return result;
}

const createPatientIntoDb=async(req:Request)=>{

    

   // console.log(req.body);
    //console.log(req.file);

 const file=req.file as IFile
 if(file)
  {
   const {secure_url}= await sendImageToCloudinary(file.filename,file.path) as any;
   req.body.patient.profilePhoto =secure_url;
  }
  const hashedPassword:string= await bcrypt.hash(req.body.password,Number(config.bcrypt_salt_rounds));
  const userData={
    email:req.body.patient.email,
    password:hashedPassword,
    role:UserRole.PATIENT
} 
 const result=await prisma.$transaction(async(transactionClient)=>{
   
    await transactionClient.user.create({
        data:userData
    });

    const createdDoctorData=await transactionClient.patient.create({
        data:req.body.patient
    });
    return createdDoctorData;
   })

    return result;

}


const getAllFromDb=async(params:any,option:IPaginationOptions)=>{

  
    const {searchTerm,...filterData}=params

const {limit,page,sortBy,orderBy,skip}=calculatePagination(option);

    const andCondition:Prisma.UserWhereInput[]=[]
    if(searchTerm)
    {
        andCondition.push({
            OR:userSearchAbleField.map((field)=>({
                [field]:{
                    contains:searchTerm,
                    mode:"insensitive"
                }

            }))
        })
    }
    if(Object.keys(filterData).length>0)
    {
        andCondition.push({
            AND:Object.keys(filterData).map((field)=>({
                [field]:{
                       equals:(filterData as any)[field]
                }
            }))
        })
    }

   
    

   // console.dir(andCondition,{depth:'infinity'});

   const whereCondition:Prisma.UserWhereInput={AND:andCondition}

     const result=await prisma.user.findMany({
         where:whereCondition,
         skip,
         take:limit,
         orderBy: sortBy && orderBy ?{
            [sortBy]:orderBy
         }:{
            createdAt:"desc"
         },
         select:{
            id:true,
            role:true,
            status:true,
            email:true,
            needPasswordChange:true,
            createdAt:true,
            updatedAt:true,
            admin:true,
            doctor:true
         }
         /*,include:{
            admin:true,
            doctor:true
         } */
     });

     const total=await prisma.user.count({
        where:whereCondition
     });
     return {
        meta:{
            page,
            limit,
            total
            
        },
        data:result
     };
}



const chnageProfileStatusFromDb=async(id:string,data:{status:UserStatus})=>{

    const userData=await prisma.user.findUniqueOrThrow({
        where:{
            id
        }
    });

    const updateUserStatus=await prisma.user.update({
        where:{
            id:userData.id
           
        },
        data:{
            status:data.status
        }
    });
    return updateUserStatus
}

const getMyProfileIntoDb=async(user:any)=>{

  const userInfo=await prisma.user.findUniqueOrThrow({
    where:{
        email:user?.email,
        status:UserStatus.ACTIVE
    },
    select:{
        id:true,
        email:true,
        needPasswordChange:true,
        role:true,
        status:true
        
    }
  });
  let profileInfo;
  if(userInfo.role===UserRole.ADMIN)
  {
    profileInfo=await prisma.admin.findUniqueOrThrow({
        where:{
            email:userInfo.email
        }
        
    });

  }
  else if(userInfo.role===UserRole.DOCTOR)
  {
    profileInfo=await prisma.doctor.findUniqueOrThrow({
        where:{
            email:userInfo.email
        }
    });

  }
  else if(userInfo.role===UserRole.PATIENT)
  {
    profileInfo=await prisma.user.findUniqueOrThrow({
        where:{
            email:userInfo.email,
           
        },
        select:{
            id:true,
            email:true,
            needPasswordChange:true,
            role:true,
            status:true

            
        }
    });
    
  }
  else{
    profileInfo=await prisma.admin.findUniqueOrThrow({
        where:{
            email:userInfo.email
        }
    });
  }
    return {...userInfo,...profileInfo}

}

const updateMyProfileIntoDb=async(user:any,req:Request,)=>{

    const userInfo=await prisma.user.findUniqueOrThrow({
        where:{
            email:user?.email,
            status:UserStatus.ACTIVE
        }
    });

    
    const file=req.file as IFile
    if(file)
     {
      const {secure_url}= await sendImageToCloudinary(file.filename,file.path) as any;
      req.body.profilePhoto =secure_url;
     }

    let updateProfile;
    if(userInfo.role===UserRole.ADMIN)
    {
     updateProfile=await prisma.admin.update({
          where:{
              email:userInfo.email
          },
          data:req.body
      });
  
    }
    else if(userInfo.role===UserRole.DOCTOR)
    {
        updateProfile=await prisma.doctor.update({
          where:{
              email:userInfo.email
          },
          data:req.body
      });
  
    }
    else if(userInfo.role===UserRole.PATIENT)
    {
        updateProfile=await prisma.user.update({
          where:{
              email:userInfo.email,
             
          },
          data:req.body
      });
      
    }
    else{
        updateProfile=await prisma.admin.update({
          where:{
              email:userInfo.email
          },
          data:req.body
      });
    }

    return updateProfile
}

export const UserService={
    createAdminFromDb,
    createDoctorFromDb,
    createPatientIntoDb,
    getAllFromDb,
    chnageProfileStatusFromDb,
    getMyProfileIntoDb,
    updateMyProfileIntoDb
}