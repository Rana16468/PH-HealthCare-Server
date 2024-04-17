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
exports.AppointmentService = void 0;
const client_1 = require("@prisma/client");
const paginationHelper_1 = __importDefault(require("../../helper/paginationHelper"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const uuid_1 = require("uuid");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createAppointmentIntoDb = (email, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const patientData = yield prisma_1.default.patient.findUniqueOrThrow({
        where: {
            email
        },
        select: {
            id: true
        }
    });
    const doctorData = yield prisma_1.default.doctor.findUniqueOrThrow({
        where: {
            id: payload
                .doctorId
        },
        select: {
            id: true,
            appointmentFee: true
        }
    });
    yield prisma_1.default.doctorSchedules.findFirstOrThrow({
        where: {
            doctorId: doctorData.id,
            scheduleId: payload.scheduleId,
            isBooked: false
        }
    });
    const videoCallingId = (0, uuid_1.v4)();
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const appointmentData = yield transactionClient.appointment.create({
            data: {
                doctorId: doctorData === null || doctorData === void 0 ? void 0 : doctorData.id,
                patientId: patientData.id,
                scheduleId: payload.scheduleId,
                videoCallingId
            },
            include: {
                patient: true,
                doctor: true,
                schedule: true
            }
        });
        yield transactionClient.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: doctorData.id,
                    scheduleId: payload.scheduleId
                }
            },
            data: {
                isBooked: true,
                appointmentId: appointmentData.id
            }
        });
        //companyName,randomNumber-dateTime,
        const today = new Date();
        const transactionId = 'PH-HealthCare-' + today.getFullYear() + "-" + today.getMonth() + "-" + today.getDay() + "-" + today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds() + "-" + today.getMilliseconds();
        yield transactionClient.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId,
            }
        });
        return appointmentData;
    }));
    return result;
});
const GetMyAppointmentFromDB = (user, filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, sortBy, orderBy, skip } = (0, paginationHelper_1.default)(options);
    const filterData = __rest(filters, []);
    const andConditions = [];
    if (client_1.UserRole.PATIENT === user.role) {
        andConditions.push({
            patient: {
                email: user.email
            }
        });
    }
    else if (client_1.UserRole.DOCTOR === user.role) {
        andConditions.push({
            doctor: {
                email: user.email
            }
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
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.appointment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.orderBy
            ? { [options.sortBy]: options.orderBy }
            : { createdAt: 'desc' },
        include: client_1.UserRole.PATIENT === user.role ? {
            doctor: true,
            schedule: true
        } : { patient: {
                include: {
                    patientHealthData: true,
                    medicalRepor: true
                }
            }, schedule: true, }
    });
    const total = yield prisma_1.default.appointment.count({
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
const changeAppointmentStatusFromDb = (appointmentId, status, user) => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentData = yield prisma_1.default.appointment.findUniqueOrThrow({
        where: {
            id: appointmentId
        },
        include: {
            doctor: true
        }
    });
    if (user.role === client_1.UserRole.DOCTOR) {
        if (!(user.email === appointmentData.doctor.email)) {
            throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, "This Not Your Appointment", "");
        }
    }
    const result = yield prisma_1.default.appointment.update({
        where: {
            id: appointmentData.id
        },
        data: {
            status
        }
    });
    return result;
});
/*SCHEDULED
INPROGRESS
COMPLETED
CANCELED */
const CancleUnpaidAppointments = () => __awaiter(void 0, void 0, void 0, function* () {
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);
    const unPaidAppointment = yield prisma_1.default.appointment.findMany({
        where: {
            createdAt: {
                lte: thirtyMinAgo
            },
            paymentStatus: client_1.PaymentStatus.UNPAID
        }
    });
    const unPaidAppointmentToCancel = unPaidAppointment === null || unPaidAppointment === void 0 ? void 0 : unPaidAppointment.map((appointment) => appointment.id);
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.payment.deleteMany({
            where: {
                appointmentId: {
                    in: unPaidAppointmentToCancel
                }
            }
        });
        yield tx.appointment.deleteMany({
            where: {
                id: {
                    in: unPaidAppointmentToCancel
                }
            }
        });
        for (const unPaidAppoint of unPaidAppointment) {
            yield tx.doctorSchedules.updateMany({
                where: {
                    doctorId: unPaidAppoint.doctorId,
                    scheduleId: unPaidAppoint.scheduleId
                },
                data: {
                    isBooked: false
                }
            });
        }
    }));
});
exports.AppointmentService = {
    createAppointmentIntoDb,
    GetMyAppointmentFromDB,
    changeAppointmentStatusFromDb,
    CancleUnpaidAppointments
};
