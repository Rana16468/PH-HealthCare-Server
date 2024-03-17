import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { UserRoutes } from './app/modules/Users/User.routes';
import { AdminRouter } from './app/modules/Admin/Admin.routes';


const app:Application=express();

app.use(cors());
// parser
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req:Request,res:Response)=>{

    res.send({message:"Ph-Health Care Server is Running"})


});

app.use('/api/v1/user',UserRoutes);
app.use('/api/v1/admin',AdminRouter);

export default app;