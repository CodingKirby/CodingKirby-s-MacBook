import { Request, Response, NextFunction } from 'express';
import { getMemoById } from '../models/memoModel'; // 모델의 경로를 맞게 설정
import bcrypt from 'bcrypt';

export const validatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) {
    res.status(400).json({ error: '비밀번호가 필요합니다.' });
    return; // 이 경우 다음 미들웨어로 넘어가지 않음
  }

  try {
    const memo = await getMemoById(Number(id));

    if (!memo || !memo.password) { // password 확인
      res.status(404).json({ error: '메모를 찾을 수 없거나 비밀번호가 설정되지 않았습니다.' });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, memo.password);
    if (!isPasswordCorrect) {
      res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
      return;
    }

    next(); // 비밀번호가 올바를 경우 다음 미들웨어로 넘어감
  } catch (error) {
    res.status(500).json({ error: '서버 오류' });
  }
};
