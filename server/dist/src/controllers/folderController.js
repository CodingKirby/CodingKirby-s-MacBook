"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFolderByIdController = exports.getFoldersController = void 0;
const folderModel_1 = require("../models/folderModel");
// 모든 폴더 조회 컨트롤러
const getFoldersController = async (_req, res) => {
    try {
        const folders = await (0, folderModel_1.getAllFolders)();
        res.status(200).json({ folders }); // 응답 후 별도 return 필요 없음
    }
    catch (error) {
        res.status(500).json({ message: '폴더 조회 중 오류가 발생했습니다.', error });
    }
};
exports.getFoldersController = getFoldersController;
// 특정 폴더 조회 컨트롤러
const getFolderByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const folder = await (0, folderModel_1.getFolderById)(Number(id));
        if (!folder) {
            res.status(404).json({ message: '폴더를 찾을 수 없습니다.' });
            return;
        }
        res.status(200).json({ folder });
    }
    catch (error) {
        res.status(500).json({ message: '폴더 조회 중 오류가 발생했습니다.', error });
    }
};
exports.getFolderByIdController = getFolderByIdController;
