import { Prisma, PrismaClient } from "@prisma/client";
import calculatePagination from "../../helper/paginationHelper";
import prisma from "../../../shared/prisma";




const getAllFromDb=async(params:any,option:any)=>{

    const {searchTerm,...filterData}=params

const {limit,sortBy,orderBy,skip}=calculatePagination(option);




   

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
                       equals:filterData[field]
                }
            }))
        })
    }

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
     return result;
}

export const AdminService={
    getAllFromDb
}