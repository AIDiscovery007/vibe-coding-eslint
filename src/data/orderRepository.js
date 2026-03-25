// ============================================================
// 📦 数据层 (Data Layer) — 订单数据仓库
// ============================================================

export function queryOrdersByUserId(userId) {
  return [
    { id: 1, userId, product: 'ESLint实战指南', price: 99 },
    { id: 2, userId, product: '架构设计精要', price: 128 },
  ];
}

export function insertOrder(order) {
  console.log('插入订单:', order);
  return { ...order, id: Date.now() };
}
