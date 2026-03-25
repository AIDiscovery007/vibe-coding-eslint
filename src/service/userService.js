// ============================================================
// ⚙️ 服务层 (Service Layer) — 业务逻辑
// 职责：编排数据层，包含业务规则
// 允许引用：data 层 ✅
// 禁止引用：ui 层 ❌
// ============================================================

import { queryUserById, saveUser } from '../data/userRepository.js';

/**
 * 获取用户详情 —— 包含业务逻辑（如：数据脱敏）
 */
export function getUserDetail(id) {
  const user = queryUserById(id);
  return {
    ...user,
    email: user.email.replace(/(.{3}).+(@.+)/, '$1***$2'), // 邮箱脱敏
  };
}

/**
 * 注册新用户 —— 包含业务校验
 */
export function registerUser(name, email) {
  if (!name || name.length < 2) {
    throw new Error('用户名至少2个字符');
  }
  if (!email.includes('@')) {
    throw new Error('邮箱格式不正确');
  }
  return saveUser({ name, email, createdAt: new Date().toISOString() });
}
