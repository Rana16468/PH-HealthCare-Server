import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import golobalErrorHnadelar from './app/middleWeres/golobalErrorHnadelar';
import notFounded from './app/middleWeres/notFounded';
import cookieParser  from 'cookie-parser';
import { AppointmentService } from './app/modules/Appointment/Appointment.services';
import corn from 'node-cron';

const app:Application=express();

app.use(cors({origin:"http://localhost:3000",credentials:true}));
//https://www.npmjs.com/package/cookie-parser
app.use(cookieParser())
// parser
app.use(express.json());
app.use(express.urlencoded({extended:true}));
corn.schedule('* * * * *', () => {
    try{
        AppointmentService.CancleUnpaidAppointments()
    }
    catch(error)
    {
        console.log(error);
    }
  });



app.get('/',(req:Request,res:Response)=>{

    res.send({message:"Ph-Health Care Server is Running"})


});

app.use('/api/v1',router);
app.use(golobalErrorHnadelar);
app.use("*",notFounded);


export default app;