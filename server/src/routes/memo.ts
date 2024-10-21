import express from 'express';
import { 
  createMemoController, 
  getMemosController, 
  getMemoByIdController, 
  updateMemoController, 
  deleteMemoController 
} from '../controllers/memoController'; // 컨트롤러 불러오기
import { validatePassword } from '../middlewares/validatePassword'; // 비밀번호 검증 미들웨어

const router = express.Router();

// 메모 생성
router.post('/', createMemoController);

// 모든 메모 조회
router.get('/', getMemosController);

// 특정 메모 조회
router.get('/:id', getMemoByIdController);

// 메모 수정 (비밀번호 검증 필요)
router.put('/:id', validatePassword, updateMemoController);

// 메모 삭제 (비밀번호 검증 필요)
router.delete('/:id', validatePassword, deleteMemoController);

export default router;
