// ============================================================
// 📦 数据层 (Data Layer) — 直接与数据库/API交互
// 职责：只做数据的 CRUD，不包含业务逻辑
// ============================================================

/**
 * 模拟从数据库查询用户
 */
export function queryUserById(id) {
  // 模拟数据库查询
  return { id, name: '张三', email: 'zhangsan@example.com' };
}

/**
 * 模拟保存用户到数据库
 */
import { logger } from "../../utils/logger.js";

export function saveUser(user) {
  logger.info('保存用户到数据库:', user);
  return true;
}
