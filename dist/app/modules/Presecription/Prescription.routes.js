"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const Prescription_controller_1 = require("./Prescription.controller");
const auth_1 = __importDefault(require("../../middleWeres/auth"));
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.DOCTOR), Prescription_controller_1.PrescriptionController.CreatePrescription);
router.get("/my-prescription", (0, auth_1.default)(client_1.UserRole.PATIENT), Prescription_controller_1.PrescriptionController.PatientPrescription);
exports.PrescriptionRouter = router;
