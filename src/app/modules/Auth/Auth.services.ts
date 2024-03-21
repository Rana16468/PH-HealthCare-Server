import prisma from "../../shared/prisma"
import bcrypt from 'bcrypt';
import config from "../../config";
import { jwtHalpers } from "../../helper/jwtHelpers";
import { UserStatus } from "@prisma/client";


const loginUserFromDb=async(payload:{email:string,password:string})=>{

    const userData=await prisma.user.findUniqueOrThrow({
        where:{
            email:payload.email,
            status:UserStatus.ACTIVE
        }
    });
// secret generatot =require('crypto').randomBytes(32).toString('hex')
    const isCorrectPassword:boolean=await bcrypt.compare(payload.password,userData.password);
    if(!isCorrectPassword)
    {
        throw new Error("Password Encorred");
    }
   const accessToken=jwtHalpers.generateToken({email:userData.email,role:userData.role},config.jwt_access_srcret as string,"15m");
   const refreshToken=jwtHalpers.generateToken({email:userData.email,role:userData.role},config.jwt_refeesh_srcret as string,"30d")
   return {
    accessToken,
    needPasswordChange:userData.needPasswordChange,
    refreshToken
  }
}

const refreshToken= async(token:string)=>{

   let decodedData;
   try{
    decodedData=jwtHalpers.varifyToken(token,config.jwt_refeesh_srcret as string)
  
   }
   catch(error)
   {
    throw new Error("You Are Not Authorization");
   }

   const isUserExit=await prisma.user.findUniqueOrThrow({
    where:{
        email:decodedData.email,
        status:UserStatus.ACTIVE
    }
   });
   const accessToken=jwtHalpers.generateToken({email:isUserExit.email,role:isUserExit.role},config.jwt_access_srcret as string,"15m");
  
   return {
    accessToken,
    needPasswordChange:isUserExit.needPasswordChange
   }
}



export const AuthServices={
    loginUserFromDb,
    refreshToken
   
}