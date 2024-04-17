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
exports.SpecialtiesController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const specialties_services_1 = require("./specialties.services");
const sendRespone_1 = __importDefault(require("../../shared/sendRespone"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createSpecialties = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield specialties_services_1.SpecialtiesService.createSpecialtiesIntoDb(req);
    (0, sendRespone_1.default)(res, { success: true, status: http_status_codes_1.default.OK, message: "Create Specificialties Successfully", data: result });
}));
const GetAllSpecialties = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield specialties_services_1.SpecialtiesService.GetAllSpecialtiesIntoDb();
    (0, sendRespone_1.default)(res, { success: true, status: http_status_codes_1.default.OK, message: "Get Successfully All Specialties Data", data: result });
}));
const DeleteSpecialties = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield specialties_services_1.SpecialtiesService.DeleteSpecialtiesIntoDb(req.params.id);
    (0, sendRespone_1.default)(res, { success: true, status: http_status_codes_1.default.OK, message: "Delete Successfully All Specialties Data", data: result });
}));
exports.SpecialtiesController = {
    createSpecialties,
    GetAllSpecialties,
    DeleteSpecialties
};
