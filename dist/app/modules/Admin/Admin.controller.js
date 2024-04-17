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
exports.AdminController = void 0;
const Admin_services_1 = require("./Admin.services");
const pick_1 = __importDefault(require("../../shared/pick"));
const Admin_constants_1 = require("./Admin.constants");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendRespone_1 = __importDefault(require("../../shared/sendRespone"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
// higher order function 
const getAll = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.default)(req.query, Admin_constants_1.adminFilterableFields);
    const option = (0, pick_1.default)(req.query, ['page', 'limit', 'sortBy', 'orderBy']);
    // console.log(option);
    const result = yield Admin_services_1.AdminService.getAllFromDb(filter, option);
    (0, sendRespone_1.default)(res, { status: http_status_codes_1.default.OK, success: true, message: "Get All Featch", meta: result.meta, data: result.data });
}));
const getById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Admin_services_1.AdminService.getbyIdFromDb(req.params.id);
    (0, sendRespone_1.default)(res, { status: http_status_codes_1.default.OK, success: true, message: "Admin data Featched", data: result });
}));
const update = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield Admin_services_1.AdminService.updateIntoDb(id, req.body);
    (0, sendRespone_1.default)(res, { status: http_status_codes_1.default.OK, success: true, message: "Update Successfully", data: result });
}));
const deleted = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield Admin_services_1.AdminService.deleteFromDb(id);
    (0, sendRespone_1.default)(res, { status: http_status_codes_1.default.OK, success: true, message: "Admin Data Deleted", data: result });
}));
const softDelete = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield Admin_services_1.AdminService.softDeleteFromDb(id);
    (0, sendRespone_1.default)(res, { status: http_status_codes_1.default.OK, success: true, message: "Admin data Soft Deleted", data: result });
}));
exports.AdminController = {
    getAll,
    getById, update,
    deleted,
    softDelete
};
