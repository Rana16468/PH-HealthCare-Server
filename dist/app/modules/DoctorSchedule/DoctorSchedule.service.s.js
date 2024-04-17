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
exports.DoctorScheduleService = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const paginationHelper_1 = __importDefault(require("../../helper/paginationHelper"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const CreateDoctorScheduleIntoDb = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const doctorData = yield prisma_1.default.doctor.findUniqueOrThrow({
        where: {
            email
        },
        select: {
            id: true
        }
    });
    const doctorScheduleData = req.body.scheduleIds.map((scheduleId) => ({ doctorId: doctorData.id, scheduleId }));
    const result = yield prisma_1.default.doctorSchedules.createMany({
        data: doctorScheduleData
    });
    return result;
});
const GetAllDoctorScheduleIntoDb = (params, option, email) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate } = params, filterData = __rest(params, ["startDate", "endDate"]);
    const { limit, page, skip } = (0, paginationHelper_1.default)(option);
    const andConditions = [];
    if (startDate && endDate) {
        andConditions.push({
            AND: [
                {
                    schedule: {
                        startDateTime: {
                            gte: startDate
                        }
                    }
                },
                {
                    schedule: {
                        endDateTime: {
                            lte: endDate
                        }
                    }
                }
            ]
        });
    }
    if (Object.keys(filterData).length > 0) {
        if (typeof filterData.isBooked === "string" && filterData.isBooked === "true") {
            filterData.isBooked = true;
        }
        else if (typeof filterData.isBooked === 'string' && filterData.isBooked === "false") {
            filterData.isBooked = false;
        }
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
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.doctorSchedules.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: option.sortBy && option.orderBy
            ? { [option.sortBy]: option.orderBy }
            : {},
    });
    const total = yield prisma_1.default.doctorSchedules.count({
        where: whereConditions
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
const DeleteDoctorScheduleFromDb = (scheduleId, email) => __awaiter(void 0, void 0, void 0, function* () {
    const doctorData = yield prisma_1.default.doctor.findFirstOrThrow({
        where: {
            email
        },
        select: {
            id: true
        }
    });
    const isBookedSchedule = yield prisma_1.default.doctorSchedules.findUnique({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId
            },
            isBooked: true
        }
    });
    if (isBookedSchedule) {
        throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, "This Schedule Alredy Booked", "");
    }
    const deleteDoctorSchedule = yield prisma_1.default.doctorSchedules.delete({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId
            }
        }
    });
    return deleteDoctorSchedule;
});
exports.DoctorScheduleService = {
    CreateDoctorScheduleIntoDb,
    GetAllDoctorScheduleIntoDb,
    DeleteDoctorScheduleFromDb
};
