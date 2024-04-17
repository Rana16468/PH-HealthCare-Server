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
exports.AdminService = void 0;
const paginationHelper_1 = __importDefault(require("../../helper/paginationHelper"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const getAllFromDb = (params, option) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const { limit, page, sortBy, orderBy, skip } = (0, paginationHelper_1.default)(option);
    // SEARCH mULTIPLE FIELDS 
    /*[
                {
                    name:{
                        contains:params.searchTerm,
                        mode:"insensitive"
                    }
                },
                {
                    email:{
                        contains:params.searchTerm,
                        mode:"insensitive"
                    }
                }
            ] */
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            OR: ['name', 'email', 'contractNumber'].map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map((field) => ({
                [field]: {
                    equals: filterData[field]
                }
            }))
        });
    }
    andCondition.push({
        isDeleted: false
    });
    // console.dir(andCondition,{depth:'infinity'});
    const whereCondition = { AND: andCondition };
    const result = yield prisma_1.default.admin.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: sortBy && orderBy ? {
            [sortBy]: orderBy
        } : {
            createdAt: "desc"
        }
    });
    const total = yield prisma_1.default.admin.count({
        where: whereCondition
    });
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
});
const getbyIdFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.admin.findUnique({
        where: {
            id,
            isDeleted: false
        }
    });
    return result;
});
const updateIntoDb = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    const result = yield prisma_1.default.admin.update({
        where: {
            id
        },
        data
    });
    return result;
});
const deleteFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const adminDeletedData = yield transactionClient.admin.delete({
            where: {
                id
            }
        });
        yield transactionClient.user.delete({
            where: {
                email: adminDeletedData.email
            }
        });
        return adminDeletedData;
    }));
    return result;
});
const softDeleteFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.admin.findUniqueOrThrow({
        where: {
            id
        }
    });
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const adminDeletedData = yield transactionClient.admin.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        });
        yield transactionClient.user.update({
            where: {
                email: adminDeletedData.email
            },
            data: {
                status: "DELETED"
            }
        });
        return adminDeletedData;
    }));
    return result;
});
exports.AdminService = {
    getAllFromDb,
    getbyIdFromDb,
    updateIntoDb,
    deleteFromDb,
    softDeleteFromDb
};
