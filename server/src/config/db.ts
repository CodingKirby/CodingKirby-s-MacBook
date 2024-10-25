// 데이터베이스 연결 설정
import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Google Cloud SQL 연결 설정
export const pool = createPool({
  host: process.env.DB_HOST,            // Google Cloud SQL 인스턴스의 공인 IP 주소
  user: process.env.DB_USER,            // 생성한 데이터베이스 사용자
  password: process.env.DB_PASSWORD,    // 해당 사용자의 비밀번호
  database: process.env.DB_NAME,        // 데이터베이스 이름
  port: parseInt(process.env.DB_PORT || '3306', 10), // 포트 번호 (기본 3306)
  connectionLimit: 10,                  // 최대 연결 수
  timezone: '+09:00',                   // 시간대 설정
});

export default pool;