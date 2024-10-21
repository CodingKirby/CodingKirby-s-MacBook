import { Request, Response } from 'express';
import { createMemo, getAllMemos, getMemoById, updateMemo, deleteMemo } from '../models/memoModel'; // 모델 불러오기

// 메모 생성 컨트롤러
export const createMemoController = async (req: Request, res: Response): Promise<void> => {
  const { title, content, password, folder_id } = req.body;

  if (!title || !content || !password || !folder_id) {
    res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    return;
  }

  try {
    const newMemo = await createMemo(title, content, password, folder_id);
    res.status(201).json({ message: '메모가 성공적으로 생성되었습니다.', memo: newMemo });
  } catch (error: any) {
    res.status(500).json({ message: '메모 생성 중 오류가 발생했습니다.', error: error.message });
  }
};

// 모든 메모 조회 컨트롤러
export const getMemosController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const memos = await getAllMemos();
    res.status(200).json({ memos });
  } catch (error: any) {
    res.status(500).json({ message: '메모 조회 중 오류가 발생했습니다.', error: error.message });
  }
};

// 특정 메모 조회 컨트롤러
export const getMemoByIdController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  try {
    const memo = await getMemoById(Number(id));
    if (!memo) {
      res.status(404).json({ message: '해당 메모를 찾을 수 없습니다.' });
      return;
    }
    res.status(200).json({ memo });
  } catch (error: any) {
    res.status(500).json({ message: '메모 조회 중 오류가 발생했습니다.', error: error.message });
  }
};

// 메모 수정 컨트롤러
export const updateMemoController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, content, password } = req.body;

  if (!title || !content || !password) {
    res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    return;
  }

  try {
    const updatedMemo = await updateMemo(Number(id), title, content, password);
    if (!updatedMemo) {
      res.status(404).json({ message: '해당 메모를 찾을 수 없습니다.' });
      return;
    }
    res.status(200).json({ message: '메모가 성공적으로 수정되었습니다.', memo: updatedMemo });
  } catch (error: any) {
    res.status(500).json({ message: '메모 수정 중 오류가 발생했습니다.', error: error.message });
  }
};

// 메모 삭제 컨트롤러
export const deleteMemoController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) {
    res.status(400).json({ message: '비밀번호를 입력해주세요.' });
    return;
  }

  try {
    const deletedMemo = await deleteMemo(Number(id), password);
    if (!deletedMemo) {
      res.status(404).json({ message: '해당 메모를 찾을 수 없습니다.' });
      return;
    }
    res.status(200).json({ message: '메모가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : '서버 오류';
    res.status(500).json({ message: '메모 삭제 중 오류가 발생했습니다.', error: errorMessage });
  }
};