"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMemoController = exports.updateMemoController = exports.getMemoByIdController = exports.getMemosController = exports.createMemoController = void 0;
const memoModel_1 = require("../models/memoModel"); // 모델 불러오기
// 메모 생성 컨트롤러
const createMemoController = async (req, res) => {
    const { title, content, password, folder_id } = req.body;
    if (!title || !content || !password || !folder_id) {
        res.status(400).json({ message: '모든 필드를 입력해주세요.' });
        return;
    }
    try {
        const newMemo = await (0, memoModel_1.createMemo)(title, content, password, folder_id);
        res.status(201).json({ message: '메모가 성공적으로 생성되었습니다.', memo: newMemo });
    }
    catch (error) {
        res.status(500).json({ message: '메모 생성 중 오류가 발생했습니다.', error: error.message });
    }
};
exports.createMemoController = createMemoController;
// 모든 메모 조회 컨트롤러
const getMemosController = async (_req, res) => {
    try {
        const memos = await (0, memoModel_1.getAllMemos)();
        res.status(200).json({ memos });
    }
    catch (error) {
        res.status(500).json({ message: '메모 조회 중 오류가 발생했습니다.', error: error.message });
    }
};
exports.getMemosController = getMemosController;
// 특정 메모 조회 컨트롤러
const getMemoByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const memo = await (0, memoModel_1.getMemoById)(Number(id));
        if (!memo) {
            res.status(404).json({ message: '해당 메모를 찾을 수 없습니다.' });
            return;
        }
        res.status(200).json({ memo });
    }
    catch (error) {
        res.status(500).json({ message: '메모 조회 중 오류가 발생했습니다.', error: error.message });
    }
};
exports.getMemoByIdController = getMemoByIdController;
// 메모 수정 컨트롤러
const updateMemoController = async (req, res) => {
    const { id } = req.params;
    const { title, content, password } = req.body;
    if (!title || !content || !password) {
        res.status(400).json({ message: '모든 필드를 입력해주세요.' });
        return;
    }
    try {
        const updatedMemo = await (0, memoModel_1.updateMemo)(Number(id), title, content, password);
        if (!updatedMemo) {
            res.status(404).json({ message: '해당 메모를 찾을 수 없습니다.' });
            return;
        }
        res.status(200).json({ message: '메모가 성공적으로 수정되었습니다.', memo: updatedMemo });
    }
    catch (error) {
        res.status(500).json({ message: '메모 수정 중 오류가 발생했습니다.', error: error.message });
    }
};
exports.updateMemoController = updateMemoController;
// 메모 삭제 컨트롤러
const deleteMemoController = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    if (!password) {
        res.status(400).json({ message: '비밀번호를 입력해주세요.' });
        return;
    }
    try {
        const deletedMemo = await (0, memoModel_1.deleteMemo)(Number(id), password);
        if (!deletedMemo) {
            res.status(404).json({ message: '해당 메모를 찾을 수 없습니다.' });
            return;
        }
        res.status(200).json({ message: '메모가 성공적으로 삭제되었습니다.' });
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : '서버 오류';
        res.status(500).json({ message: '메모 삭제 중 오류가 발생했습니다.', error: errorMessage });
    }
};
exports.deleteMemoController = deleteMemoController;
