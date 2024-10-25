"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const folder_1 = __importDefault(require("./routes/folder"));
const memo_1 = __importDefault(require("./routes/memo")); // memoRoutes 불러오기
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// path.join의 반환 값이 문자열임을 명확히 처리
const publicPath = path_1.default.join(__dirname, 'public');
app.use(express_1.default.static(publicPath)); // 여기에 명확하게 문자열로 처리
// 기본 루트 경로
app.get('/', (_req, res) => {
    res.send('Hello, World!');
});
// 폴더 라우터 등록
app.use('/folders', folder_1.default);
// '/memos' 경로에 대해 memoRoutes 라우터 사용
app.use('/memos', memo_1.default);
exports.default = app;
