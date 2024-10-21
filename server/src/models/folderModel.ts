import { RowDataPacket } from 'mysql2/promise';
import db from '../config/db'; // 데이터베이스 설정 불러오기

// 모든 폴더 조회
export const getAllFolders = async (): Promise<RowDataPacket[]> => {
  const [folders] = await db.query<RowDataPacket[]>('SELECT * FROM folders'); // folders 테이블에서 모든 폴더 조회
  return folders;
};

// 폴더 ID로 특정 폴더 조회
export const getFolderById = async (id: number): Promise<RowDataPacket | null> => {
  const [folder] = await db.query<RowDataPacket[]>('SELECT * FROM folders WHERE id = ?', [id]); // 특정 ID에 해당하는 폴더 조회

  if (folder.length === 0) {
    return null; // 폴더가 없을 경우 null 반환
  }

  return folder[0]; // 첫 번째 결과 리턴
};
