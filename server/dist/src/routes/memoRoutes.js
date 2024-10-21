"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const memoController_1 = require("../controllers/memoController");
const validatePassword_1 = require("../middlewares/validatePassword"); // 비밀번호 검증 미들웨어
const router = express_1.default.Router();
// 메모 생성 (비밀번호를 함께 저장)
router.post('/', memoController_1.createMemoController);
// 모든 메모 조회
router.get('/', memoController_1.getMemosController);
// 특정 메모 조회
router.get('/:id', memoController_1.getMemoByIdController);
// 메모 수정 (비밀번호 검증 후 수정)
router.put('/:id', validatePassword_1.validatePassword, memoController_1.updateMemoController);
// 메모 삭제 (비밀번호 검증 후 삭제)
router.delete('/:id', validatePassword_1.validatePassword, memoController_1.deleteMemoController);
exports.default = router;
