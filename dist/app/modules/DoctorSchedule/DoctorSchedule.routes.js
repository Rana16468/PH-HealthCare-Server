"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorScheduleRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleWeres/auth"));
const DoctorSchedule_controller_1 = require("./DoctorSchedule.controller");
const validateRequest_1 = __importDefault(require("../../middleWeres/validateRequest"));
const DoctorSchedule_Validation_1 = require("./DoctorSchedule.Validation");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.DOCTOR), (0, validateRequest_1.default)(DoctorSchedule_Validation_1.DoctorScheduleValidation.createDoctorScheduleSchema), DoctorSchedule_controller_1.DoctorScheduleController.CreateDoctorSchedule);
// task get with Id Doctor Schedule 
// task get all doctor schedule
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.DOCTOR, client_1.UserRole.SUPER_ADMIN), DoctorSchedule_controller_1.DoctorScheduleController.GetAllDoctorSchedule);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.DOCTOR), DoctorSchedule_controller_1.DoctorScheduleController.DeleteDoctorSchedule);
exports.DoctorScheduleRouter = router;
