"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleWeres/auth"));
const client_1 = require("@prisma/client");
const Patient_controller_1 = require("./Patient.controller");
const Patient_Validation_1 = require("./Patient.Validation");
const validateRequest_1 = __importDefault(require("../../middleWeres/validateRequest"));
const router = (0, express_1.default)();
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), Patient_controller_1.PatientController.GetAllPatient);
router.get("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), Patient_controller_1.PatientController.GetByPatientId);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PATIENT), (0, validateRequest_1.default)(Patient_Validation_1.PatientValidation.UpdatePatientValidationSchema), Patient_controller_1.PatientController.UpdatePatient);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), Patient_controller_1.PatientController.DeletePatient);
router.delete("/soft/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), Patient_controller_1.PatientController.SoftPatientDelete);
exports.PatientRouter = router;
