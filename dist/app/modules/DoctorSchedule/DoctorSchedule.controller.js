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
exports.DoctorScheduleController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const DoctorSchedule_service_s_1 = require("./DoctorSchedule.service.s");
const sendRespone_1 = __importDefault(require("../../shared/sendRespone"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const pick_1 = __importDefault(require("../../shared/pick"));
const DoctorSchedule_constant_1 = require("./DoctorSchedule.constant");
const CreateDoctorSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield DoctorSchedule_service_s_1.DoctorScheduleService.CreateDoctorScheduleIntoDb(req);
    (0, sendRespone_1.default)(res, { success: true, status: http_status_codes_1.default.CREATED, message: "Successfuly Created Doctor Schedule", data: result });
}));
const GetAllDoctorSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.default)(req.query, DoctorSchedule_constant_1.doctorScheduleFilterableFields);
    const option = (0, pick_1.default)(req.query, ['page', 'limit', 'sortBy', 'orderBy']);
    const result = yield DoctorSchedule_service_s_1.DoctorScheduleService.GetAllDoctorScheduleIntoDb(filter, option, req.user.email);
    (0, sendRespone_1.default)(res, { success: true, status: http_status_codes_1.default.OK, message: "Successfuly Get Doctor Schedule", data: result });
}));
const DeleteDoctorSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield DoctorSchedule_service_s_1.DoctorScheduleService.DeleteDoctorScheduleFromDb(req.params.id, req.user.email);
    (0, sendRespone_1.default)(res, { success: true, status: http_status_codes_1.default.OK, message: "Successfuly Deelete Doctor Schedule", data: result });
}));
exports.DoctorScheduleController = {
    CreateDoctorSchedule,
    GetAllDoctorSchedule,
    DeleteDoctorSchedule
};
