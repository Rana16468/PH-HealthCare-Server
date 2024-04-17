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
exports.AuthServices = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const jwtHelpers_1 = require("../../helper/jwtHelpers");
const client_1 = require("@prisma/client");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendEmail_1 = require("../../utility/sendEmail");
const loginUserFromDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    // secret generatot =require('crypto').randomBytes(32).toString('hex')
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Password Encorred");
    }
    const accessToken = jwtHelpers_1.jwtHalpers.generateToken({ email: userData.email, role: userData.role }, config_1.default.jwt_access_srcret, config_1.default.token_expire_in);
    const refreshToken = jwtHelpers_1.jwtHalpers.generateToken({ email: userData.email, role: userData.role }, config_1.default.jwt_refeesh_srcret, config_1.default.refresh_token_expire_in);
    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange,
        refreshToken
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jwtHelpers_1.jwtHalpers.varifyToken(token, config_1.default.jwt_refeesh_srcret);
    }
    catch (error) {
        throw new Error("You Are Not Authorization");
    }
    const isUserExit = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const accessToken = jwtHelpers_1.jwtHalpers.generateToken({ email: isUserExit.email, role: isUserExit.role }, config_1.default.jwt_access_srcret, config_1.default.token_expire_in);
    return {
        accessToken,
        needPasswordChange: isUserExit.needPasswordChange
    };
});
const changePasswordIntoDb = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new ApiError_1.default(http_status_codes_1.default.FORBIDDEN, "Password Encorred", "");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    yield prisma_1.default.user.update({
        where: {
            email: user.email
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    });
    return "passwoed change Successfully";
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const resetPasswordToken = jwtHelpers_1.jwtHalpers.generateToken({ email: userData === null || userData === void 0 ? void 0 : userData.email, role: userData === null || userData === void 0 ? void 0 : userData.role }, config_1.default.jwt_reset_srcret, config_1.default.reset_token_expire_in);
    // console.log(resetPasswordToken);
    const resetPasswordLink = config_1.default.reset_password_link + `?id=${userData === null || userData === void 0 ? void 0 : userData.id}&token=${resetPasswordToken}`;
    yield (0, sendEmail_1.sendEmail)(userData === null || userData === void 0 ? void 0 : userData.email, `
     <div>
     <p> Dear User</p>
     <p>Your Password Reset Link</p>
     <a href=${resetPasswordLink}>
      <button>Reset Password</button>
     </a>
     </div>`);
    return "Checked You Email";
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const isValidateToken = jwtHelpers_1.jwtHalpers.varifyToken(token, config_1.default.jwt_reset_srcret);
    if (!isValidateToken) {
        throw new ApiError_1.default(http_status_codes_1.default.FORBIDDEN, "Token is Expire", "");
    }
    //hash password
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, Number(config_1.default.bcrypt_salt_rounds));
    // update password
    yield prisma_1.default.user.update({
        where: {
            email: isValidateToken === null || isValidateToken === void 0 ? void 0 : isValidateToken.email
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    });
    return "reset password update successfully";
});
exports.AuthServices = {
    loginUserFromDb,
    refreshToken,
    changePasswordIntoDb,
    forgotPassword,
    resetPassword
};
