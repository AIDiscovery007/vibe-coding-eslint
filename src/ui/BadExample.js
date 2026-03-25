// ============================================================
// 🎯 故意违规的示例文件 — 用来触发两条规则
// ============================================================

// ✅ 通过 service 层获取数据
import { getUserDetail } from '../service/userService.js';

// ✅ 符合命名规范：使用 render 前缀
export function renderUserData(id) {
  return getUserDetail(id);
}

// ✅ 符合命名规范：使用 show 前缀
export const showProfile = (id) => {
  return getUserDetail(id);
};

// ✅ 合格：以 render 开头
export function renderBadge(user) {
  return `<span>${user.name}</span>`;
}
