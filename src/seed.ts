import { UserRole } from "@prisma/client";
import prisma from "../src/app/shared/prisma";
import bcrypt from 'bcrypt';
import config from "./app/config";

const seedSuperAdmin=async()=>{

    try{


        const isExistSuperAdmin=await prisma.user.findFirst({
            where:{
                role:UserRole.SUPER_ADMIN
            }
        });
        if(isExistSuperAdmin)
            {
                console.log("Super Admin Exist");
                return;
            }
            const hashedPassword:string= await bcrypt.hash("123456",Number(config.bcrypt_salt_rounds));
   
            await prisma.user.create({
                data:{
                    email:"super@admin.com",
                    password:hashedPassword,
                    role:UserRole.SUPER_ADMIN,
                    admin:{
                        create:{
                            name:"Super Admin",
                            contractNumber:"01722305054",
                           

                            
                        }
                    }
                }
            });
            console.log("Super Admin Created Successfully")
    }
    catch(error)
    {
        console.log(error);
    }
    finally{
        await prisma.$disconnect();
    }
}
seedSuperAdmin()