// ============================================================
// ⚙️ 服务层 (Service Layer) — 订单业务逻辑
// ============================================================

import { queryOrdersByUserId, insertOrder } from '../data/orderRepository.js';
import { queryUserById } from '../data/userRepository.js';

/**
 * 获取用户的订单列表（含业务逻辑：计算总金额）
 */
export function getUserOrders(userId) {
  const user = queryUserById(userId);
  const orders = queryOrdersByUserId(userId);
  const totalAmount = orders.reduce((sum, o) => sum + o.price, 0);
  return { user: user.name, orders, totalAmount };
}

/**
 * 创建订单（含业务校验）
 */
export function createOrder(userId, product, price) {
  if (price <= 0) {
    throw new Error('价格必须大于0');
  }
  return insertOrder({ userId, product, price });
}
