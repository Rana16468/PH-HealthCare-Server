import prisma from "../../shared/prisma"
import bcrypt from 'bcrypt';
import config from "../../config";
import { jwtHalpers } from "../../helper/jwtHelpers";
import { UserStatus } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import httpStatus from 'http-status-codes';
import { sendEmail } from "../../utility/sendEmail";
import { Secret } from "jsonwebtoken";



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
   const accessToken=jwtHalpers.generateToken({email:userData.email,role:userData.role},config.jwt_access_srcret as string,config.token_expire_in as string);
   const refreshToken=jwtHalpers.generateToken({email:userData.email,role:userData.role},config.jwt_refeesh_srcret as string,config.refresh_token_expire_in as string);
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
   const accessToken=jwtHalpers.generateToken({email:isUserExit.email,role:isUserExit.role},config.jwt_access_srcret as string, config.token_expire_in as string);
  
   return {
    accessToken,
    needPasswordChange:isUserExit.needPasswordChange
   }
}

const changePasswordIntoDb=async(user:any,payload:{newPassword:string,oldPassword:string})=>{


    const userData=await prisma.user.findUniqueOrThrow({
        where:{
            email:user.email,
            status:UserStatus.ACTIVE
        }
    })
    const isCorrectPassword:boolean=await bcrypt.compare(payload.oldPassword,userData.password);
    if(!isCorrectPassword)
    {
        throw new ApiError(httpStatus.FORBIDDEN,"Password Encorred","");
    }
    const hashedPassword:string= await bcrypt.hash(payload.newPassword,Number(config.bcrypt_salt_rounds));
   
    await prisma.user.update({
        where:{
            email:user.email
        },
        data:{
            password:hashedPassword,
            needPasswordChange:false
        }
    })
    
    return "passwoed change Successfully"

}

const forgotPassword=async(payload:{email:string})=>{

    const userData=await prisma.user.findUniqueOrThrow({
        where:{
            email:payload.email,
            status:UserStatus.ACTIVE
        }
    });

   
    const resetPasswordToken=jwtHalpers.generateToken({email:userData?.email,role:userData?.role},config.jwt_reset_srcret as string,config.reset_token_expire_in as string);
   // console.log(resetPasswordToken);
    const resetPasswordLink=config.reset_password_link+`?id=${userData?.id}&token=${resetPasswordToken}`;
     await sendEmail(userData?.email,`
     <div>
     <p> Dear User</p>
     <p>Your Password Reset Link</p>
     <a href=${resetPasswordLink}>
      <button>Reset Password</button>
     </a>
     </div>`);

return "Checked You Email";
}
const resetPassword=async(token:string,payload:{id:string,password:string})=>{

    const userData=await prisma.user.findUniqueOrThrow({
        where:{
            id:payload.id,
            status:UserStatus.ACTIVE
        }
    });

    const isValidateToken=jwtHalpers.varifyToken(token,config.jwt_reset_srcret as Secret);

    if(!isValidateToken)
    {
        throw new ApiError(httpStatus.FORBIDDEN,"Token is Expire","")
    }
    //hash password

    const hashedPassword= await bcrypt.hash(payload.password,Number(config.bcrypt_salt_rounds));
    // update password
    await prisma.user.update({
        where:{
            email:isValidateToken?.email

        },
        data:{
            password:hashedPassword,
            needPasswordChange:false
        }
    })
    

    return "reset password update successfully"

}


export const AuthServices={
    loginUserFromDb,
    refreshToken,
    changePasswordIntoDb,
    forgotPassword,
    resetPassword
   
}