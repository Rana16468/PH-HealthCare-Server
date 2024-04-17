"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleWeres/auth"));
const client_1 = require("@prisma/client");
const Appointment_controller_1 = require("./Appointment.controller");
const validateRequest_1 = __importDefault(require("../../middleWeres/validateRequest"));
const Appointment_validation_1 = require("./Appointment.validation");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.PATIENT), (0, validateRequest_1.default)(Appointment_validation_1.AppointmentValidation.CreateAppointmentSchema), Appointment_controller_1.AppointmentController.createAppointment);
router.get("/my-appointment", (0, auth_1.default)(client_1.UserRole.DOCTOR, client_1.UserRole.PATIENT), Appointment_controller_1.AppointmentController.GetMyAppointment);
// task ----> Get All Appointment filtering --->only accesable admin and super admin
router.patch('/status/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.DOCTOR), Appointment_controller_1.AppointmentController.changeAppointmentStatus);
exports.AppointmentRouter = router;
