"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const Payment_services_1 = require("./Payment.services");
const sendRespone_1 = __importDefault(require("../../shared/sendRespone"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const InitPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { appointmentId } = req.params;
    const result = yield Payment_services_1.PaymentService.InitPaymentIntoSSL(appointmentId);
    (0, sendRespone_1.default)(res, { success: true, status: http_status_codes_1.default.OK, message: "Payment Initilasation Successfully", data: result });
}));
const ValidatePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Payment_services_1.PaymentService.ValidatePaymentIntoSSL(req);
    (0, sendRespone_1.default)(res, { success: true, status: http_status_codes_1.default.OK, message: "Success Validate", data: result });
}));
exports.PaymentController = {
    InitPayment,
    ValidatePayment
};
