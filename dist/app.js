"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const User_routes_1 = require("./app/modules/Users/User.routes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.send({ message: "Ph-Health Care Server is Running" });
});
app.use('/api/v1/user', User_routes_1.UserRoutes);
exports.default = app;
