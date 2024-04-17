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
exports.DoctorService = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const sendImageToCloudinary_1 = require("../../utility/sendImageToCloudinary");
const paginationHelper_1 = __importDefault(require("../../helper/paginationHelper"));
const client_1 = require("@prisma/client");
const Doctor_constant_1 = require("./Doctor.constant");
const getAllDoctorFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, sortBy, orderBy, skip } = (0, paginationHelper_1.default)(options);
    const { searchTerm, specialties } = filters, filterData = __rest(filters, ["searchTerm", "specialties"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: Doctor_constant_1.doctorSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    // doctor >  doctorSpecialties > specialties table
    if (specialties && specialties.length > 0) {
        // Corrected specialties condition
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialties: {
                        title: {
                            contains: specialties,
                            mode: 'insensitive',
                        },
                    },
                },
            },
        });
    }
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map(key => ({
            [key]: {
                equals: filterData[key],
            },
        }));
        andConditions.push(...filterConditions);
    }
    andConditions.push({
        isDeleted: false,
    });
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.orderBy
            ? { [options.sortBy]: options.orderBy }
            : { averageRating: 'desc' },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        },
    });
    const total = yield prisma_1.default.doctor.count({
        where: whereConditions,
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getByIdDoctorFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.doctor.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        }
    });
    return result;
});
const deleteDoctorFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const deleteDoctor = yield transactionClient.doctor.delete({
            where: {
                id,
            },
        });
        yield transactionClient.user.delete({
            where: {
                email: deleteDoctor.email,
            },
        });
        return deleteDoctor;
    }));
});
const softDeleteDoctorFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const deleteDoctor = yield transactionClient.doctor.update({
            where: { id },
            data: {
                isDeleted: true,
            },
        });
        yield transactionClient.user.update({
            where: {
                email: deleteDoctor.email,
            },
            data: {
                status: client_1.UserStatus.DELETED,
            },
        });
        return deleteDoctor;
    }));
});
const UpdateDoctorIntoDb = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    const doctorInfo = yield prisma_1.default.doctor.findUniqueOrThrow({
        where: {
            id
        }
    });
    const _a = req.body, { specialties } = _a, doctorData = __rest(_a, ["specialties"]);
    const file = req.file;
    if (file) {
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(file.filename, file.path);
        doctorData.profilePhoto = secure_url;
    }
    yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.doctor.update({
            where: {
                id
            },
            data: doctorData,
            include: {
                doctorSpecialties: true
            }
        });
        if (specialties && specialties.length > 0) {
            // delete specialties
            const deleteSpecialties = specialties.filter((speciality) => speciality.isDeleted);
            const createSpecialties = specialties.filter((speciality) => !speciality.isDeleted);
            for (var specialtiy of deleteSpecialties) {
                yield transactionClient.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: doctorInfo.id,
                        specialitiesId: specialtiy.specialitiesId,
                    }
                });
            }
            // create specialties
            for (var specialtiy of createSpecialties) {
                yield transactionClient.doctorSpecialties.create({
                    data: {
                        doctorId: doctorInfo.id,
                        specialitiesId: specialtiy.specialitiesId,
                    }
                });
            }
        }
    }));
    const result = yield prisma_1.default.doctor.findUnique({
        where: {
            id: doctorInfo.id
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        }
    });
    return result;
});
exports.DoctorService = {
    UpdateDoctorIntoDb,
    getAllDoctorFromDB,
    getByIdDoctorFromDB,
    deleteDoctorFromDB,
    softDeleteDoctorFromDb
};
