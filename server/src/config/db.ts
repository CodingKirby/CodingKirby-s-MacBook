// 데이터베이스 연결 설정
import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  timezone: '+09:00'
});

export default pool;
