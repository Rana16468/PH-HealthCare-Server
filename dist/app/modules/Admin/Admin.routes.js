"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRouter = void 0;
const express_1 = __importDefault(require("express"));
const Admin_controller_1 = require("./Admin.controller");
const validateRequest_1 = __importDefault(require("../../middleWeres/validateRequest"));
const Admin_validation_1 = require("./Admin.validation");
const auth_1 = __importDefault(require("../../middleWeres/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router
    .get('/', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), Admin_controller_1.AdminController.getAll);
router.get("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), Admin_controller_1.AdminController.getById);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(Admin_validation_1.AdminValidation.UpdateAdminSchema), Admin_controller_1.AdminController.update);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), Admin_controller_1.AdminController.deleted);
router.delete('/soft/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), Admin_controller_1.AdminController.softDelete);
exports.AdminRouter = router;
