"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = __importDefault(require("express"));
const Auth_controller_1 = require("./Auth.controller");
const auth_1 = __importDefault(require("../../middleWeres/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.default)();
router.post("/login", Auth_controller_1.AuthController.loginUser);
router.post('/refreshToken', Auth_controller_1.AuthController.refreshToken);
router.post('/chnage-password', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PATIENT, client_1.UserRole.PATIENT), Auth_controller_1.AuthController.changePassword);
router.post("/forgot-password", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PATIENT, client_1.UserRole.PATIENT), Auth_controller_1.AuthController.forgotPassword);
router.post("/reset-password", Auth_controller_1.AuthController.resetPassword);
exports.AuthRouter = router;
