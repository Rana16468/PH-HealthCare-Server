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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const sendImageToCloudinary_1 = require("../../utility/sendImageToCloudinary");
const paginationHelper_1 = __importDefault(require("../../helper/paginationHelper"));
const User_constant_1 = require("./User.constant");
const prisma = new client_1.PrismaClient();
const createAdminFromDb = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(file.filename, file.path);
        req.body.admin.profilePhoto = secure_url;
    }
    const hashedPassword = yield bcrypt_1.default.hash(req.body.password, Number(config_1.default.bcrypt_salt_rounds));
    const userData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: client_1.UserRole.ADMIN
    };
    const result = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.user.create({
            data: userData
        });
        const createdAdminData = yield transactionClient.admin.create({
            data: req.body.admin
        });
        return createdAdminData;
    }));
    return result;
});
const createDoctorFromDb = (req) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    // console.log(req.file);
    const file = req.file;
    if (file) {
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(file.filename, file.path);
        req.body.doctor.profilePhoto = secure_url;
    }
    const hashedPassword = yield bcrypt_1.default.hash(req.body.password, Number(config_1.default.bcrypt_salt_rounds));
    const userData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: client_1.UserRole.DOCTOR
    };
    const result = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.user.create({
            data: userData
        });
        const createdDoctorData = yield transactionClient.doctor.create({
            data: req.body.doctor
        });
        return createdDoctorData;
    }));
    return result;
});
const createPatientIntoDb = (req) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    //console.log(req.file);
    const file = req.file;
    if (file) {
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(file.filename, file.path);
        req.body.patient.profilePhoto = secure_url;
    }
    const hashedPassword = yield bcrypt_1.default.hash(req.body.password, Number(config_1.default.bcrypt_salt_rounds));
    const userData = {
        email: req.body.patient.email,
        password: hashedPassword,
        role: client_1.UserRole.PATIENT
    };
    const result = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.user.create({
            data: userData
        });
        const createdDoctorData = yield transactionClient.patient.create({
            data: req.body.patient
        });
        return createdDoctorData;
    }));
    return result;
});
const getAllFromDb = (params, option) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const { limit, page, sortBy, orderBy, skip } = (0, paginationHelper_1.default)(option);
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            OR: User_constant_1.userSearchAbleField.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map((field) => ({
                [field]: {
                    equals: filterData[field]
                }
            }))
        });
    }
    // console.dir(andCondition,{depth:'infinity'});
    const whereCondition = { AND: andCondition };
    const result = yield prisma.user.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: sortBy && orderBy ? {
            [sortBy]: orderBy
        } : {
            createdAt: "desc"
        },
        select: {
            id: true,
            role: true,
            status: true,
            email: true,
            needPasswordChange: true,
            createdAt: true,
            updatedAt: true,
            admin: true,
            doctor: true
        }
        /*,include:{
           admin:true,
           doctor:true
        } */
    });
    const total = yield prisma.user.count({
        where: whereCondition
    });
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
});
const chnageProfileStatusFromDb = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    });
    const updateUserStatus = yield prisma.user.update({
        where: {
            id: userData.id
        },
        data: {
            status: data.status
        }
    });
    return updateUserStatus;
});
const getMyProfileIntoDb = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma.user.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE
        },
        select: {
            id: true,
            email: true,
            needPasswordChange: true,
            role: true,
            status: true
        }
    });
    let profileInfo;
    if (userInfo.role === client_1.UserRole.ADMIN) {
        profileInfo = yield prisma.admin.findUniqueOrThrow({
            where: {
                email: userInfo.email
            }
        });
    }
    else if (userInfo.role === client_1.UserRole.DOCTOR) {
        profileInfo = yield prisma.doctor.findUniqueOrThrow({
            where: {
                email: userInfo.email
            }
        });
    }
    else if (userInfo.role === client_1.UserRole.PATIENT) {
        profileInfo = yield prisma.user.findUniqueOrThrow({
            where: {
                email: userInfo.email,
            },
            select: {
                id: true,
                email: true,
                needPasswordChange: true,
                role: true,
                status: true
            }
        });
    }
    else {
        profileInfo = yield prisma.admin.findUniqueOrThrow({
            where: {
                email: userInfo.email
            }
        });
    }
    return Object.assign(Object.assign({}, userInfo), profileInfo);
});
const updateMyProfileIntoDb = (user, req) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma.user.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const file = req.file;
    if (file) {
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(file.filename, file.path);
        req.body.profilePhoto = secure_url;
    }
    let updateProfile;
    if (userInfo.role === client_1.UserRole.ADMIN) {
        updateProfile = yield prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        });
    }
    else if (userInfo.role === client_1.UserRole.DOCTOR) {
        updateProfile = yield prisma.doctor.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        });
    }
    else if (userInfo.role === client_1.UserRole.PATIENT) {
        updateProfile = yield prisma.user.update({
            where: {
                email: userInfo.email,
            },
            data: req.body
        });
    }
    else {
        updateProfile = yield prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        });
    }
    return updateProfile;
});
exports.UserService = {
    createAdminFromDb,
    createDoctorFromDb,
    createPatientIntoDb,
    getAllFromDb,
    chnageProfileStatusFromDb,
    getMyProfileIntoDb,
    updateMyProfileIntoDb
};
