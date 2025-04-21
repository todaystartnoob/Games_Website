// server.js
require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const path     = require('path');

const app      = express();
const PORT     = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI
  || 'mongodb://localhost:27017/games';

// 1) MongoDB 연결
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 2) 스키마 정의
const goodSchema = new mongoose.Schema({
  name:        { type: String,  required: true },
  price:       { type: Number,  required: true },
  category:    { type: String },
  imageUrl:    { type: String },
  description: { type: String }
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  orderId:         { type: String, required: true },
  orderName:       { type: String, required: true },
  quantity:        { type: Number, required: true },
  customerName:    { type: String },
  customerPhone:   { type: String },
  customerAddress: { type: String }
}, { timestamps: true });

const Good  = mongoose.model('Good', goodSchema);
const Order = mongoose.model('Order', orderSchema);


// 3) 상품 관리 API

// (1) 전체 상품 조회
app.get('/api/goods', async (req, res) => {
  try {
    const goods = await Good.find().sort({ createdAt: -1 });
    res.json(goods);
  } catch (err) {
    res.status(500).json({ error: '상품 조회 중 오류가 발생했습니다.' });
  }
});

// (2) 단일 상품 조회
app.get('/api/goods/:id', async (req, res) => {
  try {
    const good = await Good.findById(req.params.id);
    if (!good) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    res.json(good);
  } catch (err) {
    res.status(500).json({ error: '상품 조회 중 오류가 발생했습니다.' });
  }
});

// (3) 상품 추가
app.post('/api/goods', async (req, res) => {
  try {
    const good = new Good(req.body);
    await good.save();
    res.status(201).json(good);
  } catch (err) {
    res.status(400).json({ error: '상품 생성에 실패했습니다.' });
  }
});

// (4) 상품 수정
app.put('/api/goods/:id', async (req, res) => {
  try {
    const good = await Good.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!good) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    res.json(good);
  } catch (err) {
    res.status(400).json({ error: '상품 수정에 실패했습니다.' });
  }
});

// (5) 상품 삭제
app.delete('/api/goods/:id', async (req, res) => {
  try {
    await Good.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: '상품 삭제 중 오류가 발생했습니다.' });
  }
});


// 4) 주문 요청 API

// 기존에 console.log만 하시던 부분을, 이제 DB에도 저장합니다.
app.post('/api/order', async (req, res) => {
  try {
    const { orderId, orderName, customerName, customerPhone, customerAddress, quantity } = req.body;

    console.log('📦 새 주문 요청 도착:');
    console.log({ orderId, orderName, quantity, customerName, customerPhone, customerAddress });

    const order = new Order({
      orderId,
      orderName,
      quantity,
      customerName,
      customerPhone,
      customerAddress
    });
    await order.save();

    res.json({ message: '주문이 접수되었습니다. 감사합니다!', order });
  } catch (err) {
    console.error('주문 처리 오류:', err);
    res.status(500).json({ error: '주문 처리 중 오류가 발생했습니다.' });
  }
});

// (Optional) 주문 내역 조회 API
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: '주문 목록 조회 중 오류가 발생했습니다.' });
  }
});


// 5) 서버 실행
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
