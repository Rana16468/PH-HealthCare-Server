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
exports.UserController = void 0;
const User_services_1 = require("./User.services");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendRespone_1 = __importDefault(require("../../shared/sendRespone"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const pick_1 = __importDefault(require("../../shared/pick"));
const User_constant_1 = require("./User.constant");
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield User_services_1.UserService.createAdminFromDb(req);
        res.status(200).json({ success: true, message: "User is Created", data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, message: (error === null || error === void 0 ? void 0 : error.name) || "Something went wrong", error });
    }
});
const createDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield User_services_1.UserService.createDoctorFromDb(req);
    (0, sendRespone_1.default)(res, { success: true, status: http_status_codes_1.default.CREATED, message: "Successfully Doctor Created", data: result });
}));
const createPatient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield User_services_1.UserService.createPatientIntoDb(req);
    (0, sendRespone_1.default)(res, { success: true, status: http_status_codes_1.default.CREATED, message: "Successfully Patient Created", data: result });
}));
const getAll = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.default)(req.query, User_constant_1.userFilterableFields);
    const option = (0, pick_1.default)(req.query, ['page', 'limit', 'sortBy', 'orderBy']);
    // console.log(option);
    const result = yield User_services_1.UserService.getAllFromDb(filter, option);
    (0, sendRespone_1.default)(res, { status: http_status_codes_1.default.OK, success: true, message: "Get User All Featch", meta: result.meta, data: result.data });
}));
const chnageProfileStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield User_services_1.UserService.chnageProfileStatusFromDb(id, req.body);
    (0, sendRespone_1.default)(res, { status: http_status_codes_1.default.OK, success: true, message: "Change Profile Status", data: result });
}));
const getMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield User_services_1.UserService.getMyProfileIntoDb(user);
    (0, sendRespone_1.default)(res, { status: http_status_codes_1.default.OK, success: true, message: "Get My Profile Successfully", data: result });
}));
const updateMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield User_services_1.UserService.updateMyProfileIntoDb(req.user, req);
    (0, sendRespone_1.default)(res, { success: true, status: http_status_codes_1.default.OK, message: "Update My Profile Successfully", data: result });
}));
exports.UserController = {
    createAdmin,
    createDoctor,
    getAll,
    chnageProfileStatus,
    createPatient,
    getMyProfile,
    updateMyProfile
};
