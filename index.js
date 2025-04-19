app.post('/api/select',(req,res)=>{
    const {productID} = req.bod
})

app.post('/api/order', (req, res) => {
  const { orderId, orderName, customerName, contact } = req.body

  console.log('📦 새 주문 요청 도착:')
  console.log('주문번호:', orderId)
  console.log('상품명:', orderName)
  console.log('구매자 이름:', customerName)
  console.log('연락처:', contact)

  res.json({ message: '주문이 접수되었습니다. 감사합니다!' })
})

app.listen(3000, () => {
  console.log('✅ 테스트 서버 실행 중: http://서버IP:3000')
})
