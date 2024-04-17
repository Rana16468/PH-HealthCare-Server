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
exports.SpecialtiesService = void 0;
const sendImageToCloudinary_1 = require("../../utility/sendImageToCloudinary");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createSpecialtiesIntoDb = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(file.filename, file.path);
        req.body.icon = secure_url;
    }
    const result = yield prisma_1.default.specialties.create({
        data: req.body
    });
    return result;
});
const GetAllSpecialtiesIntoDb = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.specialties.findMany({});
});
const DeleteSpecialtiesIntoDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteSpeciaalties = yield prisma_1.default.specialties.delete({
        where: {
            id
        }
    });
    return deleteSpeciaalties;
});
exports.SpecialtiesService = {
    createSpecialtiesIntoDb,
    GetAllSpecialtiesIntoDb,
    DeleteSpecialtiesIntoDb
};
