import { RequestHandler } from "express";
import catchAsync from "../../shared/catchAsync";
import { DoctorService } from "./Doctor.services";
import sendRespone from "../../shared/sendRespone";
import httpStatus from 'http-status-codes';
import pick from "../../shared/pick";
import { doctorFilterableFields } from "./Doctor.constant";



const   getAllDoctor:RequestHandler=catchAsync(async(req,res)=>{
    const filter= pick(req.query, doctorFilterableFields);
    
    const option=pick(req.query,['page','limit','sortBy','orderBy']);
    
    // console.log(option);
    
        const result=await DoctorService.getAllDoctorFromDB(filter,option);
        sendRespone(res,{status:httpStatus.OK,success:true,message:"Get All Doctor Featch",meta: result.meta,data:result.data})

});

const getByIdDoctor:RequestHandler=catchAsync(async(req,res)=>{
    const { id } = req.params;
    const result = await DoctorService.getByIdDoctorFromDB(id);
   sendRespone(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Doctor retrieval successfully',
        data: result,
    });


});

const deleteDoctor:RequestHandler=catchAsync(async(req,res)=>{
    const { id } = req.params;
    const result = await DoctorService.deleteDoctorFromDB(id);
    sendRespone(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Doctor deleted successfully',
        data: result,
    });

});

const  softDeleteDoctor:RequestHandler=catchAsync(async(req,res)=>{

    const { id } = req.params;
    const result = await DoctorService.softDeleteDoctorFromDb(id);
    sendRespone(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Doctor soft deleted successfully',
        data: result,
    });
})
const UpdateDoctor:RequestHandler=catchAsync(async(req,res)=>{


    const result=await DoctorService.UpdateDoctorIntoDb(req.params.id,req);
    sendRespone(res,{success:true,status:httpStatus.OK,message:"Update Doctoe Successfully",data:result});
});

export const DoctorController={
    UpdateDoctor,
    getAllDoctor,
    getByIdDoctor,
    deleteDoctor,
    softDeleteDoctor
    
}