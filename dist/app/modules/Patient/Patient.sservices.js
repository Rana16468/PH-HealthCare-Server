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
exports.PatientService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const paginationHelper_1 = __importDefault(require("../../helper/paginationHelper"));
const Patient_constant_1 = require("./Patient.constant");
const GetAllPatientFromDB = (params, option) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const { limit, page, sortBy, orderBy, skip } = (0, paginationHelper_1.default)(option);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: Patient_constant_1.patientSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                return {
                    [key]: {
                        equals: filterData[key],
                    },
                };
            }),
        });
    }
    andConditions.push({
        isDeleted: false,
    });
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.patient.findMany({
        include: {
            medicalRepor: true,
            patientHealthData: true,
        },
        where: whereConditions,
        skip,
        take: limit,
        orderBy: option.sortBy && option.orderBy
            ? { [option.sortBy]: option.orderBy }
            : {
                createdAt: 'desc',
            },
    });
    const total = yield prisma_1.default.patient.count({
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
const GetByPatientIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.patient.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            medicalRepor: true,
            patientHealthData: true,
        },
    });
    return result;
});
const DeletePatientIntoDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((transctionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // delete medical report 
        yield transctionClient.medicalRepor.deleteMany({
            where: {
                patientId: id
            }
        });
        // delete  patient health  Data 
        yield transctionClient.patientHealthData.delete({
            where: {
                patientId: id
            }
        });
        // delete patient table data 
        const deletedpatientData = yield transctionClient.patient.delete({
            where: {
                id
            }
        });
        yield transctionClient.user.delete({
            where: {
                email: deletedpatientData.email
            }
        });
        return deletedpatientData;
    }));
    return result;
});
const SoftPatientDeleteIntoDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const deletedPatient = yield transactionClient.patient.update({
            where: { id },
            data: {
                isDeleted: true,
            },
        });
        yield transactionClient.user.update({
            where: {
                email: deletedPatient.email,
            },
            data: {
                status: client_1.UserStatus.DELETED,
            },
        });
        return deletedPatient;
    }));
});
const UpdatePatientIntoDb = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { patientHealthData, medicalRepor } = _a, patientData = __rest(_a, ["patientHealthData", "medicalRepor"]);
    const patientInfo = yield prisma_1.default.patient.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        },
        select: {
            id: true
        }
    });
    // transaction rollback
    yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.patient.update({
            // update patient data
            where: {
                id
            },
            data: patientData,
            include: {
                medicalRepor: true,
                patientHealthData: true
            }
        });
        // create or update patent health data 
        if (patientHealthData) {
            yield transactionClient.patientHealthData.upsert({
                where: {
                    patientId: patientInfo.id,
                },
                update: patientHealthData,
                create: Object.assign(Object.assign({}, patientHealthData), { patientId: patientInfo.id })
            });
        }
        if (medicalRepor) {
            yield transactionClient.medicalRepor.create({
                data: Object.assign({ patientId: patientInfo.id }, medicalRepor)
            });
        }
    }));
    return yield prisma_1.default.patient.findUnique({
        where: {
            id: patientInfo.id
        }, include: {
            patientHealthData: true,
            medicalRepor: true
        }
    });
});
exports.PatientService = {
    UpdatePatientIntoDb,
    DeletePatientIntoDb,
    GetAllPatientFromDB,
    GetByPatientIdFromDB,
    SoftPatientDeleteIntoDb
};
