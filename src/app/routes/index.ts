import express from  'express';
import { UserRoutes } from '../modules/Users/User.routes';
import { AdminRouter } from '../modules/Admin/Admin.routes';
import { AuthRouter } from '../modules/Auth/Auth.routes';
import { SpecialtiesRouter } from '../modules/Specialties/specialties.routes';
import { DoctorRouter } from '../modules/Doctor/Doctor.routes';


const router=express.Router();

const moduleRoutes=[

    {path:"/user", route:UserRoutes},
    {path:"/admin",route:AdminRouter},
    {path:"/auth",route:AuthRouter},
    {path:"/specialties",route:SpecialtiesRouter},
    {path:"/doctor",route:DoctorRouter}
    
]

moduleRoutes.forEach((route)=>router.use(route.path,route.route))

export default router;