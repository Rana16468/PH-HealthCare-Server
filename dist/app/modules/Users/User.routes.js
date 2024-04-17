"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const User_controller_1 = require("./User.controller");
const auth_1 = __importDefault(require("../../middleWeres/auth"));
const client_1 = require("@prisma/client");
const sendImageToCloudinary_1 = require("../../utility/sendImageToCloudinary");
const validateRequest_1 = __importDefault(require("../../middleWeres/validateRequest"));
const User_Validation_1 = require("./User.Validation");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), User_controller_1.UserController.getAll);
router.get('/me', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.PATIENT, client_1.UserRole.SUPER_ADMIN), User_controller_1.UserController.getMyProfile);
router.post('/create-admin', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(User_Validation_1.userValidation.createAdminValidation), User_controller_1.UserController.createAdmin);
router.post('/create-doctor', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.doctor);
    next();
}, (0, validateRequest_1.default)(User_Validation_1.userValidation.createDoctorValidation), User_controller_1.UserController.createDoctor);
router.post('/create-patient', sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.patient);
    next();
}, (0, validateRequest_1.default)(User_Validation_1.userValidation.createPatientValidation), User_controller_1.UserController.createPatient);
router.patch("/:id/status", (0, validateRequest_1.default)(User_Validation_1.userValidation.chnageProfileStatusValidation), (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), User_controller_1.UserController.chnageProfileStatus);
router.patch("/update-my-profile", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.DOCTOR, client_1.UserRole.PATIENT), sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(User_Validation_1.userValidation.updateUserProfileValidation), User_controller_1.UserController.updateMyProfile);
exports.UserRoutes = router;
