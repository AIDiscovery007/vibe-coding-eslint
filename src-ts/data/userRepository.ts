// ============================================================
// 📦 数据层 TypeScript 版本
// ============================================================

export interface User {
  id: number;
  name: string;
  email: string;
}

// ✅ 合规：参数和返回值都有明确类型
export function queryUserById(id: number): User {
  return { id, name: '张三', email: 'zhangsan@example.com' };
}

// ✅ 合规
export function saveUser(user: User): boolean {
  return true;
}
