import { Request, Response } from 'express';
import { getAllFolders, getFolderById } from '../models/folderModel';

// 모든 폴더 조회 컨트롤러
export const getFoldersController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const folders = await getAllFolders();
    res.status(200).json({ folders });  // 응답 후 별도 return 필요 없음
  } catch (error) {
    res.status(500).json({ message: '폴더 조회 중 오류가 발생했습니다.', error });
  }
};

// 특정 폴더 조회 컨트롤러
export const getFolderByIdController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  try {
    const folder = await getFolderById(Number(id));
    if (!folder) {
      res.status(404).json({ message: '폴더를 찾을 수 없습니다.' });
      return;
    }
    res.status(200).json({ folder });
  } catch (error) {
    res.status(500).json({ message: '폴더 조회 중 오류가 발생했습니다.', error });
  }
};
