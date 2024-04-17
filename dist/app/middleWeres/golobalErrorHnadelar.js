"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const library_1 = require("@prisma/client/runtime/library");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const golobalErrorHnadelar = (err, req, res, next) => {
    let statusCode = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
    let message = (err === null || err === void 0 ? void 0 : err.message) || "Something went wrong";
    let success = false;
    let error = err;
    if (err instanceof library_1.PrismaClientValidationError) {
        statusCode = http_status_codes_1.default.INTERNAL_SERVER_ERROR,
            success = false,
            message = "Validation Error",
            error = err;
    }
    else if (err instanceof library_1.PrismaClientKnownRequestError) 
    //https://www.prisma.io/docs/orm/reference/error-reference#error-codes
    {
        if (err.code === "P2002") {
            statusCode = http_status_codes_1.default.INTERNAL_SERVER_ERROR,
                success = false,
                message = "Unique constraint failed on the fields",
                error = err;
        }
    }
    res.status(statusCode).send({
        success,
        message,
        error
    });
    next();
};
exports.default = golobalErrorHnadelar;
