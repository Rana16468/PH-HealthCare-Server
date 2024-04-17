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
exports.ScheduleService = void 0;
const date_fns_1 = require("date-fns");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const paginationHelper_1 = __importDefault(require("../../helper/paginationHelper"));
const CreateScheduleIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //https://date-fns.org/v3.6.0/docs/Getting-Started
    const { startDate, endDate, startTime, endTime } = payload;
    const currentDate = new Date(startDate);
    const endingDate = new Date(endDate);
    const intervalTime = 30;
    const schedule = [];
    while (currentDate <= endingDate) {
        const startDateTime = new Date((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(`${(0, date_fns_1.format)(currentDate, 'yyyy-MM-dd')}`, Number(startTime.split(':')[0])), Number(startTime.split(':')[1])));
        const endDateTime = new Date((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(`${(0, date_fns_1.format)(currentDate, 'yyyy-MM-dd')}`, Number(endTime.split(':')[0])), Number(endTime.split(':')[1])));
        while (startDateTime < endDateTime) {
            const scheduleData = {
                startDateTime: startDateTime,
                endDateTime: (0, date_fns_1.addMinutes)(startDateTime, intervalTime)
            };
            // duplicate scheduling checking 
            const existingSchedule = yield prisma_1.default.schedule.findFirst({
                where: {
                    startDateTime: scheduleData.startDateTime,
                    endDateTime: scheduleData.endDateTime
                }
            });
            if (!existingSchedule) {
                const result = yield prisma_1.default.schedule.create({
                    data: scheduleData
                });
                schedule.push(result);
            }
            startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return schedule;
});
const GetAllScheduleFromDb = (params, option, email) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate } = params, filterData = __rest(params, ["startDate", "endDate"]);
    const { limit, page, skip } = (0, paginationHelper_1.default)(option);
    const andConditions = [];
    if (startDate && endDate) {
        andConditions.push({
            AND: [
                {
                    startDateTime: {
                        gte: startDate
                    }
                },
                {
                    endDateTime: {
                        lte: endDate
                    }
                }
            ]
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
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    // total Schedule - selected schedule 
    const doctorSchedule = yield prisma_1.default.doctorSchedules.findMany({
        where: {
            doctor: {
                email
            }
        },
        select: {
            scheduleId: true
        }
    });
    const doctorScheduleIds = doctorSchedule === null || doctorSchedule === void 0 ? void 0 : doctorSchedule.map((scheduleId) => scheduleId.scheduleId);
    const result = yield prisma_1.default.schedule.findMany({
        where: Object.assign(Object.assign({}, whereConditions), { id: {
                notIn: doctorScheduleIds
            } }),
        skip,
        take: limit,
        orderBy: option.sortBy && option.orderBy
            ? { [option.sortBy]: option.orderBy }
            : {
                createdAt: 'desc',
            },
    });
    const total = yield prisma_1.default.schedule.count({
        where: Object.assign(Object.assign({}, whereConditions), { id: {
                notIn: doctorScheduleIds
            } }),
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
exports.ScheduleService = {
    CreateScheduleIntoDb,
    GetAllScheduleFromDb
};
