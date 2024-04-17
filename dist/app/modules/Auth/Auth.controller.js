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
exports.AuthController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const Auth_services_1 = require("./Auth.services");
const sendRespone_1 = __importDefault(require("../../shared/sendRespone"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Auth_services_1.AuthServices.loginUserFromDb(req.body);
    const { refreshToken, accessToken, needPasswordChange } = result;
    res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true
    });
    (0, sendRespone_1.default)(res, { status: http_status_codes_1.default.OK, success: true, message: "Login IN Successfylly", data: {
            accessToken,
            needPasswordChange
        } });
}));
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //https://www.npmjs.com/package/cookie-parser
    const { refreshToken } = req.cookies;
    const result = yield Auth_services_1.AuthServices.refreshToken(refreshToken);
    (0, sendRespone_1.default)(res, { status: http_status_codes_1.default.OK, success: true, message: "Refresh Token Get Successfully", data: result });
}));
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Auth_services_1.AuthServices.changePasswordIntoDb(req.user, req.body);
    (0, sendRespone_1.default)(res, { status: http_status_codes_1.default.OK, success: true, message: "Password Chnage Successfully", data: result });
}));
const forgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Auth_services_1.AuthServices.forgotPassword(req.body);
    (0, sendRespone_1.default)(res, { status: http_status_codes_1.default.OK, success: true, message: "Forgot Password Successfully", data: result });
}));
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization || "";
    const result = yield Auth_services_1.AuthServices.resetPassword(token, req.body);
    (0, sendRespone_1.default)(res, { status: http_status_codes_1.default.OK, success: true, message: "Reset Password Successfully Executed", data: result });
}));
exports.AuthController = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
};
