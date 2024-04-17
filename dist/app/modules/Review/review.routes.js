"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleWeres/auth"));
const review_controller_1 = require("./review.controller");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.PATIENT), review_controller_1.ReviewController.CreateReview);
// tASK all review get task ---- accaessable only Admin And SuperADMIN
exports.ReviewRouter = router;
