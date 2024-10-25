"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
// 데이터베이스 연결 설정
const promise_1 = require("mysql2/promise");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Google Cloud SQL 연결 설정
exports.pool = (0, promise_1.createPool)({
    host: process.env.DB_HOST, // Google Cloud SQL 인스턴스의 공인 IP 주소
    user: process.env.DB_USER, // 생성한 데이터베이스 사용자
    password: process.env.DB_PASSWORD, // 해당 사용자의 비밀번호
    database: process.env.DB_NAME, // 데이터베이스 이름
    port: parseInt(process.env.DB_PORT || '3306', 10), // 포트 번호 (기본 3306)
    connectionLimit: 10, // 최대 연결 수
    timezone: '+09:00', // 시간대 설정
});
exports.default = exports.pool;
