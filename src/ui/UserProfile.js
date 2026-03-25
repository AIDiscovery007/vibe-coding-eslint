// ============================================================
// 🖼️ UI 层 (Presentation Layer) — 用户界面
// 职责：展示数据，处理用户交互
// 允许引用：service 层 ✅
// 禁止引用：data 层 ❌ （必须通过 service 层中转）
// ============================================================

// ✅ 正确：UI 层通过 Service 层获取数据
import { getUserDetail } from '../service/userService.js';

/**
 * 渲染用户信息卡片
 */
export function renderUserProfile(userId) {
  const user = getUserDetail(userId);
  return `
    <div class="user-card">
      <h2>${user.name}</h2>
      <p>${user.email}</p>
    </div>
  `;
}
