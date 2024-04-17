import { PaymentStatus, UserRole } from "@prisma/client"
import ApiError from "../../errors/ApiError";
import httpStatus from 'http-status-codes';
import prisma from "../../shared/prisma";


const fetchDashboardMetaData=async(user:{email:string,role:string})=>{
let metaData;

    switch(user.role)
    {
        case UserRole.SUPER_ADMIN : {
           metaData= getSuperAdminMetaData(); break;
        }
        case UserRole.ADMIN :{
            metaData= getAdminMetaData();break;
        }
        case UserRole.DOCTOR:{
            metaData= getDoctorMetaData(user);break;
        }
        case UserRole.PATIENT:{
            metaData= getPatientMetaData(user);break;
        }
        default : throw new ApiError(httpStatus.BAD_REQUEST,"Default Requets","");
    }
   
 return  metaData
}

const getSuperAdminMetaData=async()=>{

    const appointmentCount=await prisma.appointment.count();
    const patientCount=await prisma.appointment.count();
    const doctorCount=await prisma.doctor.count();
    const paymentCount=await prisma.payment.count();
    const adminCount=await prisma.admin.count();

    const totalRevinue=await prisma.payment.aggregate({
        _sum:{
            amount:true
        },
        where:{
            paymentStatus:PaymentStatus.PAID
        }
    })
   const barChartData= await getBarCharData();
   const pieChartData=await getPieChartData();
   return {
        appointmentCount,
        patientCount,
        doctorCount,
        paymentCount,
        totalRevinue,
        adminCount,
        barChartData,
        pieChartData
        
    }


}

const getAdminMetaData=async()=>{
    

    const appointmentCount=await prisma.appointment.count();
    const patientCount=await prisma.appointment.count();
    const doctorCount=await prisma.doctor.count();
    const paymentCount=await prisma.payment.count();

    const totalRevinue=await prisma.payment.aggregate({
        _sum:{
            amount:true
        },
        where:{
            paymentStatus:PaymentStatus.PAID
        }
    });

    const barChartData= await getBarCharData();
    const pieChartData=await getPieChartData();

 return {
    appointmentCount,
    patientCount,
    doctorCount,
    paymentCount,
    totalRevinue,
    barChartData,
    pieChartData
}
    
}

const getDoctorMetaData=async(user:{email:string,role:string})=>{

   const doctorData=await prisma.doctor.findUniqueOrThrow({
    where:{
        email:user?.email
    }
   });
  const appointmentCount=await prisma.appointment.count({
    where:{
        doctorId:doctorData.id
    }
  });

  const patientCount=await prisma.appointment.groupBy({
    by:['patientId'],
    _count:{
        id:true
    }
   
  });

  const reviewCount=await prisma.review.count({
    where:{
        doctorId:doctorData.id
    }
  });

  const totalRevenue=await prisma.payment.aggregate({
    _sum:{
        amount:true

    },
    where:{
        appointment:{
            doctorId:doctorData.id
        },
        paymentStatus:PaymentStatus.PAID
    }
  });

  const appointmentStatusDistribution=await prisma.appointment.groupBy({
    by:['status'],
    _count:{
      id:true
    },
    where:{
        doctorId:doctorData.id,
        
    },
    

  });

  const formatedAppointmentStatusDistribution=appointmentStatusDistribution?.map((count)=>({

    status:count.status,
    count:Number(count._count.id)
  }));

  return {
    patientCount:patientCount.length,
    reviewCount,
    totalRevenue,
    formatedAppointmentStatusDistribution,
    appointmentCount
  }
  
}
const getPatientMetaData=async(user:{email:string,role:string})=>{

    const patientData=await prisma.patient.findUniqueOrThrow({
        where:{
            email:user?.email
        }
       });
      const appointmentCount=await prisma.appointment.count({
        where:{
            patientId:patientData.id
        }
      });
    
      const prescriptionCount=await prisma.prescription.count({
        where:{
            patientId:patientData.id
        }
      });
    
      const reviewCount=await prisma.review.count({
        where:{
            patientId:patientData.id
        }
      });
    
    
    
      const appointmentStatusDistribution=await prisma.appointment.groupBy({
        by:['status'],
        _count:{
          id:true
        },
        where:{
            patientId:patientData.id
        }
    
      });
    
      const formatedAppointmentStatusDistribution=appointmentStatusDistribution?.map((count)=>({
    
        status:count.status,
        count:Number(count._count.id)
      }));
     
      return {
        appointmentCount,
        prescriptionCount,
        reviewCount,
        formatedAppointmentStatusDistribution

      }


     
}
const getBarCharData=async()=>{

  

  const appoinmentCountByMonth:{month:Date,count:bigint} []=await prisma.$queryRaw `SELECT DATE_TRUNC('month',"createdAt") as month, CAST(COUNT(*) AS INTEGER) as count FROM "appointments" GROUP BY month ORDER BY month ASC`
 return appoinmentCountByMonth
}

const getPieChartData=async()=>{

  const appointmentStatusDistribution=await prisma.appointment.groupBy({
    by:['status'],
    _count:{
      id:true
    }
    
    

  });

  const formatedAppointmentStatusDistribution=appointmentStatusDistribution?.map((count)=>({

    status:count.status,
    count:Number(count._count.id)
  }));
  return formatedAppointmentStatusDistribution

}
export const MetaService={
    fetchDashboardMetaData,
  
}