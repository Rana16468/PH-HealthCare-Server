import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import golobalErrorHnadelar from './app/middleWeres/golobalErrorHnadelar';
import notFounded from './app/middleWeres/notFounded';



const app:Application=express();

app.use(cors());
// parser
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req:Request,res:Response)=>{

    res.send({message:"Ph-Health Care Server is Running"})


});

app.use('/api/v1',router);
app.use(golobalErrorHnadelar);
app.use("*",notFounded);


export default app;