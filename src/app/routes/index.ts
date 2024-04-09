import express from  'express';
import { UserRoutes } from '../modules/Users/User.routes';
import { AdminRouter } from '../modules/Admin/Admin.routes';
import { AuthRouter } from '../modules/Auth/Auth.routes';
import { SpecialtiesRouter } from '../modules/Specialties/specialties.routes';
import { DoctorRouter } from '../modules/Doctor/Doctor.routes';
import { PatientRouter } from '../modules/Patient/Patient.routes';
import { ScheduleRoutes } from '../modules/Schedule/Schedule.routes';
import { DoctorScheduleRouter } from '../modules/DoctorSchedule/DoctorSchedule.routes';
import { AppointmentRouter } from '../modules/Appointment/Appointment.routes';
import { PaymentRouters } from '../modules/Payment/Payment.routes';


const router=express.Router();

const moduleRoutes=[

    {path:"/user", route:UserRoutes},
    {path:"/admin",route:AdminRouter},
    {path:"/auth",route:AuthRouter},
    {path:"/specialties",route:SpecialtiesRouter},
    {path:"/doctor",route:DoctorRouter},
    {path:"/patient",route:PatientRouter},
    {path:"/schedule",route:ScheduleRoutes},
    {path:"/doctor-schedule",route:DoctorScheduleRouter},
    {path:"/appointment",route:AppointmentRouter},
    {path:"/payment",route:PaymentRouters}

    
]

moduleRoutes.forEach((route)=>router.use(route.path,route.route))

export default router;