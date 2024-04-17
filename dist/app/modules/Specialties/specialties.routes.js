"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialtiesRouter = void 0;
const express_1 = __importDefault(require("express"));
const specialties_controller_1 = require("./specialties.controller");
const validateRequest_1 = __importDefault(require("../../middleWeres/validateRequest"));
const Specialties_Validation_1 = require("./Specialties.Validation");
const sendImageToCloudinary_1 = require("../../utility/sendImageToCloudinary");
const auth_1 = __importDefault(require("../../middleWeres/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(client_1.UserRole.DOCTOR, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), specialties_controller_1.SpecialtiesController.GetAllSpecialties);
router.post("/", (0, auth_1.default)(client_1.UserRole.DOCTOR, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(Specialties_Validation_1.SpecialtiesValidation.createSpecialtiesValidation), specialties_controller_1.SpecialtiesController.createSpecialties);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.DOCTOR, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), specialties_controller_1.SpecialtiesController.DeleteSpecialties);
exports.SpecialtiesRouter = router;
