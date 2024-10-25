import express from 'express';
import { getFoldersController, getFolderByIdController } from '../controllers/folderController'; // 폴더 컨트롤러 불러오기

const router = express.Router();

// 모든 폴더 조회
router.get('/', getFoldersController);

// 특정 폴더 조회
router.get('/:id', getFolderByIdController);

export default router;
