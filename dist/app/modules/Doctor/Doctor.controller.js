"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const Doctor_services_1 = require("./Doctor.services");
const sendRespone_1 = __importDefault(require("../../shared/sendRespone"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const pick_1 = __importDefault(require("../../shared/pick"));
const Doctor_constant_1 = require("./Doctor.constant");
const getAllDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.default)(req.query, Doctor_constant_1.doctorFilterableFields);
    const option = (0, pick_1.default)(req.query, ['page', 'limit', 'sortBy', 'orderBy']);
    // console.log(option);
    const result = yield Doctor_services_1.DoctorService.getAllDoctorFromDB(filter, option);
    (0, sendRespone_1.default)(res, { status: http_status_codes_1.default.OK, success: true, message: "Get All Doctor Featch", meta: result.meta, data: result.data });
}));
const getByIdDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield Doctor_services_1.DoctorService.getByIdDoctorFromDB(id);
    (0, sendRespone_1.default)(res, {
        status: http_status_codes_1.default.OK,
        success: true,
        message: 'Doctor retrieval successfully',
        data: result,
    });
}));
const deleteDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield Doctor_services_1.DoctorService.deleteDoctorFromDB(id);
    (0, sendRespone_1.default)(res, {
        status: http_status_codes_1.default.OK,
        success: true,
        message: 'Doctor deleted successfully',
        data: result,
    });
}));
const softDeleteDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield Doctor_services_1.DoctorService.softDeleteDoctorFromDb(id);
    (0, sendRespone_1.default)(res, {
        status: http_status_codes_1.default.OK,
        success: true,
        message: 'Doctor soft deleted successfully',
        data: result,
    });
}));
const UpdateDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Doctor_services_1.DoctorService.UpdateDoctorIntoDb(req.params.id, req);
    (0, sendRespone_1.default)(res, { success: true, status: http_status_codes_1.default.OK, message: "Update Doctoe Successfully", data: result });
}));
exports.DoctorController = {
    UpdateDoctor,
    getAllDoctor,
    getByIdDoctor,
    deleteDoctor,
    softDeleteDoctor
};
