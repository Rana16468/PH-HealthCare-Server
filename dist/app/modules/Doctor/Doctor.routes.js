"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleWeres/auth"));
const client_1 = require("@prisma/client");
const Doctor_controller_1 = require("./Doctor.controller");
const sendImageToCloudinary_1 = require("../../utility/sendImageToCloudinary");
const validateRequest_1 = __importDefault(require("../../middleWeres/validateRequest"));
const Doctor_Validation_1 = require("./Doctor.Validation");
const router = express_1.default.Router();
// get all doctor router
router.get('/', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), Doctor_controller_1.DoctorController.getAllDoctor);
// get specific id
router.get("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), Doctor_controller_1.DoctorController.getByIdDoctor);
// delete doctor
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), Doctor_controller_1.DoctorController.deleteDoctor);
// soft delete by the doctor
router.delete('/soft/:id', (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), Doctor_controller_1.DoctorController.softDeleteDoctor);
// update router
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.DOCTOR, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(Doctor_Validation_1.DoctorValidation.UpdateDoctorValidation), Doctor_controller_1.DoctorController.UpdateDoctor);
exports.DoctorRouter = router;
