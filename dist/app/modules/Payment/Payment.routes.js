"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRouters = void 0;
const express_1 = __importDefault(require("express"));
const Payment_controller_1 = require("./Payment.controller");
const router = express_1.default.Router();
router.post("/init-payment/:appointmentId", Payment_controller_1.PaymentController.InitPayment);
router.get('/ipn', Payment_controller_1.PaymentController.ValidatePayment);
exports.PaymentRouters = router;
