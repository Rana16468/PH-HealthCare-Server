"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleWeres/auth"));
const client_1 = require("@prisma/client");
const Schedule_controller_1 = require("./Schedule.controller");
const validateRequest_1 = __importDefault(require("../../middleWeres/validateRequest"));
const Schedule_Validation_1 = require("./Schedule.Validation");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(Schedule_Validation_1.ScheduleValidation.createScheduleSchema), Schedule_controller_1.ScheduleController.CreateSchedule);
router.get('/', (0, auth_1.default)(client_1.UserRole.DOCTOR, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), Schedule_controller_1.ScheduleController.GetAllSchedule);
// task  delete Schedule
exports.ScheduleRoutes = router;
