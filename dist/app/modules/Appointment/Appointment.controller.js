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
exports.AppointmentController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const Appointment_services_1 = require("./Appointment.services");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendRespone_1 = __importDefault(require("../../shared/sendRespone"));
const pick_1 = __importDefault(require("../../shared/pick"));
const createAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Appointment_services_1.AppointmentService.createAppointmentIntoDb(req.user.email, req.body);
    (0, sendRespone_1.default)(res, { success: true, status: http_status_codes_1.default.CREATED, message: "Create Appointment Successfully", data: result });
}));
const GetMyAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, role } = req.user;
    const filter = (0, pick_1.default)(req.query, ['status', 'paymentStatus']);
    const option = (0, pick_1.default)(req.query, ['page', 'limit', 'sortBy', 'orderBy']);
    const result = yield Appointment_services_1.AppointmentService.GetMyAppointmentFromDB({ email, role }, filter, option);
    (0, sendRespone_1.default)(res, { success: true, status: http_status_codes_1.default.OK, message: "Successfully Get My Appointment", meta: result.meta, data: result.data });
}));
const changeAppointmentStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    const { role, email } = req.user;
    const result = yield Appointment_services_1.AppointmentService.changeAppointmentStatusFromDb(id, status, { role, email });
    (0, sendRespone_1.default)(res, { success: true, status: http_status_codes_1.default.OK, message: "Chnage Appoint Status Successfully", data: result });
}));
exports.AppointmentController = {
    createAppointment,
    GetMyAppointment,
    changeAppointmentStatus
};
