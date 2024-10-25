"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFolderById = exports.getAllFolders = void 0;
const db_1 = __importDefault(require("../config/db")); // 데이터베이스 설정 불러오기
// 모든 폴더 조회
const getAllFolders = async () => {
    const [folders] = await db_1.default.query('SELECT * FROM folders'); // folders 테이블에서 모든 폴더 조회
    return folders;
};
exports.getAllFolders = getAllFolders;
// 폴더 ID로 특정 폴더 조회
const getFolderById = async (id) => {
    const [folder] = await db_1.default.query('SELECT * FROM folders WHERE id = ?', [id]); // 특정 ID에 해당하는 폴더 조회
    if (folder.length === 0) {
        return null; // 폴더가 없을 경우 null 반환
    }
    return folder[0]; // 첫 번째 결과 리턴
};
exports.getFolderById = getFolderById;
