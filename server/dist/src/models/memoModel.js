"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMemo = exports.updateMemo = exports.getMemoById = exports.getAllMemos = exports.createMemo = void 0;
const db_1 = require("../config/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createMemo = async (title, content, password, folder_id) => {
    const hashedPassword = await bcrypt_1.default.hash(password, 10); // 비밀번호 해싱
    const query = `INSERT INTO memos (title, content, password, folder_id) VALUES (?, ?, ?, ?)`;
    const [result] = await db_1.pool.execute(query, [title, content, hashedPassword, folder_id]);
    const insertedMemoId = result.insertId;
    const [rows] = await db_1.pool.execute(`SELECT id, created_at FROM memos WHERE id = ?`, [insertedMemoId]);
    return {
        id: rows[0].id,
        created_at: rows[0].created_at,
    };
};
exports.createMemo = createMemo;
const getAllMemos = async () => {
    const query = `SELECT id, folder_id, title, content, created_at FROM memos`;
    const [rows] = await db_1.pool.query(query);
    return rows;
};
exports.getAllMemos = getAllMemos;
const getMemoById = async (id) => {
    const query = `SELECT id, title, content, password FROM memos WHERE id = ?`; // password 포함
    const [rows] = await db_1.pool.execute(query, [id]);
    return rows[0]; // rows[0]이 memo를 반환하는지 확인
};
exports.getMemoById = getMemoById;
const updateMemo = async (id, title, content, _password) => {
    const query = `UPDATE memos SET title = ?, content = ? WHERE id = ?`;
    const [result] = await db_1.pool.execute(query, [title, content, id]);
    return result;
};
exports.updateMemo = updateMemo;
const deleteMemo = async (id, password) => {
    const query = `SELECT password FROM memos WHERE id = ?`;
    // RowDataPacket[] 타입으로 반환 값을 명시적으로 지정
    const [rows] = await db_1.pool.execute(query, [id]);
    // rows[0]에 접근하기 전에 rows의 길이를 확인
    if (rows.length === 0) {
        throw new Error('해당 메모를 찾을 수 없습니다.');
    }
    const memo = rows[0];
    // 비밀번호 검증
    const isPasswordCorrect = await bcrypt_1.default.compare(password, memo.password);
    if (!isPasswordCorrect) {
        throw new Error('비밀번호가 일치하지 않습니다.');
    }
    // 비밀번호가 일치하면 메모 삭제
    const deleteQuery = `DELETE FROM memos WHERE id = ?`;
    const [result] = await db_1.pool.execute(deleteQuery, [id]);
    return result;
};
exports.deleteMemo = deleteMemo;
