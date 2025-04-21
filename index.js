require('dotenv').config();
const express  = require('express');
const cors     = require('cors'); 
const mongoose = require('mongoose');
const path     = require('path');
const morgan   = require('morgan');

const app      = express();
const PORT     = 3000;
const MONGO_URI = 'mongodb+srv://admin_for_games:KDMHS_games_is_best@dimirun.jc4jxxe.mongodb.net/';

app.use(cors());

// 1) MongoDB 연결
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// 2) 공통 미들웨어
app.use(morgan('dev'));       
app.use(express.json());      

// 3) Mongoose 스키마/모델
const goodSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  price:       { type: Number, required: true },
  category:    { type: String },
  imageUrl:    { type: String },
  description: { type: String }
}, { timestamps: true });
const Good = mongoose.model('Good', goodSchema);

// --- API 라우트들 ---

// 전체 상품 조회
app.get('/api/goods', async (req, res) => {
  console.log('📣 GET /api/goods called');
  try {
    const goods = await Good.find().sort({ createdAt: -1 });
    res.json(goods);
  } catch (err) {
    res.status(500).json({ error: '상품 조회 중 오류가 발생했습니다.' });
  }
});

// 단일 상품 조회
app.get('/api/goods/:id', async (req, res) => {
  console.log(`📣 GET /api/goods/${req.params.id} called`);
  try {
    const good = await Good.findById(req.params.id);
    if (!good) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    res.json(good);
  } catch (err) {
    res.status(500).json({ error: '상품 조회 중 오류가 발생했습니다.' });
  }
});

// 상품 추가
app.post('/api/goods', async (req, res) => {
  console.log('📣 POST /api/goods called', req.body);
  try {
    const good = new Good(req.body);
    await good.save();
    res.status(201).json(good);
  } catch (err) {
    res.status(400).json({ error: '상품 생성에 실패했습니다.' });
  }
});

// 상품 수정
app.put('/api/goods/:id', async (req, res) => {
  console.log(`📣 PUT /api/goods/${req.params.id} called`, req.body);
  try {
    const good = await Good.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!good) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    res.json(good);
  } catch (err) {
    res.status(400).json({ error: '상품 수정에 실패했습니다.' });
  }
});

// 상품 삭제
app.delete('/api/goods/:id', async (req, res) => {
  console.log(`📣 DELETE /api/goods/${req.params.id} called`);
  try {
    await Good.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: '상품 삭제 중 오류가 발생했습니다.' });
  }
});

//비밀번호 확인
app.post('/api/manage', async(req, res)=> {
    console.log('🔑 관리 페이지 비밀번호 입력:', req.body.password);
    try {
        const { password } = req.body;
        if (password == 'games_is_best') {
          return res.json({ success: true });
        } else {
          return res.status(401).json({ success: false });
        }
    } catch (err) {
        console.error('관리 페이지 인증 중 오류:', err);
        return res.status(500).json({ error: '오류가 발생했습니다.' });
    }
});

// 4) 정적 파일 서빙 (반드시 API 라우트 다음에)
app.use(express.static(path.join(__dirname, 'public')));

// 5) SPA 라우팅 대응: 정의되지 않은 모든 GET 요청을 manage.html 로
app.get('*all', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'manage.html'));
});

// 6) 서버 시작
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
