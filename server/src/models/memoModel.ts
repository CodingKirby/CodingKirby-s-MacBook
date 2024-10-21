// 메모 모델 정의 (데이터베이스 쿼리)
import { ResultSetHeader } from 'mysql2';
import { pool } from '../config/db';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt';

export const createMemo = async (title: string, content: string, password: string, folder_id: number) => {
  const hashedPassword = await bcrypt.hash(password, 10);  // 비밀번호 해싱
  const query = `INSERT INTO memos (title, content, password, folder_id) VALUES (?, ?, ?, ?)`;
  const [result] = await pool.execute<ResultSetHeader>(query, [title, content, hashedPassword, folder_id]);

  const insertedMemoId = result.insertId;
  const [rows]: [any[], any] = await pool.execute(
    `SELECT id, created_at FROM memos WHERE id = ?`,
    [insertedMemoId]
  );

  return {
    id: rows[0].id,
    created_at: rows[0].created_at,
  };
};

export const getAllMemos = async () => {
  const query = `SELECT id, folder_id, title, content, created_at FROM memos`;
  const [rows] = await pool.query(query);
  return rows;
};

export const getMemoById = async (id: number) => {
  const query = `SELECT id, title, content, password FROM memos WHERE id = ?`; // password 포함
  const [rows] = await pool.execute<RowDataPacket[]>(query, [id]);
  return rows[0]; // rows[0]이 memo를 반환하는지 확인
};


export const updateMemo = async (id: number, title: string, content: string, _password: string) => {
  const query = `UPDATE memos SET title = ?, content = ? WHERE id = ?`;
  const [result] = await pool.execute(query, [title, content, id]);
  return result;
};

export const deleteMemo = async (id: number, password: string) => {
  const query = `SELECT password FROM memos WHERE id = ?`;
  
  // RowDataPacket[] 타입으로 반환 값을 명시적으로 지정
  const [rows] = await pool.execute<RowDataPacket[]>(query, [id]);

  // rows[0]에 접근하기 전에 rows의 길이를 확인
  if (rows.length === 0) {
    throw new Error('해당 메모를 찾을 수 없습니다.');
  }

  const memo = rows[0];

  // 비밀번호 검증
  const isPasswordCorrect = await bcrypt.compare(password, memo.password);
  if (!isPasswordCorrect) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }

  // 비밀번호가 일치하면 메모 삭제
  const deleteQuery = `DELETE FROM memos WHERE id = ?`;
  const [result] = await pool.execute(deleteQuery, [id]);

  return result;
};