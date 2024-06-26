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
exports.ReviewServices = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const CreateReviewIntoDb = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const patientData = yield prisma_1.default.patient.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email
        },
        select: {
            id: true
        }
    });
    const appointmentData = yield prisma_1.default.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId
        }
    });
    if (!(patientData.id === appointmentData.patientId)) {
        throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, "Not Match Patient Info", "");
    }
    const reviewResult = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const result = tx.review.create({
            data: {
                appointmentId: appointmentData.id,
                doctorId: appointmentData.doctorId,
                patientId: appointmentData.patientId,
                rating: payload.rating,
                comment: payload.comment
            }
        });
        const averageRating = yield tx.review.aggregate({
            _avg: {
                rating: true
            }
        });
        yield tx.doctor.update({
            where: {
                id: appointmentData.doctorId
            },
            data: {
                averageRating: averageRating._avg.rating
            }
        });
        return result;
    }));
    return reviewResult;
});
exports.ReviewServices = {
    CreateReviewIntoDb
};
