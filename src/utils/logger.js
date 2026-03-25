// ============================================================
// 📝 Logger 模块 - 统一日志输出
// ============================================================

export const logger = {
  info: (...args) => console.log('[INFO]', ...args),
  warn: (...args) => console.warn('[WARN]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
};
