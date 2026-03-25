// ============================================================
// ⚙️ 服务层 TypeScript 版本 — 包含多种"偷懒"写法
//
// 📖 教学目的：
//    展示 tsc 放行但 Linter 会拦截的各种情况
// ============================================================

import { queryUserById, saveUser, User } from '../data/userRepository';

// ——————————————————————————————————
// ❌ 违规1：使用 any 类型
//    tsc 不报错（any 是合法类型）
//    但 Linter 的 no-explicit-any 规则会拦截
// ——————————————————————————————————
export function processUserData(data: any): any {
  return data;
}

// ——————————————————————————————————
// ❌ 违规2：参数没有类型注解
//    在 tsconfig strict 模式下 tsc 会报错
//    Linter 的 typedef 规则也会报错（双重保障）
// ——————————————————————————————————
// @ts-ignore — 为了演示 Linter 效果，先忽略 tsc 报错
export function getUserDetail(id) {
  const user = queryUserById(id);
  return {
    ...user,
    email: user.email.replace(/(.{3}).+(@.+)/, '$1***$2'),
  };
}

// ——————————————————————————————————
// ❌ 违规3：返回值没有类型注解
//    tsc 能推断出来所以不报错
//    但 Linter 可以强制你写明确的返回类型
// ——————————————————————————————————
export function registerUser(name: string, email: string) {
  if (!name || name.length < 2) {
    throw new Error('用户名至少2个字符');
  }
  return saveUser({ id: 0, name, email });
}

// ——————————————————————————————————
// ✅ 合规：参数和返回值都有明确类型，没有 any
// ——————————————————————————————————
export function getValidatedUser(id: number): User | null {
  if (id <= 0) return null;
  return queryUserById(id);
}
