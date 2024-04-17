"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Meta_controller_1 = require("./Meta.controller");
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middleWeres/auth"));
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.DOCTOR, client_1.UserRole.PATIENT), Meta_controller_1.MetaController.fetchDashboardMetaData);
exports.MetaRoutes = router;
