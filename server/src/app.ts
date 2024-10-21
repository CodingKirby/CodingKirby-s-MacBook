import express, { Request, Response } from 'express';
import path from 'path';
import logger from 'morgan';
import folderRoutes from './routes/folder';
import memoRoutes from './routes/memo';  // memoRoutes 불러오기

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// path.join의 반환 값이 문자열임을 명확히 처리
const publicPath: string = path.join(__dirname, 'public');
app.use(express.static(publicPath));  // 여기에 명확하게 문자열로 처리

// 기본 루트 경로
app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, World!');
});

// 폴더 라우터 등록
app.use('/folders', folderRoutes);

// '/memos' 경로에 대해 memoRoutes 라우터 사용
app.use('/memos', memoRoutes);

export default app;
