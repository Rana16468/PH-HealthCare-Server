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
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../src/app/shared/prisma"));
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isExistSuperAdmin = yield prisma_1.default.user.findFirst({
            where: {
                role: client_1.UserRole.SUPER_ADMIN
            }
        });
        if (isExistSuperAdmin) {
            console.log("Super Admin Exist");
            return;
        }
        yield prisma_1.default.user.create({
            data: {
                email: "super@admin.com",
                password: "123456",
                role: client_1.UserRole.SUPER_ADMIN,
                admin: {
                    create: {
                        name: "Super Admin",
                        contractNumber: "01722305054",
                    }
                }
            }
        });
        console.log("Super Admin Created Successfully");
    }
    catch (error) {
        console.log(error);
    }
    finally {
        yield prisma_1.default.$disconnect();
    }
});
seedSuperAdmin();
