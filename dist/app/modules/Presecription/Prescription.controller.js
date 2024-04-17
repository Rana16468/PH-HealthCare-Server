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
exports.PrescriptionController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const Prescription_services_1 = require("./Prescription.services");
const sendRespone_1 = __importDefault(require("../../shared/sendRespone"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const pick_1 = __importDefault(require("../../shared/pick"));
const CreatePrescription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, role } = req.user;
    const result = yield Prescription_services_1.PresecriptionServices.CreatePrescriptionIntoDb({ email, role }, req.body);
    (0, sendRespone_1.default)(res, { success: true, status: http_status_codes_1.default.CREATED, message: "Successfully Created Prescription", data: result });
}));
const PatientPrescription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const option = (0, pick_1.default)(req.query, ['page', 'limit', 'sortBy', 'orderBy']);
    const { email, role } = req.user;
    const result = yield Prescription_services_1.PresecriptionServices.PatientPrescriptionFromDb({ email, role }, option);
    (0, sendRespone_1.default)(res, { success: true, status: http_status_codes_1.default.CREATED, message: "Successfully Rectrive Patient Prescription", meta: result.meta, data: result.data });
}));
exports.PrescriptionController = {
    CreatePrescription,
    PatientPrescription
};
