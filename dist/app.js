"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const golobalErrorHnadelar_1 = __importDefault(require("./app/middleWeres/golobalErrorHnadelar"));
const notFounded_1 = __importDefault(require("./app/middleWeres/notFounded"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const Appointment_services_1 = require("./app/modules/Appointment/Appointment.services");
const node_cron_1 = __importDefault(require("node-cron"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
//https://www.npmjs.com/package/cookie-parser
app.use((0, cookie_parser_1.default)());
// parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
node_cron_1.default.schedule('* * * * *', () => {
    try {
        Appointment_services_1.AppointmentService.CancleUnpaidAppointments();
    }
    catch (error) {
        console.log(error);
    }
});
app.get('/', (req, res) => {
    res.send({ message: "Ph-Health Care Server is Running" });
});
app.use('/api/v1', routes_1.default);
app.use(golobalErrorHnadelar_1.default);
app.use("*", notFounded_1.default);
exports.default = app;
