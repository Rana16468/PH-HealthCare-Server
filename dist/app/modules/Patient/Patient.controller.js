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
exports.PatientController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const Patient_sservices_1 = require("./Patient.sservices");
const sendRespone_1 = __importDefault(require("../../shared/sendRespone"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const pick_1 = __importDefault(require("../../shared/pick"));
const Patient_constant_1 = require("./Patient.constant");
const GetAllPatient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.default)(req.query, Patient_constant_1.patientFilterableFields);
    const option = (0, pick_1.default)(req.query, ['page', 'limit', 'sortBy', 'orderBy']);
    const result = yield Patient_sservices_1.PatientService.GetAllPatientFromDB(filter, option);
    (0, sendRespone_1.default)(res, { success: true, status: http_status_codes_1.default.OK, message: "Get All Patient Successfully", meta: result.meta, data: result.data });
}));
const GetByPatientId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Patient_sservices_1.PatientService.GetByPatientIdFromDB(req.params.id);
}));
const DeletePatient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Patient_sservices_1.PatientService.DeletePatientIntoDb(req.params.id);
    (0, sendRespone_1.default)(res, { success: true, status: http_status_codes_1.default.OK, message: "Delete  Successfully", data: result });
}));
const SoftPatientDelete = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Patient_sservices_1.PatientService.SoftPatientDeleteIntoDb(req.params.id);
    (0, sendRespone_1.default)(res, { success: true, status: http_status_codes_1.default.OK, message: "Soft Delete  Successfully", data: result });
}));
const UpdatePatient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Patient_sservices_1.PatientService.UpdatePatientIntoDb(req.params.id, req);
    (0, sendRespone_1.default)(res, { success: true, status: http_status_codes_1.default.OK, message: "Update Patient Info Successfully", data: result });
}));
exports.PatientController = {
    UpdatePatient,
    DeletePatient,
    GetAllPatient,
    GetByPatientId,
    SoftPatientDelete
};
