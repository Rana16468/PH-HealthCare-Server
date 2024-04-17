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
exports.ScheduleController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const Schedule_services_1 = require("./Schedule.services");
const sendRespone_1 = __importDefault(require("../../shared/sendRespone"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const pick_1 = __importDefault(require("../../shared/pick"));
const Schedule_constant_1 = require("./Schedule.constant");
const CreateSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Schedule_services_1.ScheduleService.CreateScheduleIntoDb(req.body);
    (0, sendRespone_1.default)(res, { success: true, status: http_status_codes_1.default.CREATED, message: "Schedule Successfully Created", data: result });
}));
const GetAllSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.default)(req.query, Schedule_constant_1.scheduleFilterableFields);
    const option = (0, pick_1.default)(req.query, ['page', 'limit', 'sortBy', 'orderBy']);
    const { email } = req.user;
    const result = yield Schedule_services_1.ScheduleService.GetAllScheduleFromDb(filter, option, email);
    (0, sendRespone_1.default)(res, { success: true, status: http_status_codes_1.default.OK, message: "Get All Schedule Successfully", meta: result.meta, data: result.data });
}));
exports.ScheduleController = {
    CreateSchedule,
    GetAllSchedule
};
