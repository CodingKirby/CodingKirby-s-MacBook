"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const folderController_1 = require("../controllers/folderController"); // 폴더 컨트롤러 불러오기
const router = express_1.default.Router();
// 모든 폴더 조회
router.get('/', folderController_1.getFoldersController);
// 특정 폴더 조회
router.get('/:id', folderController_1.getFolderByIdController);
exports.default = router;
