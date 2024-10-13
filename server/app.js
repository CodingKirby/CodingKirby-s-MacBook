const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const memoRoutes = require('./routes/memoRoutes');
const app = express();

app.use(express.json());

// MongoDB 연결 설정
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// API 라우트 설정
app.use('/api/memo', memoRoutes);

// 정적 파일 제공 (프론트엔드 빌드 파일)
app.use(express.static(path.join(__dirname, '../frontend/build')));

// 모든 요청을 React의 index.html로 라우팅
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// 서버 실행
app.listen(3000, () => console.log('Server running on port 3000'));
