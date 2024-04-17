"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_routes_1 = require("../modules/Users/User.routes");
const Admin_routes_1 = require("../modules/Admin/Admin.routes");
const Auth_routes_1 = require("../modules/Auth/Auth.routes");
const specialties_routes_1 = require("../modules/Specialties/specialties.routes");
const Doctor_routes_1 = require("../modules/Doctor/Doctor.routes");
const Patient_routes_1 = require("../modules/Patient/Patient.routes");
const Schedule_routes_1 = require("../modules/Schedule/Schedule.routes");
const DoctorSchedule_routes_1 = require("../modules/DoctorSchedule/DoctorSchedule.routes");
const Appointment_routes_1 = require("../modules/Appointment/Appointment.routes");
const Payment_routes_1 = require("../modules/Payment/Payment.routes");
const Prescription_routes_1 = require("../modules/Presecription/Prescription.routes");
const review_routes_1 = require("../modules/Review/review.routes");
const Meta_routes_1 = require("../modules/Meta/Meta.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    { path: "/user", route: User_routes_1.UserRoutes },
    { path: "/admin", route: Admin_routes_1.AdminRouter },
    { path: "/auth", route: Auth_routes_1.AuthRouter },
    { path: "/specialties", route: specialties_routes_1.SpecialtiesRouter },
    { path: "/doctor", route: Doctor_routes_1.DoctorRouter },
    { path: "/patient", route: Patient_routes_1.PatientRouter },
    { path: "/schedule", route: Schedule_routes_1.ScheduleRoutes },
    { path: "/doctor-schedule", route: DoctorSchedule_routes_1.DoctorScheduleRouter },
    { path: "/appointment", route: Appointment_routes_1.AppointmentRouter },
    { path: "/payment", route: Payment_routes_1.PaymentRouters },
    { path: "/prescription", route: Prescription_routes_1.PrescriptionRouter },
    { path: "/review", route: review_routes_1.ReviewRouter },
    { path: "/meta", route: Meta_routes_1.MetaRoutes }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
