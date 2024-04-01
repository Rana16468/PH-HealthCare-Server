import { Admin, Prisma } from "@prisma/client";
import calculatePagination from "../../helper/paginationHelper";
import prisma from "../../shared/prisma";
import { IAdminFilterRequest } from "./Admin.interface";
import { IPaginationOptions } from "../../Interfaces/pagination";


const getAllFromDb=async(params:IAdminFilterRequest,option:IPaginationOptions)=>{

  

    const {searchTerm,...filterData}=params

const {limit,page,sortBy,orderBy,skip}=calculatePagination(option);


console.log(filterData);



   

    // SEARCH mULTIPLE FIELDS 
    /*[
                {
                    name:{
                        contains:params.searchTerm,
                        mode:"insensitive"
                    }
                },
                {
                    email:{
                        contains:params.searchTerm,
                        mode:"insensitive"
                    }
                }
            ] */

    const andCondition:Prisma.AdminWhereInput[]=[]
    if(searchTerm)
    {
        andCondition.push({
            OR:['name','email','contractNumber'].map((field)=>({
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

    andCondition.push({
        isDeleted:false
    })
    

   // console.dir(andCondition,{depth:'infinity'});

   const whereCondition:Prisma.AdminWhereInput={AND:andCondition}

     const result=await prisma.admin.findMany({
         where:whereCondition,
         skip,
         take:limit,
         orderBy: sortBy && orderBy ?{
            [sortBy]:orderBy
         }:{
            createdAt:"desc"
         }
     });

     const total=await prisma.admin.count({
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

const getbyIdFromDb=async(id:string):Promise<Admin | null>=>{
    

  const result=await prisma.admin.findUnique({
    where:{
         id,
         isDeleted:false
    }
  });
  return result;
};

const updateIntoDb=async(id:string,data:Partial<Admin>):Promise<Admin | null>=>{

 await prisma.admin.findUniqueOrThrow({
        where:{
            id,
            isDeleted:false
        }
    });
  


   const result=await prisma.admin.update({
    where:{
        id
    },
    data
   });
   return result;
}

const deleteFromDb=async(id:string):Promise<Admin | null>=>{


    await prisma.admin.findUniqueOrThrow({
        where:{
            id,
            isDeleted:false
            
        }
    })
    const result=await prisma.$transaction(async(transactionClient)=>{

       const adminDeletedData=await transactionClient.admin.delete({
        where:{
            id
        }
       });
       await transactionClient.user.delete({
        where:{
            email:adminDeletedData.email
        }
       });
       return  adminDeletedData;
       
    })
    return result
}

const softDeleteFromDb=async(id:string):Promise<Admin | null>=>{


    await prisma.admin.findUniqueOrThrow({
        where:{
            id
        }
    })
    const result=await prisma.$transaction(async(transactionClient)=>{

       const adminDeletedData=await transactionClient.admin.update({
        where:{
            id
        },
        data:{
            isDeleted:true
        }
       });
       await transactionClient.user.update({
        where:{
            email:adminDeletedData.email
        },
        data:{
            status:"DELETED"
        }
       });
       return  adminDeletedData;
       
    })
    return result
}

export const AdminService={
    getAllFromDb,
    getbyIdFromDb,
    updateIntoDb,
    deleteFromDb,
    softDeleteFromDb
}