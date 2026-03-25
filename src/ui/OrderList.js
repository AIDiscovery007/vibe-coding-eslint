// ============================================================
// 🖼️ UI 层 — 订单列表
// ============================================================

// ✅ 正确：通过 service 层
import { getUserOrders } from '../service/orderService.js';

/**
 * 渲染订单列表
 */
export function renderOrderList(userId) {
  const { orders, totalAmount } = getUserOrders(userId);
  return `
    <div class="order-list">
      <h3>订单列表 (总计: ¥${totalAmount})</h3>
      <ul>
        ${orders.map(o => `<li>${o.product} - ¥${o.price}</li>`).join('')}
      </ul>
    </div>
  `;
}

/**
 * 渲染原始订单（通过 service 层）
 */
export function renderRawOrders(userId) {
  const { orders } = getUserOrders(userId);
  return JSON.stringify(orders);
}
