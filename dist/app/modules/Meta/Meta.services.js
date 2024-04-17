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
exports.MetaService = void 0;
const client_1 = require("@prisma/client");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const fetchDashboardMetaData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    let metaData;
    switch (user.role) {
        case client_1.UserRole.SUPER_ADMIN: {
            metaData = getSuperAdminMetaData();
            break;
        }
        case client_1.UserRole.ADMIN: {
            metaData = getAdminMetaData();
            break;
        }
        case client_1.UserRole.DOCTOR: {
            metaData = getDoctorMetaData(user);
            break;
        }
        case client_1.UserRole.PATIENT: {
            metaData = getPatientMetaData(user);
            break;
        }
        default: throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, "Default Requets", "");
    }
    return metaData;
});
const getSuperAdminMetaData = () => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentCount = yield prisma_1.default.appointment.count();
    const patientCount = yield prisma_1.default.appointment.count();
    const doctorCount = yield prisma_1.default.doctor.count();
    const paymentCount = yield prisma_1.default.payment.count();
    const adminCount = yield prisma_1.default.admin.count();
    const totalRevinue = yield prisma_1.default.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            paymentStatus: client_1.PaymentStatus.PAID
        }
    });
    return {
        appointmentCount,
        patientCount,
        doctorCount,
        paymentCount,
        totalRevinue,
        adminCount,
    };
});
const getAdminMetaData = () => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentCount = yield prisma_1.default.appointment.count();
    const patientCount = yield prisma_1.default.appointment.count();
    const doctorCount = yield prisma_1.default.doctor.count();
    const paymentCount = yield prisma_1.default.payment.count();
    const totalRevinue = yield prisma_1.default.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            paymentStatus: client_1.PaymentStatus.PAID
        }
    });
    return {
        appointmentCount,
        patientCount,
        doctorCount,
        paymentCount,
        totalRevinue
    };
});
const getDoctorMetaData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const doctorData = yield prisma_1.default.doctor.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email
        }
    });
    const appointmentCount = yield prisma_1.default.appointment.count({
        where: {
            doctorId: doctorData.id
        }
    });
    const patientCount = yield prisma_1.default.appointment.groupBy({
        by: ['patientId'],
        _count: {
            id: true
        }
    });
    const reviewCount = yield prisma_1.default.review.count({
        where: {
            doctorId: doctorData.id
        }
    });
    const totalRevenue = yield prisma_1.default.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            appointment: {
                doctorId: doctorData.id
            },
            paymentStatus: client_1.PaymentStatus.PAID
        }
    });
    const appointmentStatusDistribution = yield prisma_1.default.appointment.groupBy({
        by: ['status'],
        _count: {
            id: true
        },
        where: {
            doctorId: doctorData.id,
        },
    });
    const formatedAppointmentStatusDistribution = appointmentStatusDistribution === null || appointmentStatusDistribution === void 0 ? void 0 : appointmentStatusDistribution.map((count) => ({
        status: count.status,
        count: Number(count._count.id)
    }));
    return {
        patientCount: patientCount.length,
        reviewCount,
        totalRevenue,
        formatedAppointmentStatusDistribution,
        appointmentCount
    };
});
const getPatientMetaData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const patientData = yield prisma_1.default.patient.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email
        }
    });
    const appointmentCount = yield prisma_1.default.appointment.count({
        where: {
            patientId: patientData.id
        }
    });
    const prescriptionCount = yield prisma_1.default.prescription.count({
        where: {
            patientId: patientData.id
        }
    });
    const reviewCount = yield prisma_1.default.review.count({
        where: {
            patientId: patientData.id
        }
    });
    const appointmentStatusDistribution = yield prisma_1.default.appointment.groupBy({
        by: ['status'],
        _count: {
            id: true
        },
        where: {
            patientId: patientData.id
        }
    });
    const formatedAppointmentStatusDistribution = appointmentStatusDistribution === null || appointmentStatusDistribution === void 0 ? void 0 : appointmentStatusDistribution.map((count) => ({
        status: count.status,
        count: Number(count._count.id)
    }));
    return {
        appointmentCount,
        prescriptionCount,
        reviewCount,
        formatedAppointmentStatusDistribution
    };
});
exports.MetaService = {
    fetchDashboardMetaData
};
