// server.js
const express = require('express');
const cors = require('cors');
const app = express();

// 미들웨어 설정
app.use(cors());                   // CORS 허용
app.use(express.json());           // JSON 바디 파싱

// 샘플 상품 데이터 (추후 실제 DB 또는 JSON 파일 로드로 대체)
const products = [
  {
    id: 1,
    game: 'GAMES',
    name: '키캡 세트',
    image: '../IMAGES/goods/test.jpg',
    description: 'SuperGame 한정판 키캡 세트',
    price: 25000
  },
  {
    id: 2,
    game: 'stackit',
    name: '티셔츠',
    image: '../IMAGES/goods/test.jpg',
    description: 'MegaQuest 공식 티셔츠',
    price: 15000
  },
  {
    id: 3,
    game: 'dreamgate',
    name: '스티커 팩',
    image: '../IMAGES/goods/test.jpg',
    description: 'SuperGame 스티커 팩 (10종)',
    price: 5000
  }
];

// 1) 상품 목록 반환 엔드포인트
app.get('/api/products', (req, res) => {
  res.json(products);
});

// 3) 주문 처리 엔드포인트
app.post('/api/order', (req, res) => {
  const { orderId, orderName, customerName, contact } = req.body;
  console.log('📦 새 주문 요청 도착:');
  console.log('주문번호:', orderId);
  console.log('상품명:', orderName);
  console.log('구매자 이름:', customerName);
  console.log('연락처:', contact);
  // TODO: 실제 DB 저장 로직 추가
  res.json({ message: '주문이 접수되었습니다. 감사합니다!' });
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ 테스트 서버 실행 중: http://서버IP:${PORT}`);
});
